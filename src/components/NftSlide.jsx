import React, { useState, useEffect } from "react";
import "../css/nftslide.css";
import Nft1 from "../assets/nfts/1.png";
import Nft2 from "../assets/nfts/67.png";
import Nft3 from "../assets/nfts/69.png";
import Nft4 from "../assets/nfts/71.png";
import Nft5 from "../assets/nfts/5.png";
import Nft6 from "../assets/nfts/2.png";
import Nft7 from "../assets/nfts/3.png";
import Nft8 from "../assets/nfts/4.png";


export default function NftSlide() {
  const [NftNum, setNftNum] = useState(0);
  const [isHiding, setIsHiding] = useState(false);
  const nfts = [Nft1, Nft2, Nft3, Nft4, Nft5, Nft6, Nft7, Nft8];
  const ANIM_TIME = 1000;

  const triggerAnimation = () => {
    if (!isHiding) {
      setIsHiding(true);
      setTimeout(() => {
        setNftNum((NftNum) => (NftNum + 1) % nfts.length);
      }, ANIM_TIME / 2);
      setTimeout(() => {
        setIsHiding(false);
      }, ANIM_TIME);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      triggerAnimation();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nft-slide">
      <img src={nfts[NftNum]} alt="Nft1" className={isHiding ? "hide" : ""} width="100%"/>
    </div>
  );
}