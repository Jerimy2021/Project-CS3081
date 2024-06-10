import React from 'react';
import './StellarSystemSelector.css';
import * as THREE from 'three';
import { serverURL } from '../../config/config';

function StellarSystemSelector({stellarSystem, conatinerRef}) {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        if (stellarSystem) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({canvas: canvasRef.current});
            renderer.setSize(conatinerRef.current.clientWidth, conatinerRef.current.clientHeight);
            camera.aspect = conatinerRef.current.clientWidth / conatinerRef.current.clientHeight;
            camera.updateProjectionMatrix();

            //light
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 0, 1);
            scene.add(light);

          
            //ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            
            const geometry = new THREE.SphereGeometry(1.5, 256, 256);
            let stellarSystemTexture = stellarSystem.name;
            let sum = 0;
            for (let i = 0; i < stellarSystemTexture.length; i++) {
                sum += stellarSystemTexture.charCodeAt(i);
            }

            stellarSystemTexture = sum % 10 + 1;

            const textureURL = serverURL + "/static/planet_textures/planet_bk" + stellarSystemTexture + ".png";
            //random
            const texture = new THREE.TextureLoader().load(textureURL);
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                displacementMap: texture,
                displacementScale: 0.1, // Ajusta la escala del desplazamiento según la necesidad
                metalness: 0.3,
                roughness: 0.8,
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            //ad stars
            const starsGeometry = new THREE.SphereGeometry(0.4, 24, 24);
            const starsMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
            
            for (let i = 0; i < 1000; i++) {
                const star = new THREE.Mesh(starsGeometry, starsMaterial);
                const x = (Math.random() - 0.5) * 2000;
                const y = (Math.random() - 0.5) * 2000;
                const z = (Math.random() - 0.5) * 2000;
                star.position.set(x, y, z);
                scene.add(star);
            }


            camera.position.z = 5;

            const animate = () => {
                renderer.render(scene, camera);
                //orbitar la camara alrededor de la esfera
                camera.position.x = 5 * Math.sin(Date.now() * 0.0001);
                camera.position.z = 5 * Math.cos(Date.now() * 0.0001);
                camera.lookAt(sphere.position);

                sphere.rotation.y += 0.001;
                sphere.rotation.x += 0.001;

                requestAnimationFrame(animate);
            }

            animate();


            //eventos de resize
            window.addEventListener('resize', () => {
                camera.aspect = conatinerRef.current.clientWidth / conatinerRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(conatinerRef.current.clientWidth, conatinerRef.current.clientHeight);
            });
        }
        
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stellarSystem]);
    return (
        <canvas ref={canvasRef} className="canvas-stellar-system-selector"></canvas>
    );
}

export default StellarSystemSelector;