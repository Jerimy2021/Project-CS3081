/**
 * @module Utils
 */


/**
 * Adapt planet Data
 * 
 * The function adapts the data from the API to a convenient format.
 * 
 * @param {Object} apiData - The data from the API.
 * 
 */
export const adaptPlanetData = (apiData) => {
    return {
        name: apiData.name,
        planet_radius: `${apiData.radius_earth} Earth Radius`, // Radio del planeta en unidades de radio terrestre
        planet_mass: `${apiData.planet_mass} Earth Mass`, // Masa del planeta en unidades de masa terrestre
        planet_density: `${apiData.planet_density} g/cm³`, // Densidad del planeta en gramos por centímetro cúbico
        planet_eqt: `${apiData.planet_eqt} K`, // Temperatura de equilibrio del planeta en Kelvin
        planet_tranmid: `${apiData.planet_tranmid} days`, // Periodo de tránsito medio del planeta en días
        discovery_year: apiData.discovery_year, // Año de descubrimiento del planeta
        discovery_method: apiData.discovery_method, // Método de descubrimiento del planeta
        discovery_reference: apiData.discovery_reference, // Referencia del descubrimiento del planeta
        discovery_telescope: apiData.discovery_telescope, // Telescopio utilizado en el descubrimiento del planeta
        host_name: apiData.host_name, // Nombre de la estrella anfitriona del planeta
        orbital_period: `${apiData.orbital_period} days`, // Periodo orbital del planeta en días
        orbit_semi_major_axis: `${apiData.orbsmax} AU`, // Semi-eje mayor orbital del planeta en unidades astronómicas (AU)
        stellar_lum: `${apiData.stellar_lum} log10(Solar)`, // Luminosidad de la estrella anfitriona en logaritmo base 10 de unidades solares
        stellar_age: `${apiData.stellar_age} Gyr`, // Edad de la estrella anfitriona en miles de millones de años (Gyr)
        stellar_mass: `${apiData.stellar_mass} Solar Mass` // Masa de la estrella anfitriona en masas solares
    };
}
