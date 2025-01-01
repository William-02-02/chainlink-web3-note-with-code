import { useMoralis, useWeb3Contract } from 'react-moralis'
import { abi, contractAddresses } from '../constants/index'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit';

export default function LotteryEntrance() {

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0") // 这里需要正确初始化 否则会报错invalid BigNumber string
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })

    const { runContractFunction: get_EntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "get_EntranceFee",
        params: {}
    })

    const { runContractFunction: get_NumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "get_NumberOfPlayers",
        params: {}
    })

    const { runContractFunction: get_RecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "get_RecentWinner",
        params: {}
    })

    useEffect(function () {
        if (isWeb3Enabled) {
            updateUI()
        }

    }, [isWeb3Enabled])

    async function updateUI() {
        const entranceFeeFromCall = (await get_EntranceFee()).toString()
        const numPlayersFromCall = (await get_NumberOfPlayers()).toString()
        const recentWinnerFromCall = (await get_RecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setRecentWinner(recentWinnerFromCall)
        setNumPlayers(numPlayersFromCall)
        console.log("getFee", entranceFee);
    }

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNowNotification(tx)
        updateUI()
    }
    const handleNowNotification = function () {
        dispatch({
            type: "success",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
        })
    }


    return (
        <div className="p-5">
            <div className="flex flex-col items-center gap-4">
                {raffleAddress ? (
                    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Entrance Fee:</span>
                                <span className="font-medium">{ethers.utils.formatEther(entranceFee, "0")} ETH</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Players:</span>
                                <span className="font-medium">{numPlayers}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Recent Winner:</span>
                                <span className="font-medium truncate max-w-[200px]">
                                    {recentWinner.slice(0, 6)}...{recentWinner.slice(-4)}
                                </span>
                            </div>
                        </div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 w-full"
                            onClick={async () => {
                                await enterRaffle({
                                    onSuccess: handleSuccess,//这个onSuccess只是看信息有没有成功发送到metamask
                                    onError: (error) => console.log(error),
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ?
                                (
                                    <div className='flex justify-center items-center'>
                                        <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full'></div>
                                    </div>
                                ) :
                                (
                                    <div>Enter Raffle</div>
                                )}
                        </button>
                    </div>
                ) : (
                    <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
                        No Raffle Contract Detected!
                    </div>
                )}
            </div>
        </div>
    )
}