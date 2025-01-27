import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString]?.NftMarketplace[0]
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")
    const [isApproving, setIsApproving] = useState(false)
    const [isListing, setIsListing] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        setIsApproving(true)
        try {
            console.log("Approving...")
            const nftAddress = data.data[0].inputResult
            const tokenId = data.data[1].inputResult
            const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

            const approveOptions = {
                abi: nftAbi,
                contractAddress: nftAddress,
                functionName: "approve",
                params: {
                    to: marketplaceAddress,
                    tokenId: tokenId,
                },
            }

            await runContractFunction({
                params: approveOptions,
                onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
                onError: (error) => {
                    console.log(error)
                    dispatch({
                        type: "error",
                        message: "Error approving NFT",
                        title: "Error",
                        position: "topR",
                    })
                    setIsApproving(false)
                },
            })
        } catch (error) {
            console.error("Error in approveAndList:", error)
            dispatch({
                type: "error",
                message: "Please check your inputs and try again",
                title: "Error",
                position: "topR",
            })
            setIsApproving(false)
        }
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        setIsApproving(false)
        setIsListing(true)
        console.log("Approved! Now listing...")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => {
                console.log(error)
                dispatch({
                    type: "error",
                    message: "Error listing NFT",
                    title: "Error",
                    position: "topR",
                })
                setIsListing(false)
            },
        })
    }

    async function handleListSuccess(tx) {
        try {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "NFT listed successfully!",
                title: "NFT Listed",
                position: "topR",
            })
        } catch (error) {
            console.error("Error in handleListSuccess:", error)
            dispatch({
                type: "error",
                message: "Error confirming transaction",
                title: "Error",
                position: "topR",
            })
        } finally {
            setIsListing(false)
        }
    }

    const handleWithdrawSuccess = async (tx) => {
        setIsWithdrawing(true)
        try {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Proceeds withdrawn successfully!",
                title: "Withdrawal Complete",
                position: "topR",
            })
            await setupUI() // Refresh proceeds amount
        } catch (error) {
            console.error("Error in handleWithdrawSuccess:", error)
            dispatch({
                type: "error",
                message: "Error withdrawing proceeds",
                title: "Error",
                position: "topR",
            })
        } finally {
            setIsWithdrawing(false)
        }
    }

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: {
            seller: account,
        },
    })


    useEffect(() => {
        if (isWeb3Enabled && account) {
            getBalance()
        }
    }, [isWeb3Enabled, account, chainId])

    if (!isWeb3Enabled) {
        return (
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/bg.png")' }}>
                <div className="min-h-screen bg-black/30 backdrop-blur-lg pt-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                            <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
                            <p className="text-gray-300">Please connect your wallet to sell NFTs</p>
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
                    <div className="max-w-2xl mx-auto">
                        {/* Sell NFT Form */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
                            <Form
                                onSubmit={approveAndList}
                                data={[
                                    {
                                        name: "NFT Address",
                                        type: "text",
                                        inputWidth: "100%",
                                        value: "",
                                        key: "nftAddress",
                                        validation: {
                                            required: true,
                                            regExp: "^0x[a-fA-F0-9]{40}$",
                                            regExpInvalidMessage: "Invalid Ethereum address format",
                                        },
                                    },
                                    {
                                        name: "Token ID",
                                        type: "number",
                                        value: "",
                                        key: "tokenId",
                                        validation: {
                                            required: true,
                                            numberMin: 0,
                                        },
                                    },
                                    {
                                        name: "Price (in ETH)",
                                        type: "number",
                                        value: "",
                                        key: "price",
                                        validation: {
                                            required: true,
                                            numberMin: 0,
                                            step: "0.001",
                                        },
                                    },
                                ]}
                                title={
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-6">
                                        List Your NFT
                                    </h2>
                                }
                                id="SellNFTForm"
                                customFooter={
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isApproving || isListing}
                                            className={`px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold
                                                ${(isApproving || isListing) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200'}`}
                                        >
                                            {isApproving ? "Approving..." : isListing ? "Listing..." : "List NFT"}
                                        </button>
                                    </div>
                                }
                            />
                        </div>

                        {/* Withdraw Section */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                            <h2 className="text-2xl max-w-sm font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-6">
                                Withdraw Proceeds
                            </h2>
                            <div className="flex items-center justify-between">
                                <div className="text-white">
                                    <span className="text-gray-400">Available proceeds: </span>
                                    <span className="font-semibold">{ethers.utils.formatEther(proceeds)} ETH</span>
                                </div>
                                {proceeds != "0" ? (
                                    <button
                                        onClick={() => {
                                            runContractFunction({
                                                params: {
                                                    abi: nftMarketplaceAbi,
                                                    contractAddress: marketplaceAddress,
                                                    functionName: "withdrawProceeds",
                                                    params: {},
                                                },
                                                onError: (error) => {
                                                    console.log(error)
                                                    dispatch({
                                                        type: "error",
                                                        message: "Error withdrawing proceeds",
                                                        title: "Error",
                                                        position: "topR",
                                                    })
                                                },
                                                onSuccess: handleWithdrawSuccess,
                                            })
                                        }}
                                        disabled={isWithdrawing}
                                        className={`px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold
                                            ${isWithdrawing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200'}`}
                                    >
                                        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                                    </button>
                                ) : (
                                    <div className="text-gray-400 italic">No proceeds available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
