import * as THREE from 'three';

export const drawCircleAroundPlanets = (topCanvasRef, planetsRef, cameraRef, C, selectedPlanetsRef, ctx) => {

    const radioPixeles = (d, i, coordenadas) => {
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
}

export const distanciaParaRadioEspecifico = (desiredRadius, radioUnits, topCanvasRef) => {
    // Asegurarse de que los elementos estén disponibles
    if (!topCanvasRef.current) return;

    const height = topCanvasRef.current.clientHeight; // Altura del canvas en píxeles

    // Ángulo de visión vertical de la cámara (en radianes)
    const fov = 1.309; // Ejemplo: 75 grados en radianes, ajusta según tu configuración

    // Calcular la distancia necesaria
    const distance = (radioUnits * height) / (desiredRadius * Math.tan(fov / 2));

    return distance;
}

export const drawSpeedometer = (topCanvasRef, speedUp, maxSpeedUp, ctx) => {
    const drawSpeedometer = (x_margin, y, speedUp, maxSpeedUp) => {
        const x = topCanvasRef.current.width - x_margin*2;

        ctx.setLineDash([5, 0]);
        //vertical line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + topCanvasRef.current.height - y*2);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        //horizontal lines
        ctx.beginPath();
        ctx.moveTo(x - x_margin, y + topCanvasRef.current.height - y*2);
        ctx.lineTo(x + x_margin, y + topCanvasRef.current.height - y*2);
        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - x_margin, y);
        ctx.lineTo(x + x_margin, y);
        ctx.strokeStyle = 'white';
        ctx.stroke();

        const line_height = topCanvasRef.current.height - y*2;
        const line_y = y + line_height - (speedUp.current/maxSpeedUp)*line_height;
        //dibujar linea de velocidad
        ctx.beginPath();
        ctx.moveTo(x - x_margin, line_y);
        ctx.lineTo(x + x_margin, line_y);
        ctx.strokeStyle = 'red';
        ctx.stroke();

    }

    const x = 30;
    const y = 50;

    drawSpeedometer(x, y, speedUp, maxSpeedUp);
}


export const MenuKeysDown = (e, selectedPlanetsRef, planetsRef, cameraRef, C, D, topCanvasRef, setFixedPlanetData, setVisibleInfoBool, visibleInfBoolRef) => {
    if (e.key === 'f') {
        if (selectedPlanetsRef.current.length > 0) {
            // set camera position
            const planet = planetsRef.current[selectedPlanetsRef.current[0]];
            const radio = planet.geometry.parameters.radius;
            const targetRadius = 150;
            cameraRef.current.position.set(planet.position.x - distanciaParaRadioEspecifico(targetRadius, radio, topCanvasRef), planet.position.y, planet.position.z);
            C.current = new THREE.Vector3(1, 0, 0);
            D.current = new THREE.Vector3(0, 0, -1);

            //set the fixed planet data
            setFixedPlanetData(planet.planet_data);
            setVisibleInfoBool(true);
            visibleInfBoolRef.current = true;
            document.exitPointerLock();
        }
    }

    if (e.key === 'e') {
        window.location = '/';
    }
}