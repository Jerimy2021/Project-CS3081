import React from "react";
import "./stellarName.css";

function StellarName(props) {
    return (
        <div className="mainStellarName">
            <p id="stellarName">{props.name}</p>
        </div>
    );
}

export default StellarName;

