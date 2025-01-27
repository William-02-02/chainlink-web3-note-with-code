import { gql } from "graphql-tag"

export const GET_ACTIVE_NFTS = gql`
    {
        activeNfts(first: 5, where: {buyer: null}) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export const GET_ALL_NFTS = gql`
    {
        activeNfts(first: 5) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export const GET_USER_NFTS = gql`
    query GetUserNFTs($userAddress: String!) {
        activeNfts(where: { seller: $userAddress }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export const GET_NFT_DETAILS = gql`
    query GetNFTDetails($nftAddress: String!, $tokenId: String!) {
        activeNfts(
            where: {
                nftAddress: $nftAddress,
                tokenId: $tokenId
            }
        ) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`