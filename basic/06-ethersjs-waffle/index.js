const fs = require("fs");
const SimpleTokenJson = require("./build/SimpleToken.json");

const { ethers } = require("ethers");

require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;

// const web3 = new Web3.providers.HttpProvider('https://kovan.infura.io/v3/0aae8358bfe04803b8e75bb4755eaf07');
//  let web3Provider = new ethers.providers.Web3Provider(web3)

const web3Provider = new ethers.providers.InfuraProvider(
  "kovan",
  process.env.INFURA_ID
);

const wallet = new ethers.Wallet(privateKey, web3Provider);

let address = "0x54A65DB20D7653CE509d3ee42656a8F138037d51";

let bal;

// support eip1559
async function getGasPrice() {
  const res = await web3Provider.getFeeData()
  let maxFeePerGas = res.maxFeePerGas;
  let maxPriorityFeePerGas = res.maxPriorityFeePerGas;
  console.log("maxFeePerGas: ", maxFeePerGas.toString());
  console.log("maxPriorityFeePerGas:", maxPriorityFeePerGas.toString());

  return {
    maxFeePerGas: maxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGas,
  };
}

async function checkBalance() {
  const balance = await web3Provider.getBalance(address)
  // balance is a BigNumber (in wei); format is as a sting (in ether)
  let etherString = ethers.utils.formatEther(balance);
  return etherString;
}



let token;
async function deploy(etherBalanceString) {
  console.log("balance: ", etherBalanceString);
  let option = await getGasPrice();
  // 常见合约工厂实例
  const simpleToken = new ethers.ContractFactory(
    SimpleTokenJson.abi,
    SimpleTokenJson.bytecode,
    wallet
  );
  token = await simpleToken.deploy("HEHE", "HH", 1, 100000000);
  tx = await token.transfer(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    ethers.utils.parseEther("0.00000000001"),
    option
  );
  console.log(wallet.address);
  console.log(token.address);

  console.log(token.deployTransaction.hash);

  await token.deployed();

  let bal = await token.balanceOf(wallet.address);
  console.log(bal.toString());
}
checkBalance().then(deploy);
