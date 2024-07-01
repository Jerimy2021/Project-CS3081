import * as THREE from 'three';

import { lookRespectToVectors, movingKeysDown, movingKeysUp, moveCamera } from './camaraControls';
import { handleResize } from './resizeHandler';

import { getStellarSphere } from './stellarsFunctions';

export const initializeScene = (scene) => {
    // Crear puntos
    const n = 10000;
    const geometry = new THREE.SphereGeometry(3, 5, 5);
    const distance = 7000;
    for (let i = 0; i < n; i++) {
        let color = Math.random() * 0xff;
        color = (color << 16) | (color << 8) | color;
        const material = new THREE.MeshBasicMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, material);
        // Random position
        cube.position.x = Math.random() * distance * 2 - distance;
        cube.position.y = Math.random() * distance * 2 - distance;
        cube.position.z = Math.random() * distance * 2 - distance;
        scene.add(cube);
    }


    //light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

};


export const addStellars = (scene, stellars, planetsRef) => {
    stellars.forEach((stellar) => {
        const sphere = getStellarSphere(stellar);
        planetsRef.current.push(sphere);
        scene.add(sphere);
    });
}



export const startScene = (canvasRef, rendererRef, cameraRef, sceneRef, C, D, moving, speed, planets, planetsRef, speedUp, speedingUp, maxSpeedUp) => {
    // Start the scene
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.01, 10000);
    cameraRef.current = camera;

    // Load stellars
    addStellars(scene, planets);

    // Initialize scene
    initializeScene(scene);

    // Resize
    const onResize = () => handleResize(renderer, camera, canvas);
    window.addEventListener('resize', onResize);
    onResize();

    // Camera movement
    window.addEventListener('keydown', (event) => { movingKeysDown(event, moving.current, speedingUp); });
    window.addEventListener('keyup', (event) => { movingKeysUp(event, moving.current, speedingUp); });

    let lastTime = 0;
    let deltaTime = 0;


    // Render
    const render = (time) => {
        if (!canvasRef.current) return;

        deltaTime = time - lastTime;
        lastTime = time;
        console.log(speedUp.current);

        if (speedingUp.current) {
            speedUp.current = speedUp.current + (speedUp.current < maxSpeedUp ? 200*deltaTime/1000 : 0);
            if (speedUp.current > maxSpeedUp) {
                speedUp.current = maxSpeedUp;
            }
        } else {
            speedUp.current = speedUp.current - (speedUp.current > 0 ? 500*deltaTime/1000 : 0);
            if (speedUp.current < 0) {
                speedUp.current = 0;
            }
        }

        lookRespectToVectors(C.current, D.current, camera);
        moveCamera(deltaTime/1000, camera, C.current, D.current, moving.current, speed, speedUp.current);
        renderer.render(scene, camera);

        //rotar los planetas
        for (let i = 0; i < planetsRef.current.length; i++) {
            planetsRef.current[i].rotation.y += 0.001;
        }


        requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('resize', onResize);
    };
}