import { useQuery } from "@apollo/client"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import { ethers } from "ethers"
import { GET_USER_NFTS } from "../constants/subGraphQueries"

export default function Profile() {
    const { account, isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString]?.NftMarketplace[0]
    const [totalValue, setTotalValue] = useState("0")

    const { loading: isLoading, error, data } = useQuery(GET_USER_NFTS, {
        variables: { userAddress: account?.toLowerCase() },
        skip: !account,
    })

    const userNfts = data?.activeNfts || []

    useEffect(() => {
        if (data?.activeNfts) {
            // Calculate total value
            const total = data.activeNfts.reduce((acc, nft) => {
                return acc.add(ethers.BigNumber.from(nft.price))
            }, ethers.BigNumber.from(0))
            setTotalValue(ethers.utils.formatEther(total))
        }
    }, [data])

    if (!isWeb3Enabled) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/bg.png")' }}>
                <div className="min-h-screen bg-black/30 backdrop-blur-lg pt-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                            <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
                            <p className="text-gray-300">Please connect your wallet to view your profile</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/bg.png")' }}>
                <div className="min-h-screen bg-black/30 backdrop-blur-lg pt-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                            <h1 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h1>
                            <p className="text-gray-300">There was an error loading your profile data. Please try again later.</p>
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
                    {/* Profile Header */}
                    <div className="max-w-6xl mx-auto mb-12">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {account ? account.substring(2, 4).toUpperCase() : ""}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">
                                        {account ?
                                            `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                                            : "Anonymous"}
                                    </h1>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-gray-400 text-sm">Listed NFTs</p>
                                            <p className="text-white font-semibold">{userNfts.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Value</p>
                                            <p className="text-white font-semibold">{totalValue} ETH</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NFTs Grid */}
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8">
                            Your Listed NFTs
                        </h2>
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                            </div>
                        ) : userNfts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {userNfts.map((nft) => (
                                    <div
                                        key={`${nft.nftAddress}${nft.tokenId}`}
                                        className="transform transition-all duration-300 hover:scale-105"
                                    >
                                        <NFTBox
                                            price={nft.price}
                                            nftAddress={nft.nftAddress}
                                            tokenId={nft.tokenId}
                                            marketplaceAddress={marketplaceAddress}
                                            seller={nft.seller}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl">
                                <h3 className="text-xl font-semibold text-white mb-4">No NFTs Listed</h3>
                                <p className="text-gray-400">You haven't listed any NFTs for sale yet.</p>
                                <button
                                    onClick={() => window.location.href = '/sell-nft'}
                                    className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    List an NFT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 