import React from "react";
import "./slider.css";
import StellarName from "./stellarName";

function Slider({ value, setValue }) {
  return (
    <div class="main2D">
        <div class="slider">
            <button id="prev" class="sliderButton">&lt;</button>
            <button id="next" class="sliderButton">&gt;</button>
        </div>
    </div>
  );
}

export default Slider;

