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
    const geometry = new THREE.SphereGeometry(radius / 100, 64, 64);

    // Cargar textura desde la URL del servidor
    const texture = new THREE.TextureLoader().load(serverURL + stellar.textures.diffuse);

    let textureEmmisive = null;

    const emmisivevBool = stellar.textures.emmisive && stellar.textures.emissive !== "";

    if (emmisivevBool) {
        textureEmmisive = new THREE.TextureLoader().load(serverURL + stellar.textures.emissive);
    }

    // Configurar material estándar con textura y desplazamiento
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        displacementMap: texture, // Utiliza la misma textura para el desplazamiento
        displacementScale: radius / 1500, // Escala del desplazamiento ajustada
        metalness: 0.3,
        roughness: 0.8,
        color: isFromSolarSystem() ? 0xffffff : calculateColor(stellar),
        emissiveMap: emmisivevBool ? textureEmmisive : texture,
        emissive: (emmisivevBool || (stellar.star && stellar.star === true)) ? new THREE.Color(0xffffff) : new THREE.Color(0x000000),
        emissiveIntensity: (emmisivevBool || (stellar.star && stellar.star === true)) ? 0.60 : 0,
        envMapIntensity: 0.5,
    });

    // Crear objeto Mesh de Three.js para la esfera
    const sphere = new THREE.Mesh(geometry, material);

    // Asignar datos del planeta a la esfera
    sphere.planet_data = stellar;

    // Establecer la posición de la esfera según las coordenadas del objeto estelar
    sphere.position.set(stellar.coordinates.x, stellar.coordinates.y, stellar.coordinates.z);

    return sphere;
}




/**
 * Calculate Color
 * 
 * The function calculates the color of the sphere based on the properties of the stellar object.
 * 
 * @param {object} stellar - Stellar object with the properties of the sphere.
 * @returns {number} - The hexadecimal color of the sphere.
 */
export function calculateColor(stellar) {
    let hash = 0;
    for (let i = 0; i < stellar.name.length; i++) {
        hash = stellar.name.charCodeAt(i)*i*43/7 + hash;
    }

    let color = Math.abs(hash) % 0xffffff;
    return 0xaaaaaa + color > 0xffffff ? 0xffffff : 0xaaaaaa + color;
}


function isFromSolarSystem() {
    //obtener localsolarSystem
    let localSolarSystem = localStorage.getItem('selectedStellarSystem');  
    localSolarSystem = parseInt(localSolarSystem);
    return localSolarSystem === 0; 
}