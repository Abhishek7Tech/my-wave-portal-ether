import logo from "./logo.svg";
import "./App.css";
import { Web3 } from "web3";
import { useEffect, useState } from "react";
import abi from "../src/utils/WavePortal.json";
// import {ethers} from "ethers";
const { ethers } = require("ethers");

const web3 = new Web3(
  "https://proud-billowing-vineyard.ethereum-sepolia.discover.quiknode.pro/22c9e775bb68b11e36415cf7d5a135c9726e391f/"
);

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.log("Connect to metamask!");
      return;
    }

    console.log("GotCha Ethereum", ethereum);

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("ACCOUNT FOUND", account);
      return account;
    } else {
      console.log("ACCOUNT NOT FOUND");
      return null;
    }
  } catch (error) {
    console.log("ERR", error);
    return null;
  }
};

function App() {
  const [account, setAccount] = useState("");
  const [waves, setWaves] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  const contractAddress = "0x5b4f911B639968911cBd51b8749740860E21eB26";
  const contractABI = abi.abi;

  const messageHandler = (e) => {
    e.preventDefault();
    console.log("MESSAFG", e.target.value);

    if (e.target.value.length) {
      setMessage(e.target.value);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const wavePortalContractStatic = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        const waves = await wavePortalContractStatic.getAllWaves();

        let wavesCleaned = [];

        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(Number(wave.timestamp) * 1000),
            message: wave.message,
          });
        });

        setAllWaves(wavesCleaned);
        // let wavesCleaned = await waves.map((wave) => console.log("IN WAVE",wave));

        console.log("WAVES", waves);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);

      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(Number(wave.timestamp) * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const connectWallet = async () => {
    console.log("CLICKED");
    try {
      const ethereum = getEthereumObject();

      if (!ethereum) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.log("ERRORS", error);
    }
  };

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setAccount(account);
      }
    });
    getAllWaves();
  }, []);

  const wave = async (e) => {
    e.preventDefault();

    if (!message) {
      alert("Write a message!");
    }
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        // Read data from the contract - Static
        const wavePortalContractStatic = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        // Write data in the contract - Dynamic
        const wavePortalContractDynamic = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        // console.log("DEPLOYED", await wavePortalContract.getDeployedCode());
        let count = await wavePortalContractStatic.getTotalWaves();
        console.log("Total waves", count.toString());

        setWaves(count.toString());

        const waveTxn = await wavePortalContractDynamic.wave(message, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();

        console.log("Mining----", waveTxn.hash);

        count = await wavePortalContractStatic.getTotalWaves();
        console.log("Current Total waves", count.toString());

        setWaves(count.toString());
        setMessage("");

        e.target.message.value = "";
      } else {
        console.log("Ethereum object not found!");
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I am Abhishek and I am a web developer so that's pretty cool right?
          Connect your Ethereum wallet and wave at me!
        </div>

        <form className="waveForm" onSubmit={wave}>
          <label>
            Message :
            <input
              className="inputMessage"
              onChange={messageHandler}
              name="message"
              type="text"
            ></input>
          </label>
          <button type="submit" className="waveButton">
            Wave at Me
          </button>
        </form>

        {!account && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {waves && <h2 className="bio">Total Waves: {waves}</h2>}

        {allWaves?.map((wave, index) => {
          return (
            <div key={index} className="message">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
