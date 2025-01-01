// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

//自定义错误
error FUNDME__NotOwner();

contract FundMe {
    // library用法
    using PriceConvertor for uint256;
    // 使用constant优化gas constant命名规范 大写 下划线
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    // immutable 不可改变 只赋值一次  immutable命名规范 i_owner
    address private immutable i_owner;

    address[] private s_funders;
    AggregatorV3Interface private s_priceFeed;
    mapping(address => uint256) private s_addressToFund;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        // 这里msg.value默认作为getConversionRate的参数，如果有多个就在括号里加
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "not enough!"
        );
        s_funders.push(msg.sender);
        s_addressToFund[msg.sender] += msg.value;
    }

    // modifier 可以添加virtual被继承
    // 修饰器可以接受参数
    modifier onlyOwner() {
        //也可以用 require______，NotOwner()
        // require(msg.sender == i_owner, "only owner can call");
        // 下面这种方式更加节省 gas  revert就是没有条件的require(底层用revert退出的)
        if (msg.sender != i_owner) {
            revert FUNDME__NotOwner();
        }
        _;
    }

    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < s_funders.length; i++) {
            s_addressToFund[s_funders[i]] = 0;
        }
        // reset address array
        s_funders = new address[](0);
        // withdraw the funds
        // transfer  2300gas 报错
        payable(msg.sender).transfer(address(this).balance);
        // send  2300gas true/false
        bool res = payable(msg.sender).send(address(this).balance);
        require(res, "Send failed");
        // call  all gas true/false
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call failed");
    }

    function cheaperWithdraw() public onlyOwner{
        // memory不允许存mapping
        address[] memory funders = s_funders;
        for (uint i = 0; i < funders.length; i++) {
            s_addressToFund[funders[i]] = 0; 
        }
        s_funders = new address[](0);
        // 把当前合约的余额全部发送给owner
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    function get_priceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function get_addressToFund(address fundingAddress) public view returns (uint256) {
        return s_addressToFund[fundingAddress];
    }

    function get_funders(uint index) public view returns(address){
        return s_funders[index];
    }

    // 调用合约不存在的函数会根据msg.data有无数据调用fallback or receive
    fallback() external payable {
        fund();
    }

    // data无数据调用receive 有数据调用fallback
    receive() external payable {
        fund();
    }
}
