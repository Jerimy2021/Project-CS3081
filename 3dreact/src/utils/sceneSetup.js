import * as THREE from 'three';

export const initializeScene = (scene) => {
    // Crear puntos
    const n = 10000;
    const geometry = new THREE.SphereGeometry(0.5, 5, 5);
    for (let i = 0; i < n; i++) {
        let color = Math.random() * 0xffffff;
        const material = new THREE.MeshBasicMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, material);
        // Random position
        cube.position.x = Math.random() * 1000 - 500;
        cube.position.y = Math.random() * 1000 - 500;
        cube.position.z = Math.random() * 1000 - 500;
        scene.add(cube);
    }

};
