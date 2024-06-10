import React from "react";
import StellarName from "../components/stellarName";
import ThreeDInterface from "../components/ThreeDInterface/ThreeDInterface";
import "./UI.css";

import { useState, useEffect, useRef } from "react";
import { getStellarSystems, getPlanets } from "../utils/apiFunctions";
import * as THREE from "three";

function loadData(setStellarSystems, setSelectedStellarSystem, setPlanets) {
    const stellar_systems_local = JSON.parse(localStorage.getItem('stellarSystems'));

    if (stellar_systems_local) {
        setStellarSystems(stellar_systems_local);
        const index = parseInt(localStorage.getItem('selectedStellarSystem'));
        setSelectedStellarSystem(parseInt(index));


        getPlanets(setPlanets, stellar_systems_local[index].name);
    } else {
        getStellarSystems(setStellarSystems);
    }
}



function UI() {

    //selectores
    const [stellar_systems, setStellarSystems] = useState([]);
    const [selected_stellar_system, setSelectedStellarSystem] = useState(0);
    const [planets, setPlanets] = useState([]);

    const cameraRef = useRef(null); 
    const sceneRef = useRef(null);
    const C = useRef(new THREE.Vector3(1, 0, 0)); // Camera direction
    const D = useRef(new THREE.Vector3(0, 0, -1)); // Camera right direction
    const planetsRef = useRef([]);

    const topCanvasRef = useRef({ current: { width: 0, height: 0, clientWidth: 0, clientHeight: 0 } });
    

    // Load planets
    useEffect(() => {
        loadData(setStellarSystems, setSelectedStellarSystem, setPlanets);
        
        const ctx = topCanvasRef.current.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';  


        const render = () => {
            if (!topCanvasRef.current) return;
            ctx.clearRect(0, 0, topCanvasRef.current.clientWidth, topCanvasRef.current.clientHeight);

            requestAnimationFrame(render);
        }

        render();

    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (!stellar_systems) return; // Wait for stellar systems to load

        if (stellar_systems.length > 0) {
            getPlanets(setPlanets, stellar_systems[selected_stellar_system].name);
        }
        
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_stellar_system]);

    return (
        <div className="UI jalar-a-derecha">
            <canvas className="topCanvas" ref={topCanvasRef} />
            <ThreeDInterface planets={planets} cameraRef={cameraRef} sceneRef={sceneRef} C={C} D={D} topCanvasRef={topCanvasRef} planetsRef={planetsRef} />
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
            <StellarName name={stellar_systems.length > 0 ? stellar_systems[selected_stellar_system].name : "Undefined"} />  
        </div>  
    );
}

export default UI;