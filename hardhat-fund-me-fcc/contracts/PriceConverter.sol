// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// library
// 1. 无状态，不能定义状态变量 不能修改合约状态
// 2. 不消耗gas 只能写view pure的函数
// 3. 内部调用，无法外部访问
// 4. 无fallback pable 就类似一个工具库 仅内部访问
// 5. 配合 using PriceConvertor for uint256： price.getConversionRate();
library PriceConvertor {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int price, , , ) = AggregatorV3Interface(priceFeed)
            .latestRoundData();
        return uint256(price * 1e10);
    }

    function getVersion(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        return AggregatorV3Interface(priceFeed).version();
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        return (ethPrice * ethAmount) / 1e18;
    }
}
