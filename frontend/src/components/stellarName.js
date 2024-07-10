/**
 * @module Components
 */

import React from "react";
import "./stellarName.css";

/**
 * StellarName
 * 
 * This component is the name of the stellar object.
 * 
 * @param {Object} props - The props of the component.
 * 
 * @returns {JSX.Element} The StellarName component
 */
function StellarName({ name }) {
    return (
        <div className="mainStellarName">
            <p id="stellarName">{ name }</p>
        </div>
    );
}

export default StellarName;

