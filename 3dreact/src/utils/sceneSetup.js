import * as THREE from 'three';

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


export const addStellars = (scene, stellars) => {
    stellars.current.forEach((stellar) => {
        const sphere = getStellarSphere(stellar);
        scene.add(sphere);
    });
}
