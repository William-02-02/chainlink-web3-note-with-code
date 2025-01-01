import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
<script type="module">
  import {ethers} from
  "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"; // Your
  code here...
</script>;
const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
connectBtn.onclick = connect;
fundBtn.onclick = fund;

console.log(ethereum);
async function connect(params) {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectBtn.innerHTML = "Connected!";
  } else {
    connectBtn.innerHTML = "Please Connect!";
  }
}

// fund function
async function fund(ethAmmount) {
  console.log(`funding with ${ethAmmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.provider.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer);
  }
}
