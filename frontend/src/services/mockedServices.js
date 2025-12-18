/**
 * @module Services
 * 
 * Servicios mockeados para funcionar sin backend.
 * Retorna datos del sistema solar de forma estática.
 */

import solarSystemData from './solarSystemData.json';

/**
 * Get Planets (Mocked)
 * 
 * Retorna los planetas del sistema solar mockeados.
 * 
 * @param {string} stellarSystem - Nombre del sistema estelar
 * @returns {Promise} - Promesa con los datos de los planetas
 */
export function getMockedPlanets(stellarSystem) {
    return new Promise((resolve) => {
        // Simular delay de red
        setTimeout(() => {
            if (stellarSystem.toLowerCase() === 'sun' || stellarSystem.toLowerCase() === 'sol') {
                resolve({
                    success: true,
                    data: solarSystemData
                });
            } else {
                resolve({
                    success: false,
                    message: 'Solo el sistema solar está disponible en modo offline'
                });
            }
        }, 100);
    });
}

/**
 * Get Stellar Systems (Mocked)
 * 
 * Retorna solo el sistema solar en la lista de sistemas estelares.
 * 
 * @returns {Promise} - Promesa con la lista de sistemas estelares
 */
export function getMockedStellarSystems() {
    return new Promise((resolve) => {
        // Simular delay de red
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    stellar_systems: [
                        {
                            name: solarSystemData.name,
                            num_planets: solarSystemData.num_planets,
                            star: solarSystemData.star,
                            radius: solarSystemData.radius,
                            coordinates: solarSystemData.coordinates,
                            textures: solarSystemData.textures
                        }
                    ]
                }
            });
        }, 100);
    });
}
