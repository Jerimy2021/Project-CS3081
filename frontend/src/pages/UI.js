import React from "react";
import CanvasComponent from "../components/canvasComponent";
import Slider from "../components/slider";
import StellarName from "../components/stellarName";
import "./UI.css";

function UI() {
    return (
        <div className="UI">
            <CanvasComponent />
            <div class="controles">
                <p>Press K to 'Control key menu'</p>
                <p>Press C to change de stellar system</p>
                <p>Press B to report a bug</p>
                <p>Press E to exit</p>
            </div>
            <div class="cross-center">
                +
            </div>
            <StellarName />      
        </div>  
    );
}

export default UI;