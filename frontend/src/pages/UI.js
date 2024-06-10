import React from "react";
import CanvasComponent from "../components/canvasComponent";
import StellarName from "../components/stellarName";
import "./UI.css";

function UI() {
    const StellarNameProps = {
        name: "My solar system"
    };
    return (
        <div className="UI jalar-a-derecha">
            <CanvasComponent />
            <div className="controles">
                <p>Press K to 'Control key menu'</p>
                <p>Press F to 'Focus on a planet'</p>
                <p>Press C to change de stellar system</p>
                <p>Press B to report a bug</p>
                <p>Press E to exit</p>
            </div>
            <div className="cross-center">
                +
            </div>
            <StellarName {...StellarNameProps} />    
        </div>  
    );
}

export default UI;