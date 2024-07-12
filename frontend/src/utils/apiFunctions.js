/**
 * @module Utils
 */

import { serverURL } from '../config/config';

/**
 * Get Planets
 * 
 * The function gets the planets of a stellar system from the backend and set them in the state.
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
            console.log(error);
        });
}

/**
 * Gets Stellar Systems
 * 
 * The function Gets the stellar systems from the backend. When it succeedd the solar system is added as the first element of the list and saved in the local storage.
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
            console.log(error);
        });
    
    // Establecer la lista de sistemas estelares como vacía temporalmente
    setStellarSystems([]);
}

