import { ConnectButton } from "web3uikit";

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row items-center">
            <div className="flex-1"></div>
            <h1 className="py-4 px-4 font-bold text-3xl flex-1 text-center">Decentralized Lottery</h1>
            <div className="flex-1 flex justify-end py-2 px-4">
                <ConnectButton />
            </div>
        </nav>
    )
}
