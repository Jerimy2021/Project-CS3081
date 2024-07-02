/**
 * @module Utils
 */

import * as THREE from 'three';
import { serverURL } from '../config/config';

/**
 * Get Stellar Sphere
 * 
 * The function creates a sphere object (a Mesh of Three.js) with the properties of the stellar object.
 * 
 * @param {object} stellar - Stellar object with the properties of the sphere.
 * @returns {THREE.Mesh} - The sphere object created.
 */
export function getStellarSphere(stellar) {
    let radius = stellar.radius; // Radio de la esfera
    // Convertir radio a float
    radius = parseFloat(radius) * 1000;

    // Crear geometría de la esfera
    const geometry = new THREE.SphereGeometry(radius / 100, 128, 128);

    // Cargar textura desde la URL del servidor
    const texture = new THREE.TextureLoader().load(serverURL + stellar.textures.diffuse);

    // Configurar material estándar con textura y desplazamiento
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        displacementMap: texture, // Utiliza la misma textura para el desplazamiento
        displacementScale: radius / 1500, // Escala del desplazamiento ajustada
        metalness: 0.3,
        roughness: 0.8,
    });

    // Crear objeto Mesh de Three.js para la esfera
    const sphere = new THREE.Mesh(geometry, material);

    // Asignar datos del planeta a la esfera
    sphere.planet_data = stellar;

    // Establecer la posición de la esfera según las coordenadas del objeto estelar
    sphere.position.set(stellar.coordinates.x, stellar.coordinates.y, stellar.coordinates.z);

    return sphere;
}
