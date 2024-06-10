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
                const solar_system = {
                    name: "Sun",
                    num_planets: 8, //(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune)
                }
                //insertar primer elemento
                data.data.stellar_systems.unshift(solar_system);
                setStellarSystems(data.data.stellar_systems);
                
                //guardar en local storage
                localStorage.setItem('stellarSystems', JSON.stringify(data.data.stellar_systems));
            } else {
                console.log(data.message);
            }
        })
        .catch(error => {
            console.log(error);
        });
    
    setStellarSystems([]);
}