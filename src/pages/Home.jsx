import React from "react";
import { useState, useEffect } from "react";

import "../css/flexboxes.css";
import "../css/texts.css";
import "../css/buttons.css";
import "../css/background.css";
import Header from "../components/Header";
import Mint from "../components/Mint";
import About from "../components/About";
import Roadmap from "../components/Roadmap";
import Team from "../components/Team";
import Background from "../components/Background";

export default function Home() {

  const [isPerformanceMode, setIsPerformanceMode] = useState(false)

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("storedData"));
    if (storedData) {
      setIsPerformanceMode(storedData);
    }
  }, [])


  useEffect(() => {
    localStorage.setItem("storedData", JSON.stringify(isPerformanceMode));
  }, [isPerformanceMode])


  return (
    <>
      {isPerformanceMode ?<div className='background'></div> : <Background />}
      <button className='button performance' onClick={() => { setIsPerformanceMode(!isPerformanceMode) }}>
        {isPerformanceMode ? 'looks boring?' : 'low fps?'}
      </button>
      <Header></Header>
      <main>
        <Mint />
        <About></About>
        {/* <Roadmap /> */}
        <Team />
      </main>
      <footer>
        <p>© 2023 Canary Punks</p>
      </footer>
    </>
  );
}
