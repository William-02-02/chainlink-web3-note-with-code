// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// Raffle
// Enter the lottery pool  pay
// pick a random winner  verifiably random
// winner to be selected every X minutes  auto
// chainlink oracle-> randomness automated excution(chainlink keeper)
/**
 * @title A sample Raffle Contract
 * @author Aton
 * @notice This contract is for creating an untamperable decentralized smart contract
 * @dev This implements Chainlink VRF V2 and Chainlink Automation
 */

contract Raffle is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    /** Type Declaration */
    enum RaffleState {
        OPEN,
        CALCULATING,
        CLOSED
    }

    /** State Variables */
    uint256 private immutable i_entranceFee;
    address[] private s_players;
    bytes32 private immutable i_gasLane;
    uint256 private immutable i_subId;
    uint32 private immutable i_callbackGasLimit;
    address private s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    uint32 private constant NUM_WORDS = 1;
    uint16 private constant REQUEST_COMFIRMATION = 3;

    constructor(
        uint256 entranceFee,
        address vrfCoordinator,
        bytes32 gasLane,
        uint256 subId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2Plus(vrfCoordinator) {
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;
        i_subId = subId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    /** Events */
    event RaffelEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    /** Error */
    error Raffle__NotEnoughETH();
    error Raffle__TransferFailed();
    error Raffle__NotOpen();
    error Raffle__UpkeepNotNeeded(uint256 balance, uint256 numPlayers, RaffleState raffleState);

    /** Function */
    function enterRaffle() public payable {
        // Not Enough ETH
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETH();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpen();
        }
        s_players.push(msg.sender);
        emit RaffelEnter(msg.sender);
    }

    function check() internal view returns (bool) {
        bool checkInterval = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool checkPlayer = (s_players.length >= 1);
        bool checkState = (s_raffleState == RaffleState.OPEN);
        bool checkBalance = (address(this).balance > 0);
        return (checkBalance && checkPlayer && checkState && checkInterval);
    }

    /**
     * @dev The following should be true:
     * 1. time interval
     * 2. at least one player, and have some ETH
     * 3. subscription is funded with LINK
     * 4. lottery should be OPEN
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = check();
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        // 需要检测checkUpkeep的状态 因为performUpkeep是在链上执行的 checkUpkeep在chainlink节点上（非链） 需要保证只有chainlink节点能够调用它 而不能被外部手动调用
        if (!check()) {
            revert Raffle__UpkeepNotNeeded(address(this).balance, s_players.length, s_raffleState);
        }

        // 更新Raffle状态
        s_raffleState = RaffleState.CALCULATING;
        // 这个s_vrfCoordinator 是父类里的属性 新版直接构造器里传入地址 然后直接用
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_gasLane,
                subId: i_subId,
                requestConfirmations: REQUEST_COMFIRMATION,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                // Set nativePayment to true to pay for VRF requests with Sepolia ETH instead of LINK
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        // 可以删掉这个emit 因为coordinator里面有相关更全面的事件RandomWordsRequested
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /**requestId 可以用这种方法把参数注释掉 就不会警告unused*/,
        uint256[] calldata randomWords
    ) internal override {
        uint256 randomNum = randomWords[0] % s_players.length;
        address recentWinner = s_players[randomNum];
        s_recentWinner = recentWinner;
        s_players = new address[](0);
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;

        //pay winner
        (bool success, ) = payable(s_recentWinner).call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /** view pure function */
    function get_EntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function get_Player(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function get_RecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function get_RaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function get_NumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function get_NumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function get_LastTimestamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function get_RequestConfirmations() public pure returns (uint256) {
        return REQUEST_COMFIRMATION;
    }

    function get_Interval() public view returns (uint256) {
        return i_interval;
    }

    function get_SubId() public view returns (uint256) {
        return i_subId;
    }
}
