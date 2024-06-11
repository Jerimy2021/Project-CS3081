import "./informacion.css";
import React from "react";
import { useState, useEffect } from "react";

function Informacion({isVisible, info}) {
    return (
        isVisible && (
            <div className="informacion">
                <div id="leftInformacion" className="container">
                    <div className="planetName">
                        <h1>{info.name}</h1>
                    </div>
                    <div className="planetData">
                        <label>Radius:</label>
                        <p>{info.planet_radius}</p>
                        <label>Mass:</label>
                        <p>{info.planet_mass}</p>
                        <label>Density:</label>
                        <p>{info.planet_density}</p>
                        <label>Equilibrium temperature:</label>
                        <p>{info.planet_eqt}</p>
                        <label>Transit mid-point:</label>
                        <p>{info.planet_tranmid}</p>
                    </div>
                </div>
                <div id="rightInformacion" className="container">
                    <div className="discoveryData">
                        <label>Discovery year:</label>
                        <p>{info.discovery_year}</p>
                        <label>Discovery method:</label>
                        <p>{info.discovery_method}</p>
                        <label>Discovery reference:</label>
                        <p>{info.discovery_reference}</p>
                        <label>Discovery telescope:</label>
                        <p>{info.discovery_telescope}</p>
                    </div>
                    <div className="stellarData">
                        <label>Host name:</label>
                        <p>{info.host_name}</p>
                        <label>Orbital period:</label>
                        <p>{info.orbital_period}</p>
                        <label>Orbit semi-major axis:</label>
                        <p>{info.orbit_semi_major_axis}</p>
                        <label>Stellar luminosity:</label>
                        <p>{info.stellar_lum}</p>
                        <label>Stellar age:</label>
                        <p>{info.stellar_age}</p>
                        <label>Stellar mass:</label>
                        <p>{info.stellar_mass}</p>
                    </div>
                </div>
            </div>
        )
    );
}

export default Informacion;