/**
 * @module Utils
 */

import { serverURL } from '../config/config';
import { getMockedPlanets, getMockedStellarSystems } from '../services/mockedServices';

/**
 * Get Planets
 * 
 * The function gets the planets of a stellar system from the backend and set them in the state.
 * If backend is not available, uses mocked data for Solar System.
 *
 * @param {function} setPlanets - Function to set the list of planets obtained.
 * @param {string} stellarSystem - Name of the stellar system to get the planets from.
 * @returns {void}
 */
export function getPlanets(setPlanets, stellarSystem) {
    const url = `${serverURL}/stellar_systems/${stellarSystem}/planets`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setPlanets(data.data.planets);
            } else {
                console.log(data.message);
            }
        })
        .catch(error => {
            console.log('Backend no disponible, usando datos mockeados:', error);
            // Fallback a datos mockeados si el backend no responde
            getMockedPlanets(stellarSystem)
                .then(data => {
                    if (data.success) {
                        setPlanets(data.data.planets);
                    } else {
                        console.log(data.message);
                    }
                });
        });
}

/**
 * Gets Stellar Systems
 * 
 * The function Gets the stellar systems from the backend. When it succeeds the solar system is added as the first element of the list and saved in the local storage.
 * If backend is not available, returns only the Solar System.
 * 
 * @param {function} setStellarSystems - Function to set the list of stellar systems obtained.
 * @returns {void}
 */
export function getStellarSystems(setStellarSystems) {
    const url = `${serverURL}/stellar_systems`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setStellarSystems(data.data.stellar_systems);
                
                // Guardar en el almacenamiento local
                localStorage.setItem('stellarSystems', JSON.stringify(data.data.stellar_systems));
            } else {
                console.log(data.message);
            }
        })
        .catch(error => {
            console.log('Backend no disponible, usando datos mockeados:', error);
            // Fallback a datos mockeados si el backend no responde
            getMockedStellarSystems()
                .then(data => {
                    if (data.success) {
                        setStellarSystems(data.data.stellar_systems);
                        
                        // Guardar en el almacenamiento local
                        localStorage.setItem('stellarSystems', JSON.stringify(data.data.stellar_systems));
                    }
                });
        });
    
    // Establecer la lista de sistemas estelares como vacía temporalmente
    setStellarSystems([]);
}

