import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { initializeScene } from '../utils/sceneSetup';
import { handleResize } from '../utils/resizeHandler';
import { usePointerLock } from '../hooks/usePointerLock';
import { moveCamera, lookRespectToVectors } from '../utils/camaraControls'
import { movingKeysDown, movingKeysUp } from '../utils/camaraControls';

import '../components/ThreeDInterface.css';

const ThreeDInterface = () => {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const sceneRef = useRef(null);
    const C = useRef(new THREE.Vector3(1, 0, 0)); // Camera direction
    const D = useRef(new THREE.Vector3(0, 0, -1)); // Camera right direction
    let moving = useRef({ 
        forward: false, 
        backward: false, 
        left: false,
        right: false,
        up: false,
        down: false 
    });
    const speed = 0.1;
    let lastTime = useRef(0);

    usePointerLock(canvasRef, C, D, moving);

    useEffect(() => {
        const canvas = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas });
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
        cameraRef.current = camera;

        initializeScene(scene);

        const onResize = () => handleResize(renderer, camera);
        window.addEventListener('resize', onResize);
        onResize();

        window.addEventListener('keydown', (event) => { movingKeysDown(event, moving.current); });
        window.addEventListener('keyup', (event) => { movingKeysUp(event, moving.current); });

        const render = (time) => {
            time *= 0.001; // Convert to seconds
            const deltaTime = time - lastTime.current;
            lastTime.current = time;

            
            lookRespectToVectors(C.current, D.current, camera);

            moveCamera(1, camera, C.current, D.current, moving.current, speed);

            renderer.render(scene, camera);


            requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas ref={canvasRef} />
    );
};

export default ThreeDInterface;
