import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping"

export default function Header() {
    const [activeLink, setActiveLink] = useState("/")
    const [scrolled, setScrolled] = useState(false)
    const { chainId } = useMoralis()
    const chainIdDec = parseInt(chainId, 16) || 31337
    const chainName = networkMapping[chainIdDec]?.name || "Unknown Network"

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY
            if (offset > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray/60 backdrop-blur-lg shadow-lg' : 'bg-transparent'
            }`}>
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left - Title */}
                    <div className="flex-shrink-0 w-1/4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                            NFT Marketplace
                        </h1>
                    </div>

                    {/* Center - Navigation */}
                    <div className="flex-grow flex justify-center max-w-2xl">
                        <div className="hidden md:flex items-center space-x-3">
                            <Link href="/">
                                <a
                                    onClick={() => setActiveLink("/")}
                                    className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out
                                        ${activeLink === "/"
                                            ? "text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                        }
                                        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-purple-600/20 before:to-blue-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity`}
                                >
                                    Home
                                </a>
                            </Link>
                            <Link href="/sell-nft">
                                <a
                                    onClick={() => setActiveLink("/sell-nft")}
                                    className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out
                                        ${activeLink === "/sell-nft"
                                            ? "text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                        }
                                        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-purple-600/20 before:to-blue-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity`}
                                >
                                    Sell NFT
                                </a>
                            </Link>
                            <Link href="/profile">
                                <a
                                    onClick={() => setActiveLink("/profile")}
                                    className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out
                                        ${activeLink === "/profile"
                                            ? "text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                        }
                                        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-purple-600/20 before:to-blue-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity`}
                                >
                                    Profile
                                </a>
                            </Link>
                        </div>
                    </div>

                    {/* Right - User Info */}
                    <div className="flex-shrink-0 w-1/4 flex justify-end items-center gap-4">
                        <div className="text-sm font-medium text-white/80">
                            {chainName}
                        </div>
                        <ConnectButton moralisAuth={false} />
                    </div>
                </div>
            </div>
        </nav>
    )
}
