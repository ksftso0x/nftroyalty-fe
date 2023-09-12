/* global BigInt */
import React, { useState, useEffect } from "react";
import { ethers, utils } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';

import { getCGLDContractObject, getNFTContractObject, calcRewards, getContractInfo2 } from "../libs/contractInfo";

import NftSlide from "./NftSlide";
import config from '../config/config.json';

export default function Mint() {

  return (
    <div className="screen-wide-container" id="main">
      <div className="side-by-side">
        <NftSlide></NftSlide>
        <article className="textbox">
          <h2>Utility focused NFT collection</h2>
  
              <p style={{ marginTop: "20px" }}>
                <b>Songbird Apes</b> - This low supply and <b>utility packed NFT</b> collection is the latest series from the Canary Punks project and features amazing new traits, rare apes as well as future bonuses and utilities we develop in the future!
              </p>
              <p style={{ marginTop: "20px" }}>
                Public minting starts on <b>September 3rd, 2023</b> with a mint price of <b>444 CGLD</b> and <b>4444 SGB</b>
              </p>
              <p style={{ marginTop: "20px" }}>
                Whitelist users will gain <b>early 24 hours access to the mint</b>, giving them the best chances of minting early NFT's and collecting the most rewards from mint reflections... <b>1 max mint</b> per transaction during whitelist sale and <b>10 max mints</b> per transaction during public sale!
              </p>
              <p style={{ marginTop: "20px" }}>
                For every <b>25% completion</b> of the Songbird Apes mint, we will host <b>giveaways</b> in our Discord server! Rewards will include <b>$SGB, $CGLD and rare NFTs!</b>
              </p>
        </article>
      </div>
    </div>
  );
}
