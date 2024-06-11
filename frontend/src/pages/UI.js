import React from "react";
import StellarName from "../components/stellarName";
import ThreeDInterface from "../components/ThreeDInterface/ThreeDInterface";
import LoadWindow from "../components/LoadWindow/LoadWindow";
import "./UI.css";

import { useState, useEffect, useRef } from "react";
import { getStellarSystems, getPlanets } from "../utils/apiFunctions";
import * as THREE from "three";

function loadData(setStellarSystems, setSelectedStellarSystem, setPlanets) {
    const stellar_systems_local = JSON.parse(localStorage.getItem('stellarSystems'));

    if (stellar_systems_local) {
        setStellarSystems(stellar_systems_local);
        const index = parseInt(localStorage.getItem('selectedStellarSystem'));
        setSelectedStellarSystem(parseInt(index));


        getPlanets(setPlanets, stellar_systems_local[index].name);
    } else {
        getStellarSystems(setStellarSystems);
    }
}


function UI() {
    const [stellar_systems, setStellarSystems] = useState([]);
    const [selected_stellar_system, setSelectedStellarSystem] = useState(0);
    const [planets, setPlanets] = useState([]);

    const cameraRef = useRef(null); 
    const sceneRef = useRef(null);
    const C = useRef(new THREE.Vector3(1, 0, 0)); // Camera direction
    const D = useRef(new THREE.Vector3(0, 0, -1)); // Camera right direction
    const planetsRef = useRef([]);

    const topCanvasRef = useRef({ current: { width: 0, height: 0, clientWidth: 0, clientHeight: 0 } });
    
    const selectedPlanetsRef = useRef([]);    


    // Load planets
    useEffect(() => {
        loadData(setStellarSystems, setSelectedStellarSystem, setPlanets);
        
        const ctx = topCanvasRef.current.getContext('2d');

        const distanciaParaRadioEspecifico = (desiredRadius, radioUnits) => {
            // Asegurarse de que los elementos estén disponibles
            if (!topCanvasRef.current) return null;

            const height = topCanvasRef.current.clientHeight;
        
            // Ángulo de visión vertical de la cámara (en radianes)
            const fov = 1.309; // Ejemplo: 75 grados en radianes, ajusta según tu configuración
        
            // Calcular la distancia necesaria
            const distance = (radioUnits * height) / (desiredRadius * Math.tan(fov / 2));
        
            return distance;
        }
        
        const radioPixeles = (d, i, coordenadas) => {
            console.log(planetsRef.current[i]);
            const radioUnits = planetsRef.current[i].geometry.parameters.radius;
            
            const height = topCanvasRef.current.clientHeight;
            const radioReal = radioUnits*(height/(d*Math.tan(1.309/2))); //Math.tan() recieb el angulo en radianes //1.38
            //maximo
            const minRadio = Math.max(50, radioReal);
            const b = 20;

            const R = Math.pow(0.2, -1/b);

            //distancia entre el centro del planeta y el centro de la pantalla
            const distanciaCentro = Math.sqrt(Math.pow(coordenadas.x - topCanvasRef.current.clientWidth/2, 2) + Math.pow(coordenadas.y - topCanvasRef.current.clientHeight/2, 2));

            const radioPixeles = (0.6*minRadio/(1+Math.pow(R, distanciaCentro-b)) + minRadio);
            return radioPixeles;
        }

        const centroCoordenadas = (i) => {
            //proyeccion del planeta en el canvas
            let vectorCP = new THREE.Vector3();
            vectorCP = vectorCP.subVectors(planetsRef.current[i].position, cameraRef.current.position);
            vectorCP.setFromMatrixPosition(planetsRef.current[i].matrixWorld).project(cameraRef.current);

            const coordendas = {x: 0, y: 0};

            coordendas.x = (vectorCP.x + 1) / 2 * topCanvasRef.current.clientWidth;
            coordendas.y = (1 - vectorCP.y) / 2 * topCanvasRef.current.clientHeight;

            return coordendas;
        }

        const drawDashedCircle = (x, y, r) => {
            ctx.beginPath();
            ctx.setLineDash([5, 15]);
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.strokeStyle = 'white';
            ctx.stroke();
        }


        //si presionas la F la camara se enfoca en el planeta
        window.addEventListener('keydown', (e) => {
            if (e.key === 'f') {
                if (selectedPlanetsRef.current.length > 0) {
                    const planet = planetsRef.current[selectedPlanetsRef.current[0]];
                    const radio = planet.geometry.parameters.radius;
                    const targetRadius = 150;
                    cameraRef.current.position.set(planet.position.x - distanciaParaRadioEspecifico(targetRadius, radio), planet.position.y, planet.position.z);
                    C.current = new THREE.Vector3(1, 0, 0);
                    D.current = new THREE.Vector3(0, 0, -1);
                }
            }
        });

        const render = () => {
            if (!topCanvasRef.current) return;

            topCanvasRef.current.width = window.innerWidth;
            topCanvasRef.current.height = window.innerHeight;

            selectedPlanetsRef.current = [];

            for(let i = 0; i < planetsRef.current.length; i++) {
                //vector desde la camara al planeta
                let vectorCP = new THREE.Vector3();
                vectorCP = vectorCP.subVectors(planetsRef.current[i].position, cameraRef.current.position);

                //angulo entre vector CP y C
                const angle = vectorCP.angleTo(C.current); //el angulo está en radianes

                if(angle < Math.PI/2) {
                    //distancia entre la camara y el planeta
                    const distance = cameraRef.current.position.distanceTo(planetsRef.current[i].position);

                    //coordenadas del centro del planeta
                    const coordendas = centroCoordenadas(i);

                    //radio del circulo
                    const radio = radioPixeles(distance, i, coordendas);

                    

                    //dibujar circulo
                    drawDashedCircle(coordendas.x, coordendas.y, radio);

                    const dist_center_coord = Math.sqrt(Math.pow(coordendas.x - topCanvasRef.current.width/2, 2) + Math.pow(coordendas.y - topCanvasRef.current.height/2, 2));
                    if (dist_center_coord <= radio) {
                        selectedPlanetsRef.current.push(i);
                    }
                }
            }

            requestAnimationFrame(render);
        }

        render();

    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    useEffect(() => {
        if (!stellar_systems) return; // Wait for stellar systems to load

        if (stellar_systems.length > 0) {
            getPlanets(setPlanets, stellar_systems[selected_stellar_system].name);
        }
        
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_stellar_system]);

    return (
        <div className="UI jalar-a-derecha">
            <LoadWindow loaded={planetsRef.current.length > 0} />
            <canvas className="topCanvas" ref={topCanvasRef} />
            <ThreeDInterface planets={planets} cameraRef={cameraRef} sceneRef={sceneRef} C={C} D={D} topCanvasRef={topCanvasRef} planetsRef={planetsRef} />
            <div className="controles">
                <p>Press K to 'Control key menu'</p>
                <p>Press F to 'Focus on a planet'</p>
                <p>Press C to change de stellar system</p>
                <p>Press B to report a bug</p>
                <p>Press E to exit</p>
            </div>
            <div className="cross-center">
                +
            </div>
            <StellarName name={stellar_systems.length > 0 ? stellar_systems[selected_stellar_system].name : "Undefined"} />  
        </div>  
    );
}

export default UI;