import React from "react";
import StellarName from "../components/stellarName";
import ThreeDInterface from "../components/ThreeDInterface/ThreeDInterface";
import "./UI.css";

import { useState, useEffect, useRef } from "react";
import { getStellarSystems, getPlanets } from "../utils/apiFunctions";
import * as THREE from "three";


function UI() {
    const StellarNameProps = {
        name: "My solar system"
    };

    //selectores
    const [stellar_systems, setStellarSystems] = useState([]);
    const [selected_stellar_system, setSelectedStellarSystem] = useState('');
    const [planets, setPlanets] = useState([
        {
            name: "Earth",
            radius: "6.371",
            textures: {
                diffuse: "https://raw.githubusercontent.com/gist/juanmirod/081a0b45372f6da81469/raw/526488c67e82f8916f21c07c0b7707b6d5a3615c/earth_texture_map_1000px.jpg",
                normal: "",
                specular: "",
                emissive: "",
                opacity: "",
                ambient: ""
            },
            coordinates: { x: 500, y: 0, z: 0 }
        },
    ]);

    const cameraRef = useRef(null);
    const sceneRef = useRef(null);
    const C = useRef(new THREE.Vector3(1, 0, 0)); // Camera direction
    const D = useRef(new THREE.Vector3(0, 0, -1)); // Camera right direction

    const topCanvasRef = useRef(null);
    

    // Load planets
    useEffect(() => {
        getStellarSystems(setStellarSystems);
    }, []);

    useEffect(() => {
        if (stellar_systems.length > 0) {
        getPlanets(setPlanets, stellar_systems[0].name);
        }
    }, [selected_stellar_system]); 

    return (
        <div className="UI jalar-a-derecha">
            <canvas className="topCanvas" ref={topCanvasRef} />
            <ThreeDInterface planets={planets} cameraRef={cameraRef} sceneRef={sceneRef} C={C} D={D} topCanvasRef={topCanvasRef} />
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