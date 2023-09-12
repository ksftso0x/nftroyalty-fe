import React, { useState, useEffect } from "react";
import { ethers, utils } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';

import { getCGLDContractObject, getNFTContractObject, getContractInfo } from "../libs/contractInfo";
import config from '../config/config.json';

export default function OwnerPanel() {
  const addrReg = /^0x[a-fA-F0-9]{40}$/;
  const urlReg = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [cGLDObj, setCGLDObj] = useState(null);
  const [contractObj, setContractObj] = useState(null);
  const [ownership, setOwnership] = useState(true);
  const [paused, setPaused] = useState(true);
  const [mintStarted, setMintStarted] = useState(false);
  const [nftBaseURI, setNftBaseURI] = useState("");
  const [cGLDAddr, setCGLDAddr] = useState("");
  const [totalToMint, setTotalToMint] = useState(0);
  const [royaltyPercent, setRoyaltyPerc] = useState(0);
  const [devAddrs, setDevAddrs] = useState("");
  const [devPercs, setDevPercs] = useState("");
  const [devsInfo, setDevsInfo] = useState("");
  const [devCnt, setDevCnt] = useState(0);
  const [devAddrAdd, setDevAddrAdd] = useState("");
  const [devPercAdd, setDevPercAdd] = useState(0);
  const [devAddrEdit, setDevAddrEdit] = useState("");
  const [devPercEdit, setDevPercEdit] = useState(0);
  const [devAddrIdx, setDevAddrIdx] = useState(1);
  const [devPercIdx, setDevPercIdx] = useState(1);
  const [whitelist, setWhitelist] = useState("");
  const [rewardSGB, setRewardSGB] = useState("");
  const [devPercSum, setDevPercSum] = useState(0);
  const [preMintAddr, setPreMintAddr] = useState("");
  const [nftId, setNftId] = useState(1);
  const [freeMintAddr, setFreeMintAddr] = useState("");

  const checkOwnership = async () => {
    try {
      if (wallet) {
        const cgld = getCGLDContractObject();
        if (cgld) {
          setCGLDObj(cgld);
        }
        const contract = getNFTContractObject();
        if (contract) {
          const walletAddr = wallet.accounts[0]['address'];
          const ownerAddr = await contract.owner();
          setOwnership(walletAddr.toLowerCase() === ownerAddr.toLowerCase());
          setContractObj(contract);
        }
      }
    } catch (error) {
      console.log(error);
      setOwnership(false);
    }
  };

  const displayContractInfo = async () => {
    if (contractObj) {
      let arrDevInfo = [];
      let arrRet = await getContractInfo(contractObj);
      setPaused(arrRet[0]);
      setMintStarted(arrRet[1]);
      setNftBaseURI(arrRet[6]);
      setCGLDAddr(arrRet[7]);
      setTotalToMint(arrRet[8]);
      setRoyaltyPerc(arrRet[9]);
      // setDevAddrs(arrRet[10].join(","));
      // setDevPercs(arrRet[11].join(","));
      for (let i = 0; i < arrRet[10].length; i++) {
        arrDevInfo.push("(" + arrRet[10][i] + ", " + arrRet[11][i] + ")");
      }
      setDevsInfo(arrDevInfo.join("\r\n"));
      setDevCnt(arrRet[10].length);
      setWhitelist(arrRet[12]);
      setRewardSGB(arrRet[13]);
      setDevPercSum(arrRet[14]);
    }
  };

  const pauseSystem = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      const tx = await contractObj.pauseSystem({ gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("System paused.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const resumeSystem = async () => {
    try {
      if (!cGLDObj) {
        console.log('CGLD Contract not initialized.');
        return;
      }
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      const tx2 = await contractObj.resumeSystem({ gasLimit: 8000000 });
      const result2 = await tx2.wait();
      if (result2.status === 1) {
        alert("System resumed.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const startMint = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      const tx = await contractObj.startMint({ gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Minting started.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const claimRewards = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (parseFloat(rewardSGB) === 0) {
        alert("Unfortunately, your rewards is 0 SGB.");
        return;
      }
      const tx = await contractObj.ownerFeeWithdrawSGB({ gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Claimed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  }

  const setBaseURI = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (!urlReg.test(nftBaseURI)) {
        alert("Wrong URI format!");
        return;
      }
      const tx = await contractObj.setBaseURI(nftBaseURI, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Changed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const setCGLDAddress = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (!addrReg.test(cGLDAddr)) {
        alert("Wrong address format or length!");
        return;
      }
      const tx = await contractObj.setCGLDAddress(cGLDAddr, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Changed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const setRoyaltyPercent = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      const tx = await contractObj.setRoyaltyPercent(royaltyPercent, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Changed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  }

  const addNewDev = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (!addrReg.test(devAddrAdd)) {
        alert("Wrong address format or length!");
        return;
      }
      const tx = await contractObj.addDevAddrAndPerc(devAddrAdd, devPercAdd, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Added successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  }

  const setDevAddress = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (devCnt === 0) {
        alert("No devs added.");
        return;
      }
      if (!addrReg.test(devAddrEdit)) {
        alert("Wrong address format or length!");
        return;
      }
      const tx = await contractObj.setDevAddress(devAddrIdx, devAddrEdit, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Changed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  }

  const setDevPercent = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (devCnt === 0) {
        alert("No devs added.");
        return;
      }
      const tx = await contractObj.setDevPercent(devPercIdx, devPercEdit, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Changed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  }

  const addWhitelist = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      let arrWL = whitelist.split(",");
      let i = 0;
      console.log(arrWL);
      for (i = 0; i < arrWL.length; i++) {
        if (!addrReg.test(arrWL[i])) {
          alert("Wrong address format or length!");
          return;
        }
      }
      const tx = await contractObj.addWhiteList(arrWL, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Changed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const preMintNFT = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (!addrReg.test(preMintAddr)) {
        alert("Wrong address format or length!");
        return;
      }
      const tx = await contractObj.preMintNFT(nftId, preMintAddr, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Pre-minted successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const freeMintNFT = async () => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (!addrReg.test(freeMintAddr)) {
        alert("Wrong address format or length!");
        return;
      }
      const tx = await contractObj.freeMintNFT(freeMintAddr, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Free-minted successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkOwnership();
  }, [wallet]);

  useEffect(() => {
    displayContractInfo();
  }, [contractObj]);


  return (
    <div className="admin-panel" id="ownerpanel">
      {(wallet && ownership) ? (
        <>
          <h1 style={{ textAlign: "center" }}>Admin Panel</h1>
          <div className="admin-panel-row">
            <div>
              <h2>Status : <b>{paused ? "Paused" : "Not Paused"}</b>,&nbsp;<b>{mintStarted ? "Mint Started" : "Mint not Started"}</b></h2>
            </div>
            {paused ? (
              <div>
                <button className="button" onClick={(e) => resumeSystem()}>Resume System</button>
              </div>
            ) : (
              <div>
                <button className="button" onClick={(e) => pauseSystem()}>Pause System</button>
              </div>
            )}
            {(!mintStarted && !paused) ? (
              <div>
                <button className="button" onClick={(e) => startMint()}>Start Mint</button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="admin-panel-row">
            <div>
              <h2>Your rewards : &ensp;<b>{rewardSGB}</b>&ensp;SGB</h2>
            </div>
            <div>
              <button className="button" onClick={(e) => claimRewards()}>Claim Your Rewards!</button>
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <h2>Total Supply : &ensp;<b>{totalToMint}</b>&ensp;NFTs</h2>
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <h2>Total Percent For Devs : &ensp;<b>{devPercSum}</b>&ensp;%</h2>
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => setBaseURI()}>Set Base URI</button>
            </div>
            <div>
              <input type="text" className="admin-panel-text" value={nftBaseURI} placeholder="base URI" onChange={(e) => { setNftBaseURI(e.target.value) }} />
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => setCGLDAddress()}>Set CGLD Address</button>
            </div>
            <div>
              <input type="text" className="admin-panel-text" value={cGLDAddr} placeholder="address" onChange={(e) => { setCGLDAddr(e.target.value) }} />
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => setRoyaltyPercent()}>Set Royalty Percent</button>
            </div>
            <div>
              <input type="number" className="admin-panel-number" min={0} max={10} value={royaltyPercent} onChange={(e) => { setRoyaltyPerc(e.target.value) }} />
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <h2>Devs Info : </h2>
              <h2>(Address, %)</h2>
            </div>
            <div>
              <textarea className="admin-panel-textarea" value={devsInfo} readOnly></textarea>
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => addNewDev()}>Add a New Dev</button>
            </div>
            <div>
              <input type="text" className="admin-panel-text" value={devAddrAdd} placeholder="dev address" onChange={(e) => { setDevAddrAdd(e.target.value) }} />
              <br></br>
              <input type="number" className="admin-panel-number" style={{ width: "50%" }} min={0} max={100} value={devPercAdd} placeholder="dev percent" onChange={(e) => { setDevPercAdd(e.target.value) }} />
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => setDevAddress()}>Set Dev Address</button>
            </div>
            <div>
              <input type="number" className="admin-panel-number" style={{ width: "50%" }} min={1} max={devCnt} value={devAddrIdx} placeholder="index" onChange={(e) => { setDevAddrIdx(e.target.value) }} />
              <br></br>
              <input type="text" className="admin-panel-text" value={devAddrEdit} placeholder="address" onChange={(e) => { setDevAddrEdit(e.target.value) }} />
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => setDevPercent()}>Set Dev Percent</button>
            </div>
            <div>
              <input type="number" className="admin-panel-number" min={1} max={devCnt} value={devPercIdx} placeholder="index" onChange={(e) => { setDevPercIdx(e.target.value) }} />&ensp;(Index)
              <br></br>
              <input type="number" className="admin-panel-number" min={0} max={20} value={devPercEdit} placeholder="percent" onChange={(e) => { setDevPercEdit(e.target.value) }} />&ensp;(Percent)
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => addWhitelist()}>Add Whitelist</button>
            </div>
            <div>
              <textarea className="admin-panel-textarea" value={whitelist} onChange={(e) => { setWhitelist(e.target.value) }}></textarea>
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => preMintNFT()}>Pre-mint NFT</button>
            </div>
            <div>
              <input type="number" className="admin-panel-number" style={{ width: "50%" }} min={1} max={totalToMint} value={nftId} placeholder="token Id" onChange={(e) => { setNftId(e.target.value) }} />
              <br></br>
              <input type="text" className="admin-panel-text" value={preMintAddr} placeholder="address" onChange={(e) => { setPreMintAddr(e.target.value) }} />
            </div>
          </div>
          <div className="admin-panel-row">
            <div>
              <button className="button" onClick={(e) => freeMintNFT()}>Free-mint NFT</button>
            </div>
            <div>
              <input type="text" className="admin-panel-text" value={freeMintAddr} placeholder="address" onChange={(e) => { setFreeMintAddr(e.target.value) }} />
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>Sorry, you are not allowed to access this page.</h2>
          <button className='button' disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
            {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
          </button>
        </>
      )}
    </div>
  );
}