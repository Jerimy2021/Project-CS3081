/**
 * @module Utils
 */

import * as THREE from 'three';
import texture from '../assets/backgroundGalaxy.hdr';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { 
    EffectComposer, 
    EffectPass, 
    RenderPass, 
    GodRaysEffect 
} from "postprocessing";

import { serverURL } from '../config/config';


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
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-1, 1, 1);
    scene.add(light);

    // Luz ambiental para proporcionar iluminación de fondo suave
    const ambientLight = new THREE.AmbientLight(0x404040); // Luz blanca suave
    ambientLight.intensity = 4;
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
export function addStellars(scene, stellars, planetsRef, composer, cameraRef) {
    stellars.forEach((stellar) => {
        const sphere = getStellarSphere(stellar);

        //añadir un dodecaedro rodeando el planeta
        const geometry = new THREE.DodecahedronGeometry(sphere.geometry.parameters.radius * 1.5, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true});
        const wireframe = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        if (!stellar.star || stellar.star !== true) {
            //color de lineas del wireframe
            wireframe.material.color.setHex(0xffffff);
            wireframe.material.transparent = true;
            wireframe.material.opacity = 0.01;
            wireframe.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
            scene.add(wireframe);
        }


        //añadir god ray effect al composer
        if (stellar.star && stellar.star === true) {
            const godRaysEffect = new GodRaysEffect(cameraRef, sphere, {
                resolutionScale: 0.5,
                density: 0.96,
                decay: 0.93,
                weight: 0.3,
                samples: 60
            });

            const effectPassGodRays = new EffectPass(cameraRef, godRaysEffect);
            composer.addPass(effectPassGodRays);

            console.log('God rays added');
        }
        //añadir polvo alrededor 
        const polvoGeometry = new THREE.SphereGeometry(0.01*sphere.geometry.parameters.radius, 32, 32);
        const polvoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        polvoMaterial.transparent = true;
        polvoMaterial.opacity = 0.4;

        const polvoList = [];

        let amountParticles = sphere.geometry.parameters.radius * 30 * 1.3;

        if (amountParticles > 1000) {
            amountParticles = 1000;
        }

        if (stellar.star && stellar.star === true) {
            amountParticles = 0;
        }
        
        for (let i = 0; i < amountParticles; i++) {
            const polvo = new THREE.Mesh(polvoGeometry, polvoMaterial);
            const dx = Math.random() * 2 - 1;
            const dy = Math.random() * 2 - 1;
            const dz = Math.random() * 2 - 1;

            polvo.position.set(sphere.position.x + dx*sphere.geometry.parameters.radius*20,
                sphere.position.y + dy*sphere.geometry.parameters.radius*20,
                sphere.position.z + dz*sphere.geometry.parameters.radius*20);

            scene.add(polvo);
            polvoList.push({
                mesh: polvo,
                direction: new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                )
            });
        }

        //mover polvo alrededor del planeta// orbitar
        const speed = 0.003;
        let deltaTime = 0;
        let lastTime = 0;

        const animatePolvo = () => {
            deltaTime = Date.now() - lastTime;
            lastTime = Date.now();

            polvoList.forEach((polvo) => {
                polvo.mesh.position.x += polvo.direction.x * speed * deltaTime * sphere.geometry.parameters.radius / 5;
                polvo.mesh.position.y += polvo.direction.y * speed * deltaTime * sphere.geometry.parameters.radius / 5;
                polvo.mesh.position.z += polvo.direction.z * speed * deltaTime * sphere.geometry.parameters.radius / 5;

                const distance = polvo.mesh.position.distanceTo(sphere.position);

                //si se sale del maximo teletransportar
                if (distance > sphere.geometry.parameters.radius*20) {
                    const dx = Math.random() * 2 - 1;
                    const dy = Math.random() * 2 - 1;
                    const dz = Math.random() * 2 - 1;

                    polvo.mesh.position.set(sphere.position.x + dx*sphere.geometry.parameters.radius*20,
                        sphere.position.y + dy*sphere.geometry.parameters.radius*20,
                        sphere.position.z + dz*sphere.geometry.parameters.radius*20);

                    polvo.direction.set(
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1
                    );
                }
            });
        };

        setInterval(animatePolvo, 1000 / 60);

        
        planetsRef.current.push(sphere);
    });
};



export function loadHost(sceneRef, planetsRef, composerRef, cameraRef, stellar_systems, selected_stellar_system) {
    const host = stellar_systems[selected_stellar_system];
    console.log('Selected stellar system:', selected_stellar_system);
    console.log('Stellar systems:', stellar_systems);
    console.log('Host:', host);

    const textureUrl = serverURL + host.textures.diffuse;
    const texture = new THREE.TextureLoader().load(textureUrl);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        displacementMap: texture,
        displacementScale: 0.1,
        metalness: 0.3,
        roughness: 0.8,
        emissiveMap: texture,
        emissive: host.name === "Sun" ? new THREE.Color(0xffeeee) : new THREE.Color(0xffffff),
        emissiveIntensity: 0.5,
        envMapIntensity: 0.5,
    });

    const geometry = new THREE.SphereGeometry(host.radius, 64, 64);


    const hostSphere = new THREE.Mesh(geometry, material);

    sceneRef.current.add(hostSphere);


    // //añadir god ray effect al composer
    const godRaysEffect = new GodRaysEffect(cameraRef.current, hostSphere, {
        resolutionScale: 0.5,
        density: 0.96,
        decay: 0.93,
        weight: 0.3,
        samples: 60
    });

    const effectPassGodRays = new EffectPass(cameraRef, godRaysEffect);
    composerRef.current.addPass(effectPassGodRays);

    console.log('God rays added: HOST');

    planetsRef.current.push(hostSphere);
}



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
export function startScene(canvasRef, rendererRef, cameraRef, sceneRef, C, D, moving, speed, planets, planetsRef, speedUp, speedingUp, maxSpeedUp, composerRef, stellar_systems, selected_stellar_system) {
    // Iniciar el renderer de Three.js con el canvas
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    rendererRef.current = renderer;

    // Crear una nueva escena de Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Configurar la cámara
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.01, -1);
    camera.position.set(-1, 0, 0);
    cameraRef.current = camera;


    //bloom effect
    const renderScene = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composerRef.current = composer;
    

    // Cargar objetos estelares (planetas) en la escena
    addStellars(scene, planets, planetsRef, composer, camera);

    // Inicializar la escena con cubos y luces
    initializeScene(scene);

    // Manejar el redimensionamiento de la ventana
    const onResize = () => handleResize(renderer, camera, canvas, composer);
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
        scene.environment = texture;
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

        // Renderizar la escena
        //renderer.render(scene, camera);
        composer.render();

        // Rotar los planetas en la escena para efectos visuales
        for (let i = 0; i < planetsRef.current.length; i++) {
            planetsRef.current[i].rotation.y += 0.004;
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
