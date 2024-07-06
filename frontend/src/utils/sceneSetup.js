/**
 * @module Utils
 */

import * as THREE from 'three';
import texture from '../assets/backgroundGalaxy.hdr';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Importación de funciones auxiliares para el control de la cámara y el redimensionamiento
import { lookRespectToVectors, movingKeysDown, movingKeysUp, moveCamera } from './camaraControls';
import { handleResize } from './resizeHandler';

// Importación de la función getStellarSphere desde el módulo stellarsFunctions
import { getStellarSphere } from './stellarsFunctions';

/**
 * Inicializa la escena con un conjunto inicial de cubos y luces.
 * @param {THREE.Scene} scene - Objeto de Three.js que representa la escena.
 */
export function initializeScene(scene) {

    // Luz direccional para iluminar los objetos en la escena
    const light = new THREE.DirectionalLight(0xffffff, 2.1);
    light.position.set(0, 0, 1);
    scene.add(light);

    // Luz ambiental para proporcionar iluminación de fondo suave
    const ambientLight = new THREE.AmbientLight(0x404040); // Luz blanca suave
    scene.add(ambientLight);
};

/**
 * Add Stellars
 * 
 * Recieve a scene and add all the stellars to it. Also, add the stellars to the planetsRef array, that is a reference to the planets array in the scene.
 * 
 * @param {THREE.Scene} scene - Scene to add the stellars to.
 * @param {Array<Object>} stellars - Stellar's array to add to the scene.
 * @param {Object} planetsRef - Context reference to the planets array in the scene.
 */
export function addStellars(scene, stellars, planetsRef) {
    stellars.forEach((stellar) => {
        const sphere = getStellarSphere(stellar);
        planetsRef.current.push(sphere);
        scene.add(sphere);
    });
};

/**
 * Start Scene
 * 
 * Start the scene with the given parameters and return a function to clean the event listeners.
 * 
 * @param {Object} canvasRef - Reference to the canvas element.
 * @param {Object} rendererRef - Reference to the renderer object.
 * @param {Object} cameraRef - Reference to the camera object.
 * @param {Object} sceneRef - Reference to the scene object.
 * @param {Object} C - Reference to the vector C.
 * @param {Object} D - Reference to the vector D.
 * @param {Object} moving - Reference to the moving object.
 * @param {Number} speed - Initial speed of the camera.
 * @param {Array<Object>} planets - Array of planets to add to the scene.
 * @param {Object} planetsRef - Reference to the planets array in the scene.
 * @param {Object} speedUp - Reference to the speed up value.
 * @param {Object} speedingUp - Reference to the speeding up value.
 * @param {Number} maxSpeedUp - Maximum speed up value.
 * @returns {Function} - Function to clean the event listeners.
 */
export function startScene(canvasRef, rendererRef, cameraRef, sceneRef, C, D, moving, speed, planets, planetsRef, speedUp, speedingUp, maxSpeedUp) {
    // Iniciar el renderer de Three.js con el canvas
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    rendererRef.current = renderer;

    // Crear una nueva escena de Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Configurar la cámara
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.01, 10000);
    cameraRef.current = camera;

    // Cargar objetos estelares (planetas) en la escena
    addStellars(scene, planets);

    // Inicializar la escena con cubos y luces
    initializeScene(scene);

    // Manejar el redimensionamiento de la ventana
    const onResize = () => handleResize(renderer, camera, canvas);
    window.addEventListener('resize', onResize);
    onResize();

    // Manejar eventos de teclado para el movimiento de la cámara
    window.addEventListener('keydown', (event) => { movingKeysDown(event, moving.current, speedingUp); });
    window.addEventListener('keyup', (event) => { movingKeysUp(event, moving.current, speedingUp); });

    let lastTime = 0;
    let deltaTime = 0;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.15;


    const urlHDR = new URL(texture, window.location.href).href;

    const loader = new RGBELoader();
    loader.load(urlHDR, function (texture) {
        //bajar brill
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    });

    /**
     * Render
     * 
     * Function that makes the main render loop.
     * 
     * @param {Number} time - Time to render
     */
    const render = (time) => {
        if (!canvasRef.current) return;

        deltaTime = time - lastTime;
        lastTime = time;

        // Ajustar la velocidad actual basada en el tiempo y el aumento de velocidad
        if (speedingUp.current) {
            speedUp.current = speedUp.current + (speedUp.current < maxSpeedUp ? 200 * deltaTime / 1000 : 0);
            if (speedUp.current > maxSpeedUp) {
                speedUp.current = maxSpeedUp;
            }
        } else {
            speedUp.current = speedUp.current - (speedUp.current > 0 ? 500 * deltaTime / 1000 : 0);
            if (speedUp.current < 0) {
                speedUp.current = 0;
            }
        }

        // Actualizar la orientación de la cámara según los vectores C y D
        lookRespectToVectors(C.current, D.current, camera);

        // Mover la cámara en función del tiempo, velocidad y aumento de velocidad
        moveCamera(deltaTime / 1000, camera, C.current, D.current, moving.current, speed, speedUp.current);

        // Renderizar la escena utilizando el renderer
        renderer.render(scene, camera);

        // Rotar los planetas en la escena para efectos visuales
        for (let i = 0; i < planetsRef.current.length; i++) {
            planetsRef.current[i].rotation.y += 0.001;
        }

        // Solicitar el próximo frame de animación
        requestAnimationFrame(render);
    };

    // Iniciar el ciclo de renderizado
    render();

    // Devolver una función para limpiar los event listeners al finalizar
    return () => {
        window.removeEventListener('resize', onResize);
    };
};
