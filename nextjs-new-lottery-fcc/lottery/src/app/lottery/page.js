"use client";
// import Head from "next/head"; 这是旧方式 需要定义Head组件从而导入metadata  新方式就是写入layout导出即可
import { MoralisProvider } from "react-moralis";
// 手写一个button的基础功能
// import ManualHeader from "./components/ManualHeader";
import Header from "./components/Header"
import LotteryEntrance from "./components/LotteryEntrance";
import { NotificationProvider } from "web3uikit";

export default function Home() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-100 pt-16">
          <Header/>
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <LotteryEntrance />
            </div>
          </main>
        </div>
      </NotificationProvider>
    </MoralisProvider>
  );
}
