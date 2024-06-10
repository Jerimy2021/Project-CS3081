import React, { useRef, useEffect } from 'react';


import { initializeScene, startScene } from '../../utils/sceneSetup';
import { usePointerLock } from '../../hooks/usePointerLock';
import { addStellars } from '../../utils/sceneSetup';


import '../ThreeDInterface/ThreeDInterface.css';

const ThreeDInterface = ({ planets, cameraRef, sceneRef, C, D, topCanvasRef }) => {
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
    const speed = 2;


    // Pointer lock
    usePointerLock(topCanvasRef, C, D, moving);

    // Initialize scene
    useEffect(() => {
        startScene(canvasRef, rendererRef, cameraRef, sceneRef, C, D, moving, speed, planets);
    
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (sceneRef.current) { //null
            sceneRef.current.children = []; //vaciar la escena
            initializeScene(sceneRef.current); //inicializar la escena de nuevo
            addStellars(sceneRef.current, planets); //añadir los planetas
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planets]);

    return (
        <canvas ref={canvasRef} />
    );
};

export default ThreeDInterface;
