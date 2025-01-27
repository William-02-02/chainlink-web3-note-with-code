import { useQuery } from "@apollo/client"
import { useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
import FeaturedNFTBox from "../components/FeaturedNFTBox"
import networkConfig from "../constants/networkMapping.json"
import { GET_ACTIVE_NFTS, GET_ALL_NFTS } from "../constants/subGraphQueries"
import { useState, useEffect } from "react"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkConfig[chainString]?.NftMarketplace[0]

    const { loading: allNftsLoading, error: allNftsError, data: allNftsData } = useQuery(GET_ALL_NFTS)
    const { loading: activeNftsLoading, error: activeNftsError, data: activeNftsData } = useQuery(GET_ACTIVE_NFTS)

    const [featuredNfts, setFeaturedNfts] = useState([])
    const [topCollections, setTopCollections] = useState([])
    const [allNfts, setAllNfts] = useState([])
    const [scrollPosition, setScrollPosition] = useState(0)

    useEffect(() => {
        if (activeNftsData?.activeNfts) {
            // 为 Featured NFTs 使用 active NFTs
            setFeaturedNfts(activeNftsData.activeNfts.slice(0, 8))
            // 为 Top Collections 使用 active NFTs
            setTopCollections(activeNftsData.activeNfts)
        }
    }, [activeNftsData])

    useEffect(() => {
        if (allNftsData?.activeNfts) {
            // 为 All NFTs 使用所有 NFTs
            setAllNfts(allNftsData.activeNfts)
        }
    }, [allNftsData])

    const handleScroll = (direction) => {
        const container = document.getElementById('nft-scroll-container')
        const scrollAmount = 400
        if (container) {
            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            }
        }
    }

    // 计算 NFT 的交易量（这里使用一个模拟的计算方法）
    const calculateVolume = (price) => {
        return parseFloat(price) * (Math.random() * 2 + 1) // 模拟交易量为价格的 1-3 倍
    }

    // 格式化 ETH 价格显示
    const formatPrice = (price) => {
        if (!price) return "0"
        const ethPrice = parseFloat(price) / 1e18 // 将 wei 转换为 ETH
        return ethPrice.toFixed(4)
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: 'url("/bg.png")' }}
        >
            <div className="min-h-screen bg-black/30 backdrop-blur-lg">
                <div className="container mx-auto px-4 pt-20 pb-8">
                    {/* NFT Showcase Section */}
                    <div className="relative mb-16">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                Featured NFTs
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleScroll('left')}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleScroll('right')}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div
                            id="nft-scroll-container"
                            className="flex overflow-x-auto hide-scrollbar gap-4 pb-4"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {featuredNfts.map((nft) => (
                                <div
                                    key={`${nft.nftAddress}${nft.tokenId}`}
                                    className="flex-none w-80"
                                >
                                    <FeaturedNFTBox
                                        price={nft.price}
                                        nftAddress={nft.nftAddress}
                                        tokenId={nft.tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={nft.seller}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rankings Section */}
                    <div className="mb-16">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-l from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                Top Collections
                            </h2>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/10">
                            <div className="grid grid-cols-12 px-6 py-4 bg-white/5 text-sm font-medium text-gray-300">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-5">Collection</div>
                                <div className="col-span-3 text-right">Floor Price</div>
                                <div className="col-span-3 text-right">Volume</div>
                            </div>
                            {activeNftsLoading ? (
                                <div className="px-6 py-8 text-center text-gray-400">
                                    Loading collections...
                                </div>
                            ) : topCollections.slice(0, 5).map((nft, index) => {
                                const priceInEth = formatPrice(nft.price)
                                const volume = calculateVolume(priceInEth)
                                return (
                                    <div
                                        key={`${nft.nftAddress}${nft.tokenId}`}
                                        className="grid grid-cols-12 px-6 py-4 border-b border-white/10 items-center hover:bg-white/5 transition-colors"
                                    >
                                        <div className="col-span-1 font-medium text-white">#{index + 1}</div>
                                        <div className="col-span-5 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img
                                                    src={nft.imageURI || "https://avatars.githubusercontent.com/u/42142420?v=4"}
                                                    alt={nft.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-white">{nft.name || `NFT #${nft.tokenId}`}</span>
                                        </div>
                                        <div className="col-span-3 text-right font-medium text-white">
                                            {priceInEth} ETH
                                        </div>
                                        <div className="col-span-3 text-right font-medium text-white">
                                            {volume.toFixed(2)} ETH
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* All NFTs Grid */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                All NFTs
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {isWeb3Enabled ? (
                                allNftsLoading ? (
                                    <div className="col-span-full flex justify-center">
                                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
                                    </div>
                                ) : (
                                    allNfts.map((nft) => (
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
                                    ))
                                )
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <h3 className="text-2xl font-semibold text-white mb-4">Web3 Not Enabled</h3>
                                    <p className="text-gray-300">Please connect your wallet to view NFTs</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
