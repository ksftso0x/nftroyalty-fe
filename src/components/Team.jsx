import React from "react";
import "../css/texts.css";
import "../css/flexboxes.css";
import Nft1 from "../assets/nfts/11.png";
import Nft2 from "../assets/nfts/6.png";
import Nft3 from "../assets/nfts/70.png";
import Nft4 from "../assets/nfts/68.png";


export default function Team() {
  return (
    <div className="screen-wide-container" id="team">
      <h1 style={{ textAlign: "center" }}>Team</h1>
      <div className="side-by-side">
        <div className="nft-team">
          <h4>TrapJK</h4>
          <img src={Nft1} alt="Nft1" width="100%" />
        </div>
        <div className="nft-team">
          <h4>StarSailer</h4>
          <img src={Nft2} alt="Nft2" width="100%" />
        </div>
        <div className="nft-team">
          <h4>SF90</h4>
          <img src={Nft3} alt="Nft3" width="100%" />
        </div>
        <div className="nft-team">
          <h4>JP</h4>
          <img src={Nft4} alt="Nft4" width="100%" />
        </div>
      </div>
    </div>
  );
}
