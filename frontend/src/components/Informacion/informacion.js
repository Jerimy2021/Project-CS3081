import "./informacion.css";
import React from "react";
import { useState, useEffect } from "react";

function Informacion({selectedPlanetRef}) {

    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        // Comprueba si la lista no está vacía
        console.log("holi:", selectedPlanetRef.current)
        if (selectedPlanetRef.current && selectedPlanetRef.current.length > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [selectedPlanetRef.current]);

    return (
        isVisible &&(
            <div className="informacion">
                <div id="leftInformacion" className="container">
                    <h1>Información</h1>
                    <p>En esta página se muestra información sobre el proyecto, los integrantes y el propósito de la página.</p>
                </div>
                <div id="rightInformacion" className="container">
                    <h1>Integrantes</h1>
                    <p>Este proyecto fue realizado por los estudiantes de la Universidad de Minnesota:</p>
                </div>
            </div>
        )
    );
}

export default Informacion;