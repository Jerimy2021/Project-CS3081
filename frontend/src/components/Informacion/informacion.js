/**
    * @module Components 
 */

import "./informacion.css";
import React from "react";

import { adaptPlanetData } from "../../utils/adapters/apiAdapterInfo";

/**
 * Informacion
 * 
 * This component is the information panel that shows the data of a planet when the user is on focuss mode.
 * 
 * @param {Object} props - The props of the component.
 * @param {boolean} props.isVisible - The boolean that indicates if the information panel is visible.
 * @param {Object} props.info - The information of the planet.
 * @param {Object} props.infoDivRef - The reference to the information panel div.
 * 
 * @returns {JSX.Element} The Informacion component
 * 
 */
function Informacion({isVisible, info, infoDivRef}) {
    const [data, setData] = React.useState({});

    React.useEffect(() => {
        setData(adaptPlanetData(info));
    }, [info]);
    return (
        isVisible && (
            <div className="informacion" ref={infoDivRef}>
                <div id="leftInformacion" className="container">
                    <div className="planetName">
                        <h1>{data.name}</h1>
                    </div>
                    <div className="planetData">
                        <label>Radius:</label>
                        <p>{data.planet_radius}</p>
                        <label>Mass:</label>
                        <p>{data.planet_mass}</p>
                        <label>Density:</label>
                        <p>{data.planet_density}</p>
                        <label>Equilibrium temperature:</label>
                        <p>{data.planet_eqt}</p>
                        <label>Transit mid-point:</label>
                        <p>{data.planet_tranmid}</p>
                    </div>
                </div>
                <div id="rightInformacion" className="container">
                    <div className="discovery-stellar-data">
                        <label>Discovery year:</label>
                        <p>{data.discovery_year}</p>
                        <label>Discovery method:</label>
                        <p>{data.discovery_method}</p>
                        <label>Discovery reference:</label>
                        <a
                        href={data.discovery_reference}
                        target="_blank"
                        > click here to see the reference</a>
                        <label>Discovery telescope:</label>
                        <p>{data.discovery_telescope}</p>
                        <label>Host name:</label>
                        <p>{data.host_name}</p>
                        <label>Orbital period:</label>
                        <p>{data.orbital_period}</p>
                        <label>Orbit semi-major axis:</label>
                        <p>{data.orbit_semi_major_axis}</p>
                        <label>Stellar luminosity:</label>
                        <p>{data.stellar_lum}</p>
                        <label>Stellar age:</label>
                        <p>{data.stellar_age}</p>
                        <label>Stellar mass:</label>
                        <p>{data.stellar_mass}</p>
                    </div>
                </div>
            </div>
        )
    );
}

export default Informacion;