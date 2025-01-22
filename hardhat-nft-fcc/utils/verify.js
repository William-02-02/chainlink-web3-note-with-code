const { run } = require("hardhat");

// 合约上线需要验证  这里可以在代码里实现 也可以去ether scan上传
async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            ConstructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log(" Already Verified!");
        } else {
            console.log(e);
        }
    }
}

module.exports = { verify };
