import React from "react";
import "./slider.css";
import StellarName from "./stellarName";

function Slider({ value, setValue }) {
  return (
    <div className="main2D">
        <div className="slider">
            <button id="prev" className="sliderButton">&lt;</button>
            <button id="next" className="sliderButton">&gt;</button>
        </div>
    </div>
  );
}

export default Slider;

