import { serverURL } from '../config/config';

export const getPlanets = (setPlanets, stellarSystem) => {
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


export const getStellarSystems = (setStellarSystems) => {
    const url = `${serverURL}/stellar_systems`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setStellarSystems(data.data.stellar_systems);
            } else {
                console.log(data.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
    
    setStellarSystems([]);
}