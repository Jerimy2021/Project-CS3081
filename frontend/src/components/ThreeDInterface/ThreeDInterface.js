/**
 * @module Components
 */
import React, { useRef, useEffect } from 'react';


import { initializeScene, loadHost, startScene } from '../../utils/sceneSetup';
import { usePointerLock } from '../../hooks/usePointerLock';
import { addStellars } from '../../utils/sceneSetup';
import '../ThreeDInterface/ThreeDInterface.css';

/**
 * ThreeDInterface
 * 
 * The ThreeDInterface component is a canvas that shows a 3D representation of a stellar system.
 * 
 * @param {Object} props - The props of the component.
 * @param {Array} props.planets - The planets to show.
 * @param {Object} props.cameraRef - The reference to the camera object.
 * @param {Object} props.sceneRef - The reference to the scene object.
 * @param {Object} props.C - The reference to the vector C.
 * @param {Object} props.D - The reference to the vector D.
 * @param {Object} props.topCanvasRef - The reference to the top canvas element.
 * @param {Object} props.planetsRef - The reference to the planets array in the scene.
 * @param {Object} props.speedUp - The reference to the speed up object.
 * @param {number} props.maxSpeedUp - The maximum speed up value.
 * 
 * @returns {JSX.Element} The ThreeDInterface component
 * 
    */  
function ThreeDInterface({ planets, cameraRef, sceneRef, C, D, topCanvasRef, planetsRef, speedUp, maxSpeedUp, stellarSystems, selectedStellarSystem, composerRef }) {
    // Refs
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const moving = useRef({ 
        forward: false, 
        backward: false, 
        left: false,
        right: false,
        up: false,
        down: false 
    });
    const speed = 0.05*1000;

    const speedingUp = useRef(false);


    // Pointer lock
    usePointerLock(topCanvasRef, C, D, moving);

    // Initialize scene
    useEffect(() => {
        startScene(canvasRef, rendererRef, cameraRef, sceneRef, C, D, moving, speed, planets, planetsRef, speedUp, speedingUp, maxSpeedUp, composerRef, stellarSystems, selectedStellarSystem);
    
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(planets)
        console.log(stellarSystems)
        console.log(selectedStellarSystem)
        if (sceneRef.current && cameraRef.current && composerRef.current && rendererRef.current && stellarSystems.length > 0) {
            sceneRef.current.children = []; //vaciar la escena
            planetsRef.current = []; //vaciar los planetas
            initializeScene(sceneRef.current); //inicializar la escena de nuevo
            addStellars(sceneRef.current, planets, planetsRef, composerRef.current, cameraRef.current); //añadir los planetas
            loadHost(sceneRef, planetsRef, composerRef, cameraRef, stellarSystems, selectedStellarSystem);
        }

        // press F after loaded
        setTimeout(() => {
            const event = new KeyboardEvent('keydown', { key: 'f' });
            window.dispatchEvent(event);
        }, 500);
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planets]);

    return (
        <canvas ref={canvasRef} />
    );
};

export default ThreeDInterface;
