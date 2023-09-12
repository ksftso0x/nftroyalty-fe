/* global BigInt */
import { ethers, utils } from 'ethers';
import config from '../config/config.json';
import abiNFT from '../config/abiNFT.json';
import abiCGLD from '../config/abiCGLD.json';

export const displayBigInt = (nVal, decimals = 4) => {
  if (Number(nVal) === 0) {
    return (0).toFixed(decimals);
  }
  let nVal2 = Number(ethers.utils.formatEther(nVal)).toFixed(decimals);
  if (nVal2 === 0) {
    return "<" + "0.1".padEnd(decimals + 2, "0");
  }
  return nVal2;
};

export const calcRewards = async (scObj, walletAddr) => {
  let retVal = "?";
  try {
    if (!scObj) {
      console.log('Contract not initialized.');
      return retVal;
    }
    let rewardVal = await scObj.getClaimableAmountSGB(walletAddr);
    retVal = displayBigInt(rewardVal._hex);
    return retVal;
  } catch (error) {
    console.log(error);
    return retVal;
  }
};

export const getContractInfo = async (scObj) => {
  let paused = true;
  let mintStarted = false;
  let presaleActive = false;
  let totalMinted = 0;
  let mintPriceSGB = 0;
  let mintPriceCGLD = 0;
  let baseTokenURI = "";
  let cGLDAddr = "";
  let totalToMint = 0;
  let royaltyPercent = 0;
  let devAddrs = [];
  let devPercents = [];
  let whitelist = "";
  let rewardSGB = 0;
  let devPercSum = 0;

  try {
    if (!scObj) {
      console.log('Contract not initialized.');
      return [true, false, false, 0, 0, 0, "", "", 1, 1, "", "", "", 0, 0];
    }
    paused = await scObj.isPaused();
    mintStarted = await scObj.isStarted();
    presaleActive = await scObj.isPresaleLive();
    let totalSupply = await scObj.totalSupply();
    let priceSGB = await scObj.MINT_PRICE_SGB();
    let priceCGLD = await scObj.MINT_PRICE_CGLD();
    baseTokenURI = await scObj._baseTokenURI();
    cGLDAddr = await scObj.CGLDAddress();
    let cntSupply = await scObj.cntSupply();
    royaltyPercent = await scObj.royaltyPercent();
    devAddrs = await scObj.getDevAddresses();
    devPercents = await scObj.getDevPercents();
    whitelist = await scObj.getWhiteList();
    let rewardVal = await scObj.getOwnerFeeAmountSGB();
    let dpsVal = await scObj.devPercentSum();
    rewardSGB = displayBigInt(rewardVal._hex);
    devPercSum = parseInt(dpsVal._hex);
    totalMinted = parseInt(totalSupply._hex);
    totalToMint = parseInt(cntSupply._hex);
    mintPriceSGB = displayBigInt((presaleActive ? BigInt(priceSGB._hex * 0.9) : BigInt(priceSGB._hex)), 1);
    mintPriceCGLD = displayBigInt((presaleActive ? BigInt(priceCGLD._hex * 0.9) : BigInt(priceCGLD._hex)), 1);
    return [paused, mintStarted, presaleActive, totalMinted, mintPriceSGB, mintPriceCGLD, baseTokenURI, cGLDAddr, totalToMint, royaltyPercent, devAddrs, devPercents, whitelist, rewardSGB, devPercSum];
  } catch (error) {
    console.log(error);
    return [true, false, false, 0, 0, 0, "", "", 1, 1, "", "", "", 0, 0];
  }
};

export const getContractInfo2 = async (scObj) => {
  let presaleActive = false;
  let totalMinted = 0;
  let mintPriceSGB = 0;
  let mintPriceCGLD = 0;
  try {
    if (!scObj) {
      console.log('Contract not initialized.');
      return [false, 0, 0, 0];
    }
    presaleActive = await scObj.isPresaleLive();
    let totalSupply = await scObj.totalSupply();
    let priceSGB = await scObj.MINT_PRICE_SGB();
    let priceCGLD = await scObj.MINT_PRICE_CGLD();
    totalMinted = parseInt(totalSupply._hex);
    mintPriceSGB = displayBigInt((presaleActive ? BigInt(priceSGB._hex * 0.9) : BigInt(priceSGB._hex)), 1);
    mintPriceCGLD = displayBigInt((presaleActive ? BigInt(priceCGLD._hex * 0.9) : BigInt(priceCGLD._hex)), 1);
    return [presaleActive, totalMinted, mintPriceSGB, mintPriceCGLD];
  } catch (error) {
    console.log(error);
    return [false, 0, 0, 0];
  }
}

export const getCGLDContractObject = () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(config.CGLDCONTRACT_ADDR, abiCGLD, signer);
    if (!contract) {
      throw new Error('Failed to initialize contract.');
    }
    return contract;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNFTContractObject = () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(config.NFTCONTRACT_ADDR, abiNFT, signer);
    if (!contract) {
      throw new Error('Failed to initialize contract.');
    }
    return contract;
  } catch (error) {
    console.log(error);
    return null;
  }
};
