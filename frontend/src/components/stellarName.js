import React from "react";
import "./stellarName.css";

function StellarName({ name }) {
    return (
        <div className="mainStellarName">
            <p id="stellarName">{ name }</p>
        </div>
    );
}

export default StellarName;

