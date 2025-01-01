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
