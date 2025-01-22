// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private i_lowImageURI;
    string private i_highImageURI;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";
    AggregatorV3Interface private immutable i_priceFeed;
    mapping(uint256 => int256) public s_tokenIdToHighValue;

    event CreatedNFT(uint256 indexed tokenId, int256 highValue);

    error DynamicSvgNft__TokenIdToHighValueNotSet(uint256 tokenId);

    constructor(
        address priceFeedAddress,
        string memory lowSvg,
        string memory highSvg
    ) ERC721("DynamicSvgNft", "DSNFT") {
        s_tokenCounter = 0;
        i_lowImageURI = svgToImage(lowSvg);
        i_highImageURI = svgToImage(highSvg);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function svgToImage(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(svg));
        return string.concat(base64EncodedSvgPrefix, svgBase64Encoded);
    }

    function mintNft(int256 highValue) public {
        uint256 tokenId = s_tokenCounter;
        s_tokenIdToHighValue[tokenId] = highValue;
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(msg.sender, s_tokenCounter);
        emit CreatedNFT(tokenId, highValue);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(s_tokenCounter > tokenId, DynamicSvgNft__TokenIdToHighValueNotSet(tokenId));
        string memory imageUri = "Hi";
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        if (price >= s_tokenIdToHighValue[tokenId]) {
            imageUri = i_highImageURI;
        } else {
            imageUri = i_lowImageURI;
        }

        // abi.encodePacked 的输出只是原始字节流，虽然它可以直接存储，但它对于外部系统（如IPFS或浏览器）并不友好。
        // 许多外部工具无法直接解读或展示这种字节流。
        // 为了让元数据能够被通用的系统识别（例如解析JSON数据的浏览器或IPFS网关），
        // 需要对它进行Base64编码，以转换为一种通用的可读格式。
        // bytes类型转化明确指明类型 避免类型兼容问题
        return
            string(
                abi.encodePacked(
                    _baseURI(), // 添加上前缀
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"}',
                                name(),
                                '","description":"An NFT that changes based on the ChainLink Feed"}',
                                '"attributes":[{"trait_type":"coolness","value":100}], "image":"',
                                imageUri,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getTokenIdToHighValue(uint256 tokenId) public view returns (int256) {
        return s_tokenIdToHighValue[tokenId];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getLowImageURI() public view returns (string memory) {
        return i_lowImageURI;
    }

    function getHighImageURI() public view returns (string memory) {
        return i_highImageURI;
    }
}
