/**
 * @module Components
 */
import React from 'react';
import './StellarSystemSelector.css';
import * as THREE from 'three';
import { serverURL } from '../../config/config';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import backgroundImage from '../../assets/backgroundGalaxy.hdr';

import { 
    EffectComposer, 
    EffectPass, 
    RenderPass, 
    GodRaysEffect 
} from "postprocessing";



/**
 * Stellar System Selector
 * 
 * The Stellar System Selector component is a canvas that shows a 3D representation of a stellar system.
 * 
 * @param {Object} props - The props of the component.
 * @param {Object} props.stellarSystem - The stellar system object to show.
 * @param {Object} props.conatinerRef - The reference to the container div.
 * 
 * @returns {JSX.Element} The StellarSystemSelector component
 */
function StellarSystemSelector({ stellarSystem, conatinerRef }) {
    const canvasRef = React.useRef(null);
    const sceneRef = React.useRef(null);
    const cameraRef = React.useRef(null);
    const rendererRef = React.useRef(null);
    const planetRef = React.useRef(null);
    const dodecaedroRef = React.useRef(null);
    const animationIdRef = React.useRef(null);
    const composerRef = React.useRef(null);
    const godraysRef = React.useRef(null);
    const passesList = React.useRef(null);

    React.useEffect(() => {
        if (stellarSystem) {
            if (!sceneRef.current) {
                // Configuración inicial solo si la escena no existe aún
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

                renderer.setSize(conatinerRef.current.clientWidth, conatinerRef.current.clientHeight);
                camera.aspect = conatinerRef.current.clientWidth / conatinerRef.current.clientHeight;
                camera.updateProjectionMatrix();

                // Luces
                const light = new THREE.DirectionalLight(0xffffff, 0.3);
                light.position.set(0, 0, 1);
                scene.add(light);

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
                scene.add(ambientLight);



                camera.position.z = 5;

                sceneRef.current = scene;
                cameraRef.current = camera;
                rendererRef.current = renderer;

                //background
                const loaderHDR = new RGBELoader();
                loaderHDR.load(backgroundImage, (texture) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    scene.background = texture;

            
                });

                // Postprocessing
                const composer = new EffectComposer(renderer);

                composerRef.current = composer;

                const renderPass = new RenderPass(scene, camera);
                passesList.current = [renderPass];


                passesList.current.forEach((pass) => {
                    composer.addPass(pass);
                });


            }

            // Crear o actualizar el planeta
            if (planetRef.current) {
                sceneRef.current.remove(planetRef.current); // Remover el planeta antiguo
            }

            if (dodecaedroRef.current) {
                sceneRef.current.remove(dodecaedroRef.current); // Remover el dodecaedro antiguo
            }

            if (godraysRef.current) {
                composerRef.current.removeAllPasses();
                
                passesList.current.forEach((pass) => {
                    composerRef.current.addPass(pass);
                });
            }



            const geometry = new THREE.SphereGeometry(1.5, 256, 256);
            

            console.log(stellarSystem)
            let textureURL = serverURL + stellarSystem.textures.diffuse;

            const texture = new THREE.TextureLoader().load(textureURL);
            

            const material = new THREE.MeshStandardMaterial({
                map: texture,
                displacementMap: texture,
                displacementScale: 0.1,
                metalness: 0.3,
                roughness: 0.8,
                emissiveMap: texture,
                emissive: stellarSystem.name === "Sun" ? new THREE.Color(0xffeeee) : new THREE.Color(0xffffff),
                emissiveIntensity: stellarSystem.name === "Sun" ? 1 : 0.8,
                envMapIntensity: 0.5,
            });


            const sphere = new THREE.Mesh(geometry, material);

            godraysRef.current = new GodRaysEffect(cameraRef.current, sphere, {
                resolutionScale: 0.5,
                density: 0.66,
                decay: 0.92,
                weight: 0.3,
                samples: 60,
                lightColor: new THREE.Color(0xffee00),
            });


            composerRef.current.addPass(new EffectPass(cameraRef.current, godraysRef.current));
        
           
            const sphere2 = new THREE.Mesh(geometry, material);
            sceneRef.current.add(sphere2);
            planetRef.current = sphere2;


            //dodecaedro rodeando el planeta

            const geometryWireframe = new THREE.DodecahedronGeometry(sphere.geometry.parameters.radius * 1.5, 0);
            const materialWireframe = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true});
            const wireframe = new THREE.Mesh(geometryWireframe, materialWireframe);

            //color de lineas del wireframe
            wireframe.material.color.setHex(0xffffff);
            wireframe.material.transparent = true;
            wireframe.material.opacity = 0.15;
            wireframe.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
            wireframe.rotateZ(Math.random() * Math.PI);
            wireframe.rotateY(Math.random() * Math.PI);
            wireframe.rotateX(Math.random() * Math.PI);

            dodecaedroRef.current = wireframe;
            sceneRef.current.add(wireframe);



            const animate = () => {
                if (!conatinerRef.current) return;

                composerRef.current.render();
                
                // Orbitación de la cámara alrededor de la esfera
                cameraRef.current.position.x = 5 * Math.sin(Date.now() * 0.0001);
                cameraRef.current.position.z = 5 * Math.cos(Date.now() * 0.0001);
                cameraRef.current.lookAt(sphere.position);

                sphere.rotation.y += 0.001;
                sphere.rotation.x += 0.001;

                animationIdRef.current = requestAnimationFrame(animate);
            };

            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }

            animate();

            // Manejar el redimensionamiento de la ventana
            const handleResize = () => {
                if (!conatinerRef.current) return;
                cameraRef.current.aspect = conatinerRef.current.clientWidth / conatinerRef.current.clientHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(conatinerRef.current.clientWidth, conatinerRef.current.clientHeight);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (animationIdRef.current) {
                    cancelAnimationFrame(animationIdRef.current);
                }
            };
        }
    }, [stellarSystem, conatinerRef]);

    return (
        <canvas ref={canvasRef} className="canvas-stellar-system-selector"></canvas>
    );
}

export default StellarSystemSelector;
