/**
 * @module Pages
 */
import React from "react";
import StellarName from "../components/stellarName";
import ThreeDInterface from "../components/ThreeDInterface/ThreeDInterface";
import LoadWindow from "../components/LoadWindow/LoadWindow";
import Informacion from "../components/Informacion/informacion";
import "./UI.css";

import { useState, useEffect, useRef } from "react";
import { getStellarSystems, getPlanets } from "../utils/apiFunctions";
import * as THREE from "three";
import { drawCircleAroundPlanets, MenuKeysDown, drawSpeedometer} from "../utils/twoDInterfaceUtils";

/**
 * Load Data
 * 
 * Load the data from the local storage if it exists, otherwise it will fetch the data from the API
 * 
 * @param {function} setStellarSystems - Function to set the stellar systems
 * @param {function} setSelectedStellarSystem - Function to set the selected stellar system
 * @param {function} setPlanets - Function to set the planets
 * @returns {void}
 */
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


/**
 * UI
 * 
 * Main UI component: It will load the data and render the 2D and 3D interfaces, it also contains the main context for the 2D interface, the 3D scene references, and the camera references
 * 
 * This component contain all the layers for the UI, the 2D interface, the 3D interface, the load window, the stellar name, and the information window
 * 
 * @returns {JSX.Element} JSX Element
 */
function UI() {
    const [stellar_systems, setStellarSystems] = useState([]);
    const [selected_stellar_system, setSelectedStellarSystem] = useState(0);
    const [planets, setPlanets] = useState([]);

    const cameraRef = useRef(null); 
    const cameraTargetPositionRef = useRef(new THREE.Vector3(0, 0, 0));
    const cameraMovingRef = useRef(false);

    const C = useRef(new THREE.Vector3(1, 0, 0)); // Camera direction
    const D = useRef(new THREE.Vector3(0, 0, -1)); // Camera right direction

    const sceneRef = useRef(null);
    

    const planetsRef = useRef([]);

    const topCanvasRef = useRef({ current: { width: 0, height: 0, clientWidth: 0, clientHeight: 0 } });

    const infoDivRef = useRef({ current: { width: 0, height: 0, clientWidth: 0, clientHeight: 0 } });
    
    const selectedPlanetsRef = useRef([]); 
    const [fixedPlanetData, setFixedPlanetData] = useState({});

    const speedUp = useRef(0);
    const maxSpeedUp = 5000;

    const draw = useRef(true);

    
    // emergent windows
    const [visibleInfoBool, setVisibleInfoBool] = useState(false);
    const visibleInfBoolRef = useRef(false);

    const composerRef = useRef(null);

    // Load planets
    useEffect(() => {
        loadData(setStellarSystems, setSelectedStellarSystem, setPlanets);
        const ctx = topCanvasRef.current.getContext('2d');

        //Configure key bindings for the 2D Menu
        window.addEventListener('keydown', (e) => MenuKeysDown(e, selectedPlanetsRef, planetsRef, cameraRef, C, D, topCanvasRef, setFixedPlanetData, setVisibleInfoBool, visibleInfBoolRef, cameraTargetPositionRef, cameraMovingRef));
        window.addEventListener('click', (e) => {
            if (visibleInfBoolRef.current) {
                visibleInfBoolRef.current = false;
                setVisibleInfoBool(false);
            }
        });
        // Render function
        const render = () => {

            if (!topCanvasRef.current) return;

            topCanvasRef.current.width = window.innerWidth;
            topCanvasRef.current.height = window.innerHeight;

            if (draw.current){
                drawCircleAroundPlanets(topCanvasRef, planetsRef, cameraRef, C, selectedPlanetsRef, ctx);
                drawSpeedometer(topCanvasRef, speedUp, maxSpeedUp, ctx);
            }

            // lerp camera
            if (cameraMovingRef.current) {
                cameraRef.current.position.lerp(cameraTargetPositionRef.current, 0.1);

                if (cameraRef.current.position.distanceTo(cameraTargetPositionRef.current) < 3) {
                    cameraMovingRef.current = false;
                }
            }

            requestAnimationFrame(render);
        }

        render();
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Load planets
    useEffect(() => {
        if (!stellar_systems) return; // Wait for stellar systems to load
        if (stellar_systems.length > 0) {
            getPlanets(setPlanets, stellar_systems[selected_stellar_system].name);
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_stellar_system, stellar_systems]);


    
    //puedes crear una función en el ui que se llame no c habilitar info o algo asi
    return (
        <div className="UI jalar-a-derecha">
            <LoadWindow loaded={planetsRef.current.length > 0} />
            <canvas className="topCanvas" ref={topCanvasRef} />
            <ThreeDInterface planets={planets} cameraRef={cameraRef} sceneRef={sceneRef} C={C} D={D} topCanvasRef={infoDivRef} planetsRef={planetsRef} speedUp={speedUp} maxSpeedUp={maxSpeedUp} stellarSystems={stellar_systems} selectedStellarSystem={selected_stellar_system} composerRef={composerRef} />
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
            <Informacion isVisible={visibleInfoBool} info={fixedPlanetData} ref={infoDivRef} />
        </div>  
    );
}

export default UI;