import React, { useState, useEffect } from "react";
import { ethers, utils } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';

import { displayBigInt, getCGLDContractObject, getNFTContractObject, getContractInfo } from "../libs/contractInfo";
import config from '../config/config.json';

export default function DevPanel() {
  const addrReg = /^0x[a-fA-F0-9]{40}$/;
  const urlReg = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [contractObj, setContractObj] = useState(null);
  const [ownership, setOwnership] = useState(true);
  const [paused, setPaused] = useState(true);
  const [mintStarted, setMintStarted] = useState(false);
  const [nftBaseURI, setNftBaseURI] = useState("");
  const [cGLDAddr, setCGLDAddr] = useState("");
  const [totalToMint, setTotalToMint] = useState(0);
  const [royaltyPercent, setRoyaltyPerc] = useState(0);
  const [devsInfo, setDevsInfo] = useState("");
  const [devCnt, setDevCnt] = useState(0);
  const [devAddrIdx, setDevAddrIdx] = useState(1);
  const [whitelist, setWhitelist] = useState("");
  const [rewardSGB, setRewardSGB] = useState("");
  const [devPercSum, setDevPercSum] = useState(0);

  const checkOwnership = async () => {
    try {
      if (wallet) {
        const contract = getNFTContractObject();
        if (contract) {
          let isDev = false;
          const walletAddr = wallet.accounts[0]['address'];
          const devAddrs = await contract.getDevAddresses();
          for (let i = 0; i < devAddrs.length; i++) {
            if (walletAddr.toLowerCase() === devAddrs[i].toLowerCase()) {
              isDev = true;
              setDevAddrIdx(i + 1);
              break;
            }
          }
          setOwnership(isDev);
          console.log(devAddrs);
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
      for (let i = 0; i < arrRet[10].length; i++) {
        arrDevInfo.push("(" + arrRet[10][i] + ", " + arrRet[11][i] + ")");
      }
      setDevsInfo(arrDevInfo.join("\r\n"));
      setDevCnt(arrRet[10].length);
      setWhitelist(arrRet[12]);
      let rewardVal = await contractObj.getDevFeeAmountSGB(devAddrIdx);
      setRewardSGB(displayBigInt(rewardVal._hex));
      setDevPercSum(arrRet[14]);
    }
  };

  const claimRewards = async() => {
    try {
      if (!contractObj) {
        console.log('Contract not initialized.');
        return;
      }
      if (parseFloat(rewardSGB) === 0) {
        alert("Unfortunately, your rewards is 0 SGB.");
        return;
      }
      const tx = await contractObj.devFeeWithdrawSGB(devAddrIdx, { gasLimit: 8000000 });
      const result = await tx.wait();
      if (result.status === 1) {
        alert("Claimed successfully.");
      }
      displayContractInfo();
    } catch (error) {
      console.log(error);
    }
  }

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
            <h2>Base URI : </h2>
          </div>
          <div>
            <input type="text" className="admin-panel-text" value={nftBaseURI} placeholder="base URI" readOnly/>
          </div>
        </div>
        <div className="admin-panel-row">
          <div>
            <h2>CGLD Address : </h2>
          </div>
          <div>
            <input type="text" className="admin-panel-text" value={cGLDAddr} placeholder="address" readOnly/>
          </div>
        </div>
        <div className="admin-panel-row">
          <div>
            <h2>Royalty Percent : </h2>
          </div>
          <div>
            <input type="number" className="admin-panel-number" min={0} max={10} value={royaltyPercent} readOnly/>
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
            <h2>Whitelist : </h2>
          </div>
          <div>
            <textarea className="admin-panel-textarea" value={whitelist} readOnly></textarea>
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
