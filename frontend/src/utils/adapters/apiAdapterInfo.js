export const adaptPlanetData = (apiData) => {
    return {
        name: apiData.name,
        planet_radius: `${apiData.radius_earth} Earth Radius`, // Asumiendo que "radius_earth" es la medida correcta
        planet_mass: `${apiData.planet_mass} Earth Mass`, // Puedes ajustar la unidad si es necesario
        planet_density: `${apiData.planet_density} g/cm³`,
        planet_eqt: `${apiData.planet_eqt} K`,
        planet_tranmid: `${apiData.planet_tranmid} days`, // Puedes ajustar la unidad si es necesario
        discovery_year: apiData.discovery_year,
        discovery_method: apiData.discovery_method,
        discovery_reference: apiData.discovery_reference,
        discovery_telescope: apiData.discovery_telescope,
        host_name: apiData.host_name,
        orbital_period: `${apiData.orbital_period} days`,
        orbit_semi_major_axis: `${apiData.orbsmax} AU`, // Asumiendo que "orbsmax" está en AU
        stellar_lum: `${apiData.stellar_lum} log10(Solar)`, // Ajusta la unidad si es necesario
        stellar_age: `${apiData.stellar_age} Gyr`, // Ajusta la unidad si es necesario
        stellar_mass: `${apiData.stellar_mass} Solar Mass` // Ajusta la unidad si es necesario
    };
}