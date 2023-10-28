import logo from './logo.svg';
import './App.css';
import {Web3} from "web3";
import {useEffect, useState} from "react";
import abi from "../src/utils/WavePortal.json";
// import {ethers} from "ethers";
const {ethers} = require("ethers");

const web3 = new Web3("https://proud-billowing-vineyard.ethereum-sepolia.discover.quiknode.pro/22c9e775bb68b11e36415cf7d5a135c9726e391f/");

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try {
    
    const ethereum = getEthereumObject();

    if(!ethereum) {
      console.log("Connect to metamask!");
      return;
    }

    console.log("GotCha Ethereum", ethereum);

    const accounts = await ethereum.request({method: "eth_accounts"});

    if(accounts.length !== 0) {
      const account = accounts[0];
      console.log("ACCOUNT FOUND", account);
      return account;
    }else {
      console.log("ACCOUNT NOT FOUND");
      return null;
    }
  } catch (error) {
    console.log("ERR", error);
    return null;
  }
}


function App() {

  const [account, setAccount] = useState("");

  const contractAddress = "0x3978A079DDADC078DDa9C68Cc61A22254EAe60DA";
  const contractABI = abi.abi;

  const connectWallet = async () => {
    console.log("CLICKED");
    try {
      const ethereum = getEthereumObject();

      if(!ethereum) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      console.log("Connected", accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.log("ERRORS", error);
    }
  }

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if(account !== null) {
        setAccount(account);
      }
    })
  },[]);

  const wave = async () => {
    try {
      const {ethereum} = window;
      
      if(ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        // Read data from the contract - Static
        const wavePortalContractStatic = new ethers.Contract(contractAddress, contractABI, provider);

        // Write data in the contract - Dynamic
        const wavePortalContractDynamic = new ethers.Contract(contractAddress, contractABI, signer); 
      // console.log("DEPLOYED", await wavePortalContract.getDeployedCode());
        let count = await wavePortalContractStatic.getTotalWaves();
        console.log("Total waves", count.toString());
     
        const waveTxn = await wavePortalContractDynamic.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();

        console.log("Mining----", waveTxn.hash);

        count = await wavePortalContractStatic.getTotalWaves();
        console.log("Current Total waves", count.toString());
     
      }else {
        console.log("Ethereum object not found!");
      }
    } catch (error) {
      console.log("ERROR", error);
    }
    
  }
  return (
    <div className="mainContainer">

    <div className="dataContainer">
      <div className="header">
      👋 Hey there!
      </div>

      <div className="bio">
      I am Abhishek and I am a web developer so that's pretty cool right? Connect your Ethereum wallet and wave at me!
      </div>

      <button className="waveButton" onClick={wave}>
        Wave at Me
      </button>

      {
        !account && (
          <button className='waveButton' onClick={connectWallet}>Connect Wallet</button>
        )
      }
    </div>
  </div>
  );
}

export default App;
