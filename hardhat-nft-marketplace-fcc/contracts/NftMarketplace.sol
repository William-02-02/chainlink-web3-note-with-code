// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__PriceMustBeGreaterThanZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftMarketplace__NoBalanceToWithdraw();
error NftMarketplace__TransferFailed();

// 1. list NFT
// 2. buy NFT
// 3. cancel listing
// 4. withdraw bid
// 5. update listing
contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    event NftListed(
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller
    );

    event NftBought(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    event NftListingCancelled(
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event NftListingUpdated(
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 newPrice
    );

    // mapping(nftAddress => tokenId => Listing)
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_balances;

    modifier NotListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier IsListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price == 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier OnlyOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    // 1. list NFT
    // 2. buy NFT
    // 3. cancel listing
    // 4. withdraw bid
    // 5. update listing

    function listNft(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external NotListed(nftAddress, tokenId) OnlyOwner(nftAddress, tokenId, msg.sender) {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeGreaterThanZero();
        }
        // approve the marketplace to transfer the NFT
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing({price: price, seller: msg.sender});
        emit NftListed(nftAddress, tokenId, price, msg.sender);
    }

    function buyNft(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant IsListed(nftAddress, tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (msg.value < listing.price) {
            revert NftMarketplace__PriceNotMet(nftAddress, tokenId, listing.price);
        }
        s_balances[listing.seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);
        emit NftBought(nftAddress, tokenId, msg.sender, listing.price);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    ) external OnlyOwner(nftAddress, tokenId, msg.sender) IsListed(nftAddress, tokenId) {
        delete(s_listings[nftAddress][tokenId]);
        emit NftListingCancelled(nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external OnlyOwner(nftAddress, tokenId, msg.sender) IsListed(nftAddress, tokenId) {
        s_listings[nftAddress][tokenId].price = newPrice;
        emit NftListingUpdated(nftAddress, tokenId, newPrice);
    }

    function withdrawBalance() external nonReentrant {
        uint256 balance = s_balances[msg.sender];
        if (balance <= 0) {
            revert NftMarketplace__NoBalanceToWithdraw();
        }
        s_balances[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        if (!success) {
            revert NftMarketplace__TransferFailed();
        }
    }

    // Getter functions
    function getListing(address nftAddress, uint256 tokenId) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getBalance(address seller) external view returns (uint256) {
        return s_balances[seller];
    }


}
