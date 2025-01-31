# chainlink

data feeds

区块链如何获取外部数据进行交互/

Oracle 预言机： 组成一个类似区块链的网络 向区块链提供外部数据

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733888122155-f187e47e-8a36-4b43-bd33-45b802d7d8fa.png)

可以指定外部api 让chainlink调用



# solidity语法

## 规范

https://docs.soliditylang.org/en/latest/style-guide.html#order-of-layout

## 示例代码

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SimpleStorage{

    uint256 public favoriteNumber;

    struct People{
        string name;
        uint256 favoriteNumber;
    }

    People[] private peopleList;

    mapping(string => uint256) public nameTofavoriteNumberMap;

    // 添加virtual 表明该函数支持override
    function store(uint256 _favoriteNumber) public virtual  {
        favoriteNumber = _favoriteNumber;
    }
    // view表示该函数未修改合约的存储数据
    // pure表示函数不会读取合约的存储数据（静态参数/msg.sender etc.）
    function retrieve() public view returns (uint256){
        return favoriteNumber;
    }

    // memory 指明需要存放的地点  storage calldata
    // memory 临时存储，不会持久存在。临时变量、函数参数、返回值 省gas
    // storage 永久存储区域 状态变量都在这  涉及对区块链的读写 访问较慢 耗gas
    // calldata 只读数据区域  函数结束后就销毁 最省gas
    // string是动态大小的 大小在编译时位置无法存储在storage里
    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        peopleList.push(People(_name, _favoriteNumber)) ;
        nameTofavoriteNumberMap[_name] = _favoriteNumber;
    }



}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory{

    SimpleStorage[] public SimpleStorageArray;

    function createSimpleStorage() public {
        SimpleStorageArray.push(new SimpleStorage());
    }

    function sfStore(uint256 index, uint256 favNumber) public {
        SimpleStorageArray[index].store(favNumber);
    }

    function sfRetrieve(uint256 index) public view returns (uint256){
        return SimpleStorageArray[index].retrieve();
    }


}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

// is 继承父类 
contract ExtraStorage is SimpleStorage{
    // override 需要在父方法加上 virtual
    function store(uint256 _favoriteNumber) public override   {
        favoriteNumber = _favoriteNumber + 5;
    }
}
```



```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// library 
// 1. 无状态，不能定义状态变量 不能修改合约状态
// 2. 不消耗gas 只能写view pure的函数
// 3. 内部调用，无法外部访问
// 4. 无fallback pable 就类似一个工具库 仅内部访问
// 5. 配合 using PriceConvertor for uint256： price.getConversionRate();
library PriceConvertor{

    function getPrice() internal view returns(uint256){
        (,int price,,,) = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43).latestRoundData();
        return uint256(price*1e10);
    }

    function getVersion() internal view returns (uint256) {
        return AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43).version();
    }

    function getConversionRate(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = getPrice();
        return (ethPrice * ethAmount)  / 1e18 ;

    }


}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConvertor.sol";

//自定义错误
error NotOwner();
contract FundMe{
    // library用法
    using PriceConvertor for uint256;
    // 使用constant优化gas constant命名规范 大写 下划线
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    // immutable 不可改变 只赋值一次  immutable命名规范 i_owner
    address private immutable i_owner;
    
    address[] public funders;
    mapping(address => uint256) public addressToFund;

    constructor(){
        i_owner = msg.sender;
    }

    function fund() public payable {
        // 这里msg.value默认作为getConversionRate的参数，如果有多个就在括号里加
        require(msg.value.getConversionRate() >= MINIMUM_USD,"not enough!");
        funders.push(msg.sender);
        addressToFund[msg.sender] += msg.value;

    }

    // modifier 可以添加virtual被继承
    // 修饰器可以接受参数
    modifier onlyOwner(){
        //也可以用 require______，NotOwner()
        require(msg.sender == i_owner, "only owner can call");
        // 下面这种方式更加节省 gas  revert就是没有条件的require(底层用revert退出的)
        if (msg.sender != i_owner){revert NotOwner();}
        _;
    }

    function withdraw() public onlyOwner {

        for (uint256 i=0; i<funders.length; i++) 
        {
            addressToFund[funders[i]] = 0;
        }
        // reset address array
        funders = new address[](0);
        // withdraw the funds
        // transfer  2300gas 报错
        payable(msg.sender).transfer(address(this).balance);
        // send  2300gas true/false
        bool res = payable(msg.sender).send(address(this).balance);
        require(res,"Send failed");
        // call  all gas true/false
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess,"call failed");
 

    }

    // 调用合约不存在的函数会根据msg.data有无数据调用fallback or receive
    fallback() external payable { fund(); }

    // data无数据调用receive 有数据调用fallback
    receive() external payable { fund();}



}
```



## unchecked

版本0.8.0之前会出现溢出的情况--美链

uint8 最大255 +1就会变成0



## transfer call send

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733901352827-f25c743c-6ba7-490a-b388-2affacc35e22.png)

call就类似手动输入value调用合约那种 所以用{}放参数

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733903646122-1be22d26-ffd9-4180-b863-c0db90b65c72.png)

## using ___ as ____

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733895832491-1ebb39b2-d2a7-415e-a54a-89663884f25e.png)



![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733895911360-c6c2c0d5-d732-4526-8b58-866d41512092.png)



## receive fallback

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733908580975-ba3e5989-4b0d-4c82-b05e-f0d43658c497.png)

## Events

事件用来记录log  这个log常用于前端信息操作变化

indexed 是声明这个变量是被索引了的 相较于其他的更加容易查找  在log里是**topic**

**第一项topic是其他topic的名称hash**

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734843431657-b48552fb-0cf1-495e-892c-8e03dd0fcdb9.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734843510149-a19f53dd-57f2-4a11-bab1-ddd37f4d8e8d.png)

## 继承

在构造函数里调用父类的构造函数

图里的vrtCoordinator是上面定义成了一个constant

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734848106712-7c6b17c7-7780-4b95-bb85-5c6b4d08126d.png)

用户输入的写法如下

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734859383807-4986754a-137f-4f12-b00e-738c39cf7963.png)



## 其他

### public 变量

- 在 Solidity 合约中，当我们将变量声明为 public 时，编译器会自动为其创建一个 getter 函数
- 在 JavaScript 中通过 ethers.js 访问合约时，这些 getter 函数会被包装成异步函数，因为它们需要与区块链进行交互
- 即使是常量值，ethers.js 也会将其处理为异步调用，因为它遵循统一的合约交互模式





# JS部署合约

step 1：visual studio code

step 2:  wsl --install   for windows：install local VM

step 3：install nodejs on the VM

## compile

vs code连接虚拟机  安装solcjs 使用命令编译代码

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733984429592-6ae61612-658e-4011-8ed6-52c730bb7b7f.png)

package.json添加  yarn compile即可编译

```json
  "scripts": {
    "compile": "yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol"
  }
```

## deploy

### ganache

本地搭建测试区块链 能够提供rpc url  虚拟账号  类似remix的jsvm

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733984954298-af54a6b9-1a3d-474c-ac9c-b0ceafd6bc3f.png)![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733985006947-5a95691a-4292-4ef6-a981-5b19f8cc0843.png)

### ethers

corepack enable 包管理器（yarn npm）的管理器

yarn add ethers

yarn add solc 编译sol

```json
"scripts": {
  "compile": "yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol"
}
```

yarn add dotenv --使用process.env读取.env文件

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734003920072-f497e9a6-49b9-4973-9b8e-a21118ae2b8e.png)

通过启动代码添加password    PRIVATE_KEY_PASSWORD=010034 node deploy.js

```javascript
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // 注意版本差异 v5使用 ethers.providers.JsonRpcProvider
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  // 使用明文私钥
  //   const wallet = new ethers.Wallet(
  //     process.env.PRIVATE_KEY,
  //     provider
  //   );
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  const wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD,
  );
  console.log(wallet);
  // 此处不知道为什么 无法连接上provider v5 v6？
  wallet = wallet.connect(provider);
  console.log(wallet);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8",
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");

  const contract = await contractFactory.deploy();
  console.log(contract);
  // wait(1) means wait one block
  const deploymentReceipt = await contract.deploymentTransaction().wait(1);
  console.log("here is the deployment transaction:");
  console.log(contract.deploymentTransaction);

  console.log("here is the deployment transaction receipt:");
  console.log(deploymentReceipt);

  console.log("Let's deploy with only transaction data!");

  //======the nonce is used to prevent double spending attack
  //======nonce is the transaction that the account ever send
  //======以前发了几个交易就填几 不需要nonce+1
  //   console.log(await wallet.getNonce());
  //   const tx ={
  //     nonce:8,
  //     gasPrice: 2000000000,
  //     gasLimit: 1000000,
  //     to: null,
  //     value: 0,
  //     data: "",
  //     chainId: 5777
  //   };
  //   const signedTXResponse = await wallet.signTransaction(tx);
  //   await wallet.sendTransaction(tx);

  const currentFacoriteNumber = await contract.retrieve();
  // string interpolation
  // In computer programming,
  // string interpolation (or variable interpolation, variable substitution, or variable expansion)
  // is the process of evaluating a string literal containing one or more placeholders,
  // yielding a result in which the placeholders are replaced with their corresponding values.
  console.log(`Current Favorite Number:${currentFacoriteNumber}`);
  const transactionResponse = await contract.store("9");
  // response只是打包交易的返回结果  等待一个区块保证交易被打包过后查看receipt
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number is :${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error();
    process.exit(1);
  });
const fs = require("fs-extra");
const ethers = require("ethers");
require("dotenv").config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  // 使用密码对密钥进行加密
  const encryptedJsonKey = wallet.encryptSync(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );

  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error();
    process.exit(1);
  });
```

### env

存储一个环境变量  export CAT=dog

查看 echo $CAT

或者写到启动脚本里面

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1733994185601-db02746f-d78b-4da3-98c5-6db499196416.png)

### ts

yarn add typescript ts-node  (node js version)

ts-node deploy.ts

yarn add @types/fs-extra(需要添加type script版本的fs包)

process.env读取出来是一个string或者undefined  需要告诉ts不会是空 （! 非空断言）

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734054615106-6ad9dca4-ac6f-4240-b4f7-7cf725660399.png)



# HardHat

## start

harhat有自己的虚拟网络和账号

nvm ls显示所有node版本

nvm use 18.0.0使用该版本node

```shell
// 新建文件夹
code .
yarn init

// 可能需要更新node版本
nvm install node
corepack enable (启用corepack 可以使用yarn npm pnpm)
yarn add --dev hardhat(--dev 指明dev环境所需的包)

// npx hardhat   yarn = npm  yarn = npx
yarn hardhat

yarn hardhat compile

yarn hardhat run script.js
```

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734056124391-9662061e-a535-4052-858e-c8de8f00cfa9.png)

## 目录结构

这些@是团队名称，用于区分哪些包是官方的 哪些不是

arn add --dev hardhat![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734056409639-1d8f85eb-34c3-4df8-be63-ab63d02b7be9.png)

hardhat.config.js是 所有js的入口

如果harhat.config.js找不到 那他可能是在上层目录  使用 npx harhat --verbose找到他

然后删掉重新 yarn hardhat

拿到一个项目可以先npm install安装依赖

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734056535667-c86040cf-cdbd-4f31-9417-fd959c40d57a.png)

artifacts是编译过后的存放位置

config.js指定了solidity版本

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734058993491-7875fded-2aec-4d99-a233-c4b690ee14e6.png)

## 指定测试网部署

在hardhat.config.js配置

chainlist获得chainId

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734065917753-f391d8f6-4943-485e-be44-7b0870b8648b.png)

注意配置文件  .env是小写 ！！！ 别写成.ENV了！！



## env.enc

```shell
yarn add --dev @chainlink/env-enc

yarn env-enc set-pw (设置一个密码)

yarn env-enc set  输入env信息进行加密生成env.enc文件

require("@chainlink/env-enc").config(); 修改配置文件 dotenv
```

更换成chainlink env-enc后又出现了配置文件类型问题 url需要是String

是因为重新启动了需要输入密码才能正常读取！

## verify

31337是本地hardhat默认id	

verify:verify是hardhat的指令

```javascript
const { ethers, run, network } = require("hardhat");
require("@chainlink/env-enc").config();

async function main() {
  // 注意await  如果不加就会导致报错
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract....");

  // 如果合约constructor需要参数 那么在这个deploy填入
  const simpleStoreage = await simpleStorageFactory.deploy();
  await simpleStoreage.waitForDeployment();
  console.log(`Deployed contract to: ${simpleStoreage.target}`);
  // only when using non-local network need verify
  if (network.config.chainId != 31337 && process.env.ETHERSCAN_APIKEY) {
    console.log("waiting for block confirmation...")
    await simpleStoreage.deploymentTransaction().wait(6);
    await verify(simpleStoreage.target, []);
  }
}

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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
```

verify里可以run的一些自带任务

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734266495871-d2597a01-99b4-4482-95d0-528b2115f80b.png)

编译错误可以上吊cache artifacts目录 重新试一下

## task

task会把命令加在命令行

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734332000308-e544f9cf-d6a5-4d3e-9839-32f999441925.png)

```javascript
const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
    // anonymous function
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`current block number is ${blockNumber}`)
  }
);
```

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734331981033-ae1ceb2e-6dbf-4c7c-95e6-ecaca152fcc1.png)

## node

yarn hardhat node

在本地启动hardhat节点

想要与这样启动的localhost节点交互需要配置一下（与default network harhat 不同）

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734332146641-ef88351c-a7c9-480e-986b-6620c791d7a6.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734332822561-1e75e957-978f-45db-a31a-694cf3dc7643.png)

## console

在控制台执行deploy脚本里的内容

yarn hardhat console --network localhost

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734335938335-783e434c-8089-4e5c-b00b-4c8d96b9a89f.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734336223136-1f36e562-3c86-48b7-bf06-b1356ca3071d.png)

## test

yarn harhat test --grep store  检索it（”something“）这里面的文本 然后运行那个it

也可以在it后面添加only 只运行它 

不加就会全部执行

```javascript
const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

// 可能有多个describe
describe("SimpleStorage", async () => {
  let simpleStorageFactory, simpleStorage;
  // it是需要运行的操作  beforeEach会在每一个it执行前执行
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with favorite number 0", async () => {
    const currentValue = await simpleStorage.receive();
    const expectedValue = "0";
    //assert
    //expect 功能一致
    assert.equal(currentValue.toString(), expectedValue);
    //expect(currentValue.toString()).to.equal(expectedValue);
  });

  it("should update when we call store", async () => {
    const expectedValue = "7";
    const transactionResp = await simpleStorage.store(expectedValue);
    await transactionResp.wait(1);

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  });
});
```

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734353326236-475f222a-8b84-4524-99b8-df3a57de6f11.png)



## gas reporter

yarn install hardhat-gas-reporter --dev

生成一个有关gas的报告 可以设置货币转化 token

```javascript
  gasReporter: {
    enable: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKET_APIKEY,
    token: "MATIC",
  }
```

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734402362479-faaf00ad-26d8-4c15-bd85-76dc487de91d.png)

## solidity-coverage

 @nomicfoundation/harhat-toolbox 包含了上面和这个插件

require引入 直接用  yarn hardhat coverage

看哪些代码是测试过的  哪些还没测试   如下 30 31行没测试

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734402599021-94bf99c5-feae-4034-b4d6-09f70d06de36.png)

## hardhat waffle

a advanced testing tool 

https://getwaffle.io/

已经被chai组件包含了 ！  expect就是它的关键词

## typescript 



添加ts依赖

```plain
yarn add --dev @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node @types/mocha ts-node typechain typescript
```

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734412160202-c9fcc001-b6f3-422a-846c-e51ec281ea2c.png)

修改语法 添加typechain hardhat

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734416909240-9a0180f2-f406-4ee0-93f5-2c8e97241121.png)

添加config

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734413225632-a975009d-a854-469c-a866-aa01aa7af61a.png)

yarn hardhat typechain 生成合约定义文件 typechain-types文件

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735007198285-ed8f4e0e-909f-47de-b837-abe6afe6423a.png)

如果不能正常生成则加上配置 或者把hardhat.config.js 改成ts格式即可

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735011237055-b6a13811-849f-4ee0-89d3-a5df2f09849e.png)

### as known as

类型不对的时候用这个

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734423617621-d4b0df7a-7aa9-414d-8086-28011224fbe4.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734423587157-54ee3bbd-5f33-40d7-9d8a-1fa296249d5b.png)



### export

export: 导出供其他模块使用（require/import）

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734420870178-71d4cd57-e704-4ec1-aad9-c338cb70cbf8.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734421271138-ae94fe1c-d9e4-4ad0-b14e-8eedb5398862.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734421282704-040d0ba5-d6d5-4981-8cd4-15228c506cd2.png)![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734421446246-8775bddd-659e-453f-8840-5a7fc074477e.png) 



## sohinit

检查文件的正确性 警告  类似eslint

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734425464944-769a0dbd-38d6-45fa-b0d5-fd5ee23e7a77.png)

## hardhat-deploy

https://github.com/wighawag/hardhat-deploy

https://github.com/wighawag/hardhat-deploy-ethers#readme

安装deploy

yarn add --dev hardhat-deploy 

改用deploy文件夹 可以批量deploy 根据文件名称顺序执行脚本

```shell
// 使用hardhat-deploy-ethers 复写ethers
yarn add --dev  @nomicfoundation/hardhat-ethers@npm:hardhat-deploy-ethers ethers
//注意新版为foundation
npm install --save-dev  @nomiclabs/hardhat-ethers hardhat-deploy-ethers ethers
```

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734495274328-9393d6dd-670a-489a-a4bb-585a073e004f.png)

**注意  需要先写入hardhat.config才能检测到deploy指令！！！！**

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734534817206-bfdc2ab7-7904-4e66-b3e0-5b9b40fd430a.png)

## Mocking

拿到mock接口导入

00-deploy-mocks.js 部署





## 单元测试 集成测试

yarn hardhat test --grep "<it/desc里面的文字说明>"

工作顺序: 编写部署脚本  编写测试脚本   coverage查看测试清空  逐一编写测试脚本完善coverage

staging测试假设已经再测试网上

### evm指令

https://hardhat.org/hardhat-network/docs/reference

```javascript
这两种方式都能发送指令
await network.provider.send("evm_setAutomine", [false]);

await hre.network.provider.request({
  method: "hardhat_impersonateAccount",
  params: ["0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6"],
});
```

## Solidity代码风格

自动生成doc

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734592305284-a3ffd488-8e79-4daf-953a-b59e9d7805b0.png)

## console.log hardhat

可以使用condole.log进行调试

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734668036820-67965941-aaa8-4254-a830-2e6b1ab2b658.png)



## gas优化

默认的 storage变量被存储在slot中  数组会存一个基本长度 具体的数值会求哈希后存储

mapping和数组一样 但是回存一个空的

constant 和 immutable 变量不会占用storage而是放在字节码中

临时变量被存放在memory中

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734669153866-1edbc89b-a7d3-4c8b-92a3-bad9d82a3461.png)

1. 修改变量名称 用存储位置做前缀 i_(immutable) s_(storage ) 
2. 优化函数 for循环 减少读取和存储次数  读取后存在memory然后操作 然后再同步上去
3. private变量  getField
4. revert 代替 require



## local node test

运行hh node就会自动运行deploy

（这个会默认在localhost，后面想要run scripts需要使用localhost）

1. yarn hardhat node
2. write scripts
3. yarn hardhat run scripts --network **localhost** 





## 前端

采用框架方案 原生跳过









## lottery合约项目全流程

### 合约

1. yarn add --dev hardhat
2. yarn hardhat  (empty)
3. add dependency

yarn add --dev @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-waffle hardhat-deploy hardhat-contract-sizer solhint dotenv prettier prettier-plugin-solidity

```plain
yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-ignition-ethers @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers@1 @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai@4 ethers@5 hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v6
```

可能还有一些peer dependency需要安装

1. 导入hardhat.config.js

```javascript
require("@nomiclabs/hardhat-waffle")
const helper = require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-contract-sizer")
require("dotenv").config()
```

1. 新建并修改prettier  帮助多人协作时统一格式
2. 编写合约代码 （VRF）
3. deploy脚本

采用本地mock进行测试 于是需要 00-deploy-mocks.js 

helper-hardhat-config 存放一些引用的合约的地址

hardhat.config.js:

namedAccounts：给账户取别名用于部署与访问是区分账户（可以分不同网络来设置）

networks: 不同网络信息 url pk blockfonfirmations

1. 测试编写 --更多的参照官方文档（项目用到了vrf）

**describe中可以不使用async function 使用可能会导致不执行问题**

1. 拿link  注册chainlink 拿到subId填入config  项目上线 拿到address  registe

[教程9-28](https://www.bilibili.com/video/BV1Ca411n7ta?spm_id_from=333.788.player.switch&vd_source=77e151f533c22ecfbabecd0aedfe0ba8&p=140)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735212403661-2ee2c95f-3c7b-4e5d-a30b-7c09a0b2100f.png)

1. staging --上线测试

### 前端

React next.js   hooks moralis

1. 前置工作

1. 新建next.js工程  

npx create-next-app@latest

https://nextjs.org/docs/app/getting-started/installation

1. moralis

https://docs.moralis.com/web3-data-api/evm/quickstart-nextjs









## shorthand

npm install --global hardhat-shorthand

然后就能用 hh 代替yarn hardhat了

hh compile



## ChainLink

 Subscription 是 Chainlink 提供的一种账户管理机制，用于管理和支付服务（如 VRF 或 Automation）的费用。它允许多个合约共享同一个账户中的资金（LINK 代币），从而更加灵活高效地使用 Chainlink 网络的资源。 

多个合约可以作为consumer绑定subId使用chainlink服务

### VRF

注意一下 subscriptionId进制问题！

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736580562257-da294a99-2c81-49af-abff-54a892554a76.png)



使用见官方案例https://docs.chain.link/vrf/v2-5/migration-from-v2或Raffle合约

request之后chainlink节点生成后调用fulfill函数

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736513509257-de3d5e96-d0e0-4ecc-9d4d-058ff53f25cb.png)

### keeper/automate

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735196893579-7a25761c-9e81-4c18-a9cc-fe8c739abafb.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735197194701-197ac383-c9bd-4168-8fa0-8c72fd93d8a5.png)

### chainlink local







## callStatic

新版改用 function.staticCall

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735112394010-f08dc665-90ae-4f0e-97fa-b91a40ee6416.png)

当你测试的时候需要使用到非 view函数的时候。 

根据该函数的设计初衷：判断是否需要进行交易

当你调用合约中的非 `view` 或非 `pure` 方法时，这种调用通常需要在区块链上执行一笔交易。交易执行需要：

1. 生成交易。
2. 将交易提交到区块链。
3. 等待区块链确认交易。

然而，某些情况下你只想获取方法返回值，而不想实际提交交易或改变区块链状态。**这时就可以使用** `**callStatic**`**。**

此处为语雀内容卡片，点击链接查看：https://www.yuque.com/u27651450/voc7dg/aktza3iepgovx9he



## Next.JS

### React

类似jsp  html和js放在一起  用插值的方式引用变量



只能有一个根元素 使用引入了fragment标签   或者空标签 <></>

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735369920227-c7fb1f0b-4753-4494-be6a-bdd53e0cabd3.png)

#### 动态绑定

响应式数据及其内容修改 useState （ref这种）

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735370189670-8b22e6f4-0463-4d01-b1b2-78a69a9a00bb.png)![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735370388960-eb084103-5438-4d52-965d-a3d037be9d91.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735370601753-4a1fac9e-c096-40e5-8d28-82f985b0fe45.png)

直接引入类名和相应style

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735372159194-77319a0f-7113-4605-882a-cba1eb2c7ce8.png)

#### 组件通信

父组件向子组件传值

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735372515308-bd8b4c2b-83b2-4d6d-b32c-26ca04b46631.png)![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735372849698-2ca06773-f0ad-49a2-b895-6f01fe778eb3.png)

配合解构

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735372547183-f098123c-d151-4e87-a4fd-5c829443f7f3.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735372619650-c02c03a6-9633-443a-a243-4c9237c40863.png)



子传父  父类随便定义一个prop（onActive）   子类接受prop然后传值就可以被父组件接受

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735374514440-8f26c5b6-84f5-4800-a3cf-650e5fd9ca36.png)

#### 插槽

获取子标签内容

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735373629546-e8952530-6680-4189-84cd-0eb2f901f099.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735373822485-e93dcb83-62b3-4315-bcff-78b5a29f941c.png)

#### hooks

useContext

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735376020964-603145a1-48e9-4069-87d8-cda289eafe7c.png)

useReducer



### 新版特性/一些概念

nextjs 是react框架的增强

新版next所有组件分为 服务端和客户端

默认情况下是服务端组件

可以显示的指明是客户端组件 "use client"

hooks 事件 Link  Image这些都是客户端组件  常见的能够识别 不需要添加use client



### hooks

useEffect 

```jsx
  // 当后方元素发生变化时调用前方函数  加载时会默认调用一次
  // 如果后方数组没有填写 nodependency array: run anytime something re-renders!
  // circular render!
  useEffect(()=>{
    if (typeof window !== undefined){
      if(window.localStorage.getItem("connected")){
        
      }
    }

    console.log("Hi")
    console.log(isWeb3Enabled)
  },[isWeb3Enabled])

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
```



### web3uikit 

https://web3ui.github.io/web3uikit/?path=/story/1-web3-parse-blockie--custom-seed



## constant生成

前端需要abi address等信息 需要能够根据后端生成 自己编写hardhat script运行 io生成即可



## IPFS

P2P存储系统 节点可以决定是否存储某些内容

数据可用性怎么保证？

通过哈希值进行内容寻址

内容的persistence被叫做pinning 节点可以自己决定是否保存

**部署在IPFS上的只能是static资源 无需后端服务的内容**

**npm build 和 next export区别？** 

服务器端负责路由和一些动态内容生成渲染

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735716068324-220a32b5-01ac-4e47-b944-c03a67ce8da3.png)

### Fleek/vercel

部署托管服务

fleek为Decentralized部署平台



## hardhat starter kit

https://github.com/smartcontractkit/hardhat-starter-kit/tree/main



## ERC20

简单来说就是一个约定成俗的token的规范 

用一个数组来记录地址所拥有的代币数量 



## AAVE

code实现的代替传统中心化银行的借贷项目

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735798969902-0c0d40ae-158a-45e3-8977-4beb501fcaf8.png)

## fork主网

一个本地主网  当请求主网上什么项目地址时 它就去主网上面拿  所以地址公用



## nft



链上存一个uri

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736394367390-4113dafe-a881-4542-b892-78c6e75fdae9.png)

nft元数据格式要求

https://docs.opensea.io/docs/metadata-standards

部署的时候还需要上传元数据。 就是在元数据里保存额外的信息attribute，保证其唯一性

### svg

采用base64编码 把svg代码转化

nft项目代码细节如: subscriptionId filter queryFilter的内容在代码中，但是遇到个部署很奇葩的问题。

在确定版本为2_5，subId gaslane之类信息为正确的之后。部署上测试网遇到subscriptionId out of bound

https://github.com/smartcontractkit/chainlink/issues/13099

连接中尝试用v2的subscriptionId 放到v2_5中使用 通过直接在etherscan生成v2版本短的ID使用

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736856315002-a609b847-a4e2-4957-8c30-dd59ce281518.png)

## abi.encode

https://docs.soliditylang.org/en/latest/cheatsheet.html

encodePacked 将他转为字节 去除掉多余的0

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736655100737-b66cd690-5844-4dcc-9bd3-ec3691b31b33.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736653426089-61bc732d-ece6-4d7e-91e7-42965c6d2f7c.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736653521075-2f509323-1496-419a-be1f-5f18e4e5da49.png)

当部署合约的时候 发送的交易信息会是这样的：

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736653578797-2a786b59-60d8-41f0-bee3-e7b919a836c3.png)

### decode

可以decode由encode加密的内容。第二个参数指明类型

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736655902482-7fc7e396-effb-43bf-bc07-1f7e9ba17b37.png)

这里是无法decode的。因为是用encodePacked加密的

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736655581629-7b0fa4e7-8cc2-4968-bb03-5375577a84b4.png)

packEncoding similar to type casting.   所以可以用string转化来获得

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736655610344-ae3f451a-b8ce-4d81-a593-cda8d76cf0e6.png)



### 通过tx.data调用函数





## call

前面的call其实就是在发送这个transaction。

data就是后面("")里面的内容 即calldata

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736656958184-92951d92-fd27-4fa2-aeaf-2fbda0ccdb86.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736656950687-ac29c877-caff-4792-ab8d-916751ebe382.png)

就是类似反射， 拿到参数和方法的字节码去call。 就是使用abi.encode相关函数获得字节码

encodeWithSelector代替了 bytes4(keccak256(bytes("")))这里的东西

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736661700059-6aac298f-cfd0-4a47-a662-3957ab3efd62.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736661842735-10afdbf8-b436-4dcc-8d2d-24b9b460d4cb.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736662075161-80f7aa40-4b58-4f9c-af4b-b1decb7d9ea0.png)

可以直接拿一个合约地址和一个signature就能调用它

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736662219447-a34226a5-3110-4187-ab5d-192e6d4f050b.png)

## NFT Marketplace

- 前端自建数据库对事件进行存储--使用moralis等api检测到链上event则触发用户脚本写入数据库。

对于index the events off-chain and read from our database这件事来说

moralis采用中心化方案

theGragh采用去中心化方案

- moralis可以useWeb3Contract 前端直接和合约交互。实现增删改查



### Moralis

这一部分不适用moralis。新版本不提供该服务了。

他的工作逻辑是，使用cloud function 绑定你的自定义脚本，监听事件实现和mongodb进行交互。

需要自建节点--firebase

就是可以作为监听链上变化的工具，为你的后端提供数据变化。

mongodb

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737359066133-4d2b7b85-c4da-41da-858b-35a45c215491.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737359476022-1643b4d9-d513-424c-844f-f221723dabdc.png)

### the Graph

一个去中心化的，链上数据的索引系统。

通过子图subgraph实现，系统角色分为子图开发者 消费者 索引者 策展者 委托人 仲裁员 渔夫

[https://thegraph.com/docs/zh/subgraphs/explorer/#1-%E7%B4%A2%E5%BC%95%E4%BA%BA](https://thegraph.com/docs/zh/subgraphs/explorer/#1-索引人)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737530388229-1fbe5323-295d-4703-9402-0174e64df143.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737527766805-cfc35849-fa02-4abc-bd1f-0733f34a2054.png)

- graph init
- 编写subgraph
- auth build deploy



NftMarketplace at 0xae6edbf73c1e8Ab81093BfEAF70A3309461f654f

BasicNFT  at 0x0899bBfA6E009915556017D0283c9fbD45D010fE 

### front-end

1. yarn add @apollo/client
2. yarn add graphql



## delegateCall

[https://github.com/PatrickAlphaC/hardhat-upgrades-fcc](https://github.com/PatrickAlphaC/hardhat-upgrades-fcc/blob/main/test/unit/boxUpgrades.test.js)

使用proxy指向新的contract implement用来实现更新合约的逻辑

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737976911559-d8626218-9d17-45e7-a193-7089bf35778c.png)



1. 更新只能append！ 设置变量实际上是根据slot来设置的！所以无法在更新中调整属性顺序。

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737977715475-17cbe7a7-bf6f-4546-8f0d-0a3a6131f1d2.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737977895635-8556dfb0-ef9d-483a-a92f-e2b371de91bb.png)

两个contract可能会存在同样的function selector！！！！

解决：admin只能call admin的方法 user只能用implement functions

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737978059610-4ee046f6-caa5-4297-ab54-3ccbcbf07fd9.png)

delegateCall就是拿到另一个合约的某个方法 放到当前合约执行一次然后删掉

其中的变量是根据slot设定的 而不是根据变量名

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738292751324-aadc038f-51c3-487d-a78c-039b33910f1f.png)

这个是对外暴露的合约，外部调用setValue的时候会调用父类Proxy 发现没有该方法就调用fallback 

然后 assembly内部delegateCall 读取implement槽位的合约 实现代理调用

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738298295982-8f36d392-7a7d-4d61-8470-175b8ff2d3fe.png)

这里的getDataToTransaction就是获得 调用方法和参数的字节码 

发送交易 就会发现没有这个方法 于是delegateCall  implement找到这个方法

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738299416972-7f29d379-4d5a-4e9b-8569-2516c5891150.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738299167084-b4217cca-e4f9-46c3-9d3f-31ffbca4da7f.png)

## DAO



## 安全和审计

常见错误

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738310977929-f9160c6c-7789-447d-a92f-8826fb42dea1.png)

### slither

https://github.com/crytic/slither

它需要python环境 我的wsl环境采用虚拟环境实现 

每次使用需要source /data/python/venv/bin/activate

能够检测reentrance   no badRNG Vault

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738310756567-2fa37f8a-027a-4e45-b401-8e7b5ab12146.png)

### fuzz test--echidna-test

https://github.com/crytic/echidna

可以直接使用docker

https://github.com/trailofbits/eth-security-toolbox

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738316615771-8a73d240-0fc2-418f-b445-af14d704126a.png)

how to use echidna

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738317116716-f7aaaee5-a4f8-4e16-ac8f-0b5d5a71063a.png)

echidna /src/contracts/test/fuzzing/VaultFuzzTest.sol --contract VaultFuzzTest --config /src/contracts/test/fuzzing/config.yaml



### 审查

- 小心中心化预言机！获取价格 随机数时注意！

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1738317197314-43bc6bf5-4c53-489f-8c07-e0698d8ead38.png)



# 问题记录

### the graph No such file

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1737547930420-8e5d319e-09bd-474e-ab19-52cd8cfa820f.png)

### 合约返回值问题

subId为什么要用tx 时间过滤得到 而不是看合约返回值就能接受！

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736498673474-6fc1e4da-615e-48b0-8468-13363440bdf6.png)![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1736498686263-ef5b2e81-f936-4562-a42a-63b8b18653a9.png)





### hh test

运行test没有任何反应

可能原因：test目录写成了 tests！



### deployer and signer

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735815270325-1afd874c-230f-4b5f-b07d-46af46ec012f.png)

### 编写代码为什么没用提示

先安装好基本框架 然后编译一次！

### chai

expect 无法正常工作  新版返回自定义错误需要使用 revertWitchCustomError

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735028188747-c008f7d1-8861-4259-b76d-a10c445f14d6.png)

```javascript
it("reverts when you don't pay enough", async () => {
  await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
    raffle,
    "Raffle__NotEnoughETH"
  );
});
```

### 配置读取格式错误

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734422258519-a599c47b-d597-4117-9888-ecd87ae1f7ec.png)

配置文件读取enc/enc.env文件类型报错

在js配置时 要加这个数组符号才读取成字符串

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734422313687-707355d8-36ac-432e-975d-35c7d2b63597.png)

但是在ts里 又不需要加[]

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1734422365790-2c705098-bb14-4b28-b0ae-79c24fb4457e.png)

### 找不到某方法

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735014226852-231d4815-8eb5-471e-9861-30addf4eed6d.png)



### chainId为空

这个是解构

错误写法

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735021155764-b5f45658-f1ca-44eb-a8b1-4fe5d3c5b7d0.png)

正确写法

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735021179456-77011363-a712-4af1-b7a7-04adeca40fbc.png)

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735021201966-548122f4-4a2e-437f-9b22-42d7c2263b05.png)

### Ether6改变

### Ethers.utils.parseEther

ethers6 已经把parseEther移到 ethers.parseEther!!

可能因为一些组件版本低 导致读不到也有可能  更新一下

**yarn add --dev @nomicfoundation/hardhat-chai-matchers @nomicfoundation/hardhat-ethers @typechain/hardhat hardhat-gas-reporter solidity-coverage**



### subscriptionId

BigInt可写可不写 重点知道改到了log topic里面

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735020819101-4d933e67-a190-4f86-ba64-3ff0afb559bf.png)



### getContract系列问题

https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/6004



**diff with getContractAt**

getContract 和 getContractAt 的主要区别在于它们的功能和使用场景。getContract 通常用于获取合约的地址、ABI（应用程序二进制接口）、字节码等信息，但**不返回合约实例**。而 getContractAt 则是用来获取一个已经部署到以太坊网络的智能合约的实例，允许用户通过合约地址与之进行互动。

```typescript
getContractAt: (
    nameOrAbi: string | any[],
    address: string | ethers.Addressable,
    signer?: ethers.Signer
  ) => Promise<ethers.Contract>;
    getContract: <ContractType extends ethers.BaseContract = ethers.BaseContract>
(name: string, signer?: ethers.Signer | string) 
=> Promise<ContractType>;
```

#### 对比总结

| 特性                     | `deployments.get`            | `ethers.getContract`   |
| ------------------------ | ---------------------------- | ---------------------- |
| **返回值**               | 合约的元信息（地址、ABI 等） | ethers.js 合约实例     |
| **是否需要手动创建实例** | 是                           | 否                     |
| **依赖部署记录**         | 是                           | 是                     |
| **支持签名者绑定**       | 否                           | 是（可指定账户）       |
| **适用场景**             | 需要元信息、手动控制合约实例 | 快速获取并操作合约实例 |

------

#### 具体使用对比

使用 `deployments.get`:

```javascript
const raffleDeployment = await deployments.get("Raffle");
const raffle = new ethers.Contract(raffleDeployment.address, raffleDeployment.abi, ethers.provider);
console.log(await raffle.someMethod());
```

使用 `ethers.getContract`:

```javascript
const raffle = await ethers.getContract("Raffle", deployer);
console.log(await raffle.someMethod());
```

**优选：**

- 如果你只需要交互合约，推荐使用 `ethers.getContract`，因为它更简洁。
- 如果你需要更底层的元信息（例如 ABI、字节码等），或者要手动控制实例化过程，可以使用 `deployments.get`。



ether.getContract获得的合约 地址在target里面

deployments.get也是可以获得contract的  地址在address里

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735022897131-d1794911-d65a-40f7-80f4-7c712aba08fe.png)

### ether.js和合约关系

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735113264163-1c4f32c1-152d-4afa-b35c-84bcad6602c0.png)



### ethers6 hardhat测试获取events

![img](./.Chainlink%E5%85%A5%E9%97%A8%E8%A7%86%E9%A2%91.assets/1735127870775-bd1c80a4-23b3-4885-9248-567b820456de.png)