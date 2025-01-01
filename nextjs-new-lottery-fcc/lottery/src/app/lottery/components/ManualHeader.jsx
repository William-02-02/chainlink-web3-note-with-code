"use client";
import { useMoralis } from "react-moralis";
import { useEffect } from "react"

export default function Header() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();
  // 当后方元素发生变化时调用前方函数  加载时会默认调用一次
  // 如果后方数组没有填写 nodependency array: run anytime something re-renders!
  // 使用useEffect时小心circular render!
  // useEffect(()=>{
  //   if (!isWeb3Enabled && typeof window !== undefined && window.localStorage.getItem("connected")){
  //     enableWeb3()
  //   }

  // },[isWeb3Enabled])

  // 使用useEffect在首次加载页面的时候挂载这个监听器！
  // 后续是内部这个监听器在发挥作用 而不是useEffect函数
  useEffect(()=>{
    Moralis.onAccountChanged((account)=>{
      console.log(`Account changed to ${account}`)
      if(account == null){
        window.localStorage.removeItem("connected")
        deactivateWeb3()
        console.log("null account found");
      }
    })

  },[])
  
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <div className="flex-1"></div>
      <h1 className="py-4 px-4 font-bold text-3xl flex-1 text-center">Decentralized Lottery</h1>
      <div className="flex items-center flex-1 justify-end">
        <button
          className={`ml-auto py-2 px-4 rounded-lg ${
            isWeb3EnableLoading || account
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold transition-colors duration-200`}
          onClick={async () => {
            await enableWeb3()
            if (typeof window !== undefined) {
              window.localStorage.setItem("connected", "injected")
            }
          }}
          disabled={isWeb3EnableLoading || account}
        >
          {account ? "Connected!" : "Connect Wallet"}
        </button>
        {account && (
          <div className="ml-4 py-2 px-4 bg-gray-100 rounded-lg text-gray-700">
            {account.slice(0, 6)}...{account.slice(account.length - 4)}
          </div>
        )}
      </div>
    </nav>
  )
}
