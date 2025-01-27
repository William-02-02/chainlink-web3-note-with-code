import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    const handleUpdateListingSuccess = async (tx) => {
        setIsUpdating(true)
        try {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Price updated successfully!",
                title: "Listing Updated",
                position: "topR",
            })
            onClose && onClose()
            setPriceToUpdateListingWith("")
        } catch (error) {
            console.error("Error updating price:", error)
            dispatch({
                type: "error",
                message: "Error updating price",
                title: "Update Failed",
                position: "topR",
            })
        } finally {
            setIsUpdating(false)
        }
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    const handleUpdatePrice = async () => {
        try {
            const price = parseFloat(priceToUpdateListingWith)
            if (!priceToUpdateListingWith || isNaN(price) || price <= 0) {
                dispatch({
                    type: "error",
                    message: "Please enter a valid price",
                    title: "Invalid Price",
                    position: "topR",
                })
                return
            }

            // Validate that the price has at most 18 decimal places
            const decimalPlaces = priceToUpdateListingWith.includes('.')
                ? priceToUpdateListingWith.split('.')[1].length
                : 0

            if (decimalPlaces > 18) {
                dispatch({
                    type: "error",
                    message: "Price cannot have more than 18 decimal places",
                    title: "Invalid Price",
                    position: "topR",
                })
                return
            }

            setIsUpdating(true)
            await updateListing({
                onError: (error) => {
                    console.error("Error:", error)
                    dispatch({
                        type: "error",
                        message: error.message || "Error updating price",
                        title: "Error",
                        position: "topR",
                    })
                    setIsUpdating(false)
                },
                onSuccess: handleUpdateListingSuccess,
            })
        } catch (error) {
            console.error("Error in handleUpdatePrice:", error)
            dispatch({
                type: "error",
                message: "Invalid price format",
                title: "Error",
                position: "topR",
            })
            setIsUpdating(false)
        }
    }

    const handleCancel = () => {
        setPriceToUpdateListingWith("")
        onClose && onClose()
    }

    const handlePriceChange = (e) => {
        const value = e.target.value
        // Only allow numbers and a single decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setPriceToUpdateListingWith(value)
        }
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={handleCancel}
            onCloseButtonPressed={handleCancel}
            onOk={handleUpdatePrice}
            title={
                <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Update NFT Price
                </div>
            }
            okText={isUpdating ? "Updating..." : "Update Price"}
            cancelText="Cancel"
            isCancelDisabled={isUpdating}
            isOkDisabled={isUpdating || !priceToUpdateListingWith}
            headerHasBottomBorder
            width="500px"
        >
            <div className="py-4">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Price (ETH)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={priceToUpdateListingWith}
                                onChange={handlePriceChange}
                                disabled={isUpdating}
                                placeholder="0.00"
                                className="w-full px-4 py-2 bg-white/5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-gray-500">ETH</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Token ID: #{tokenId}</p>
                        <p className="mt-1">Contract: {nftAddress ? `${nftAddress.slice(0, 6)}...${nftAddress.slice(-4)}` : ''}</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
