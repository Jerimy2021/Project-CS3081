import * as THREE from 'three';
import { serverURL } from '../config/config';

export const getStellarSphere = (stellar) => {
    let radius = stellar.radius; // Radius of the sphere
    //convertir radio a float
    radius = parseFloat(radius)*1000;
    const geometry = new THREE.SphereGeometry(radius/100, 128, 128);
    const texture = new THREE.TextureLoader().load(serverURL + stellar.textures.diffuse);
    const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        displacementMap: texture,
        displacementScale: radius / 1500, // Ajusta la escala del desplazamiento según la necesidad
        metalness: 0.3,
        roughness: 0.8,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.planet_data = stellar;
    sphere.position.set(stellar.coordinates.x, stellar.coordinates.y, stellar.coordinates.z);
    return sphere;
}