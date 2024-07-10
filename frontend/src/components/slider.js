/**
 * @module Components
 */
import React from "react";
import "./slider.css";

/**
 * Slider
 * 
 * This component is the slider of the application.
 * 
 * @param {Object} props - The props of the component.
 * @param {number} props.length - The length of the slider.
 * @param {number} props.index - The index of the slider.
 * 
 * @returns {JSX.Element} The Slider component
 */
function Slider({ length, index, setIndex }) {
  const handleNext = () => {
    if (!length) return;
    setIndex((index + 1) % length);
  };

  const handlePrev = () => {
    if (!length) return;
    setIndex((index - 1 + length) % length);
  }

  return (
    <div className="main2D">
        <div className="slider">
            <button id="prev" className="sliderButton" onClick={handlePrev}>&lt;</button>
            <button id="next" className="sliderButton" onClick={handleNext}>&gt;</button>
        </div>
    </div>
  );
}

export default Slider;

