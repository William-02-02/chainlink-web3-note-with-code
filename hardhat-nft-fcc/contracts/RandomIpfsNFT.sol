// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFCoordinatorV2_5.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // consumer里面也定义了ownable

error RandomIpfsNFT__RangeOutOfBounds();
error RandomIpfsNFT__NotEnoughEth();
error RandomIpfsNFT__WithdrawFailed();

contract RandomIpfsNFT is VRFConsumerBaseV2Plus, ERC721URIStorage {
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }
    // using chainlink VRF to get random number
    // pic random from Pub, Shiba Inu, St. Bernard

    // pay to mint NFT
    // owner can withdraw the funds
    VRFCoordinatorV2_5 private immutable i_vrfCoordinator;
    uint256 private immutable i_subscriptionId; //这里注意把uint64改成uint256
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    mapping(uint256 => address) private s_requestIdToSender;

    uint256 private s_tokenCounter;
    uint256 private constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    uint256 internal immutable i_mintFee;

    event NFTRequested(uint256 indexed requestId, address indexed requester);
    event NFTMinted(uint256 indexed tokenId, Breed indexed breed, address indexed minter);

    constructor(
        address vrfCoordinatorV2_5,
        uint256 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris,
        uint256 mintFee
    ) VRFConsumerBaseV2Plus(vrfCoordinatorV2_5) ERC721("RandomIpfsNFT", "RINFT") {
        i_vrfCoordinator = VRFCoordinatorV2_5(vrfCoordinatorV2_5);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        s_dogTokenUris = dogTokenUris;
        i_mintFee = mintFee;
    }

    // 准入获得NFT  需要满足条件
    // 1. 支付mint费
    // 通过VRF获得随机数
    function requestNFT() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert RandomIpfsNFT__NotEnoughEth();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_gasLane,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )// 注意这个参数一定要添加 否则测试报错 原生代币支付 eth. 开启一般用于测试环境，实际环境使用的Link即关闭状态
            })
        );

        s_requestIdToSender[requestId] = msg.sender;
        emit NFTRequested(requestId, msg.sender);
    }

    // 获取后改方法会获得随机数
    // 通过随机数获得breed
    // 通过breed获得tokenURI
    // 通过_setTokenURI设置tokenURI
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        address owner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        s_tokenCounter++;

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        Breed breed = getBreedFromModdedRng(moddedRng);
        _safeMint(owner, newTokenId);
        _setTokenURI(newTokenId, s_dogTokenUris[uint256(breed)]);
        emit NFTMinted(newTokenId, breed, owner);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        if (!success) {
            revert RandomIpfsNFT__WithdrawFailed();
        }
    }

    // 通过随机数获得breed
    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceValue();
        // 10 30 100
        // 0-10 10-40 40-100
        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (
                moddedRng >= cumulativeSum &&
                moddedRng < cumulativeSum + chanceArray[i] &&
                moddedRng < MAX_CHANCE_VALUE
            ) {
                return Breed(i);
            }
            // 累加概率 0-10 10-40 40-100
            cumulativeSum += chanceArray[i];
        }
        revert RandomIpfsNFT__RangeOutOfBounds();
    }

    // 获得breed的概率
    function getChanceValue() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getSubscriptionId() public view returns (uint256) {
        return i_subscriptionId;
    }

    function getvrfCoordinatorV2_5() public view returns (VRFCoordinatorV2_5) {
        return i_vrfCoordinator;
    }

    function getDogTokenUris(uint256 index) public view returns (string memory) {
        return s_dogTokenUris[index];
    }
}
