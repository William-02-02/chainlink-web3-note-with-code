import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useRouter } from "next/router"
import nftMarketplaceAbi from "../../../constants/NftMarketplace.json"
import Image from "next/image"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../../../constants/BasicNft.json"
import networkConfig from "../../../constants/networkMapping.json"
import { useQuery } from "@apollo/client"
import { GET_NFT_DETAILS } from "../../../constants/subGraphQueries"
import UpdateListingModal from "../../../components/UpdateListingModal"

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

export default function NFTDetail() {
    const router = useRouter()
    const { nftAddress, tokenId } = router.query
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const { account, chainId } = useMoralis()
    const dispatch = useNotification()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkConfig[chainString]?.NftMarketplace[0]

    const hideModal = () => setShowModal(false)

    // GraphQL query
    const { loading: graphLoading, error: graphError, data: nftDetails } = useQuery(GET_NFT_DETAILS, {
        variables: {
            nftAddress: nftAddress?.toLowerCase(),
            tokenId: tokenId?.toString(),
        },
        skip: !nftAddress || !tokenId,
    })

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
        msgValue: nftDetails?.activeNfts[0]?.price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        if (!nftAddress || !tokenId) return
        try {
            const tokenURI = await getTokenURI()
            console.log(`The TokenURI is ${tokenURI}`)
            if (tokenURI) {
                const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
                const tokenURIResponse = await (await fetch(requestURL)).json()
                const imageURI = tokenURIResponse.image
                const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
                console.log(`The ImageURI is ${imageURIURL}`)
                setImageURI(imageURIURL)
                setTokenName(tokenURIResponse.name)
                setTokenDescription(tokenURIResponse.description)
            }
        } catch (error) {
            console.error("Error fetching NFT data:", error)
        }
    }

    useEffect(() => {
        if (nftAddress && tokenId) {
            updateUI()
        }
    }, [nftAddress, tokenId])

    const nftData = nftDetails?.activeNfts?.[0]
    const isOwnedByUser = nftData?.seller?.toLowerCase() === account?.toLowerCase()
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(nftData?.seller || "", 15)

    const handleBuyClick = () => {
        if (!isOwnedByUser) {
            buyItem({
                onError: (error) => {
                    console.error("Error buying NFT:", error)
                    dispatch({
                        type: "error",
                        message: "Error buying NFT",
                        title: "Error",
                        position: "topR",
                    })
                },
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
        router.push("/")
    }

    const handleUpdatePrice = () => {
        setShowModal(true)
    }

    if (graphLoading || !imageURI) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/bg.png")' }}>
                <div className="min-h-screen bg-black/30 backdrop-blur-lg pt-20">
                    <div className="container mx-auto px-4">
                        <div className="animate-pulse bg-white/10 rounded-2xl p-8">
                            <div className="h-96 bg-white/5 rounded-xl mb-4"></div>
                            <div className="h-8 bg-white/5 rounded-lg w-1/3 mb-4"></div>
                            <div className="h-4 bg-white/5 rounded-lg w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (graphError) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/bg.png")' }}>
                <div className="min-h-screen bg-black/30 backdrop-blur-lg pt-20">
                    <div className="container mx-auto px-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                            <h1 className="text-2xl font-bold text-white mb-4">Error Loading NFT</h1>
                            <p className="text-gray-300">{graphError.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/bg.png")' }}>
            <div className="min-h-screen bg-black/30 backdrop-blur-lg pt-20">
                <div className="container mx-auto px-4">
                    <UpdateListingModal
                        isVisible={showModal}
                        tokenId={tokenId}
                        marketplaceAddress={marketplaceAddress}
                        nftAddress={nftAddress}
                        onClose={hideModal}
                    />
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left: Image */}
                            <div className="relative aspect-square rounded-xl overflow-hidden">
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    layout="fill"
                                    objectFit="cover"
                                    className="hover:scale-110 transition-transform duration-300"
                                    alt={tokenName}
                                />
                            </div>

                            {/* Right: Info */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">{tokenName}</h1>
                                    <p className="text-gray-300 mb-6">{tokenDescription}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm">Token ID</p>
                                            <p className="text-white font-medium">#{tokenId}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm">Owner</p>
                                            <p className="text-white font-medium">{formattedSellerAddress}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm">Contract Address</p>
                                            <p className="text-white font-medium">{truncateStr(nftAddress || "", 15)}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm">Price</p>
                                            <p className="text-white font-medium">
                                                {nftData?.price
                                                    ? ethers.utils.formatUnits(nftData.price, "ether")
                                                    : "?"} ETH
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {isOwnedByUser ? (
                                    <button
                                        onClick={handleUpdatePrice}
                                        className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        Update Price
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleBuyClick}
                                        className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}