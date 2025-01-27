import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useRouter } from "next/router"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr
    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function FeaturedNFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const router = useRouter()
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const handleClick = () => {
        router.push(`/nft/${nftAddress}/${tokenId}`)
    }

    const handleBuyClick = () => {
        if (!isOwnedByUser) {
            buyItem({
                onError: (error) => console.log(error),
                onSuccess: handleBuyItemSuccess,
            })
        }
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    if (!imageURI) {
        return (
            <div className="animate-pulse bg-gray-200 rounded-2xl w-full aspect-square" />
        )
    }

    return (
        <div
            onClick={handleClick}
            className="relative group cursor-pointer rounded-2xl overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            <div className="aspect-square w-full">
                <Image
                    loader={() => imageURI}
                    src={imageURI}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                    alt={tokenName}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="font-bold text-lg mb-1">{tokenName}</h3>
                        <p className="text-sm text-gray-300">Owned by {formattedSellerAddress}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-300">Price</p>
                        <p className="font-bold text-lg">{ethers.utils.formatUnits(price, "ether")} ETH</p>
                    </div>
                </div>
            </div>
        </div>
    )
} 