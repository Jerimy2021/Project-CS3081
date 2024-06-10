import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import ThreeDInterface from './components/ThreeDInterface/ThreeDInterface';

import { getPlanets, getStellarSystems } from './utils/apiFunctions';

import * as THREE from 'three';

function App() {
  const [stellar_systems, setStellarSystems] = useState([]);
  const [selected_stellar_system, setSelectedStellarSystem] = useState('');
  const [planets, setPlanets] = useState([
      {
          name: "Earth",
          radius: "6.371",
          textures: {
              diffuse: "https://raw.githubusercontent.com/gist/juanmirod/081a0b45372f6da81469/raw/526488c67e82f8916f21c07c0b7707b6d5a3615c/earth_texture_map_1000px.jpg",
              normal: "",
              specular: "",
              emissive: "",
              opacity: "",
              ambient: ""
          },
          coordinates: { x: 500, y: 0, z: 0 }
      },
  ]);

  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const C = useRef(new THREE.Vector3(1, 0, 0)); // Camera direction
  const D = useRef(new THREE.Vector3(0, 0, -1)); // Camera right direction
  

  // Load planets
  useEffect(() => {
    getStellarSystems(setStellarSystems);
  }, []);

  useEffect(() => {
    if (stellar_systems.length > 0) {
      getPlanets(setPlanets, stellar_systems[0].name);
    }
  }, [selected_stellar_system]);

  return (
    <div className="body">
      <div className='top'>
        <h1>3D React</h1>
        <select onChange={(event) => { setSelectedStellarSystem(event.target.value) }}>
          { stellar_systems.map((stellar_system, index) => {
            return <option key={index}>{stellar_system.name}</option>
          }
          )}
        </select>
      </div>
      <div className='main'>
        <ThreeDInterface planets={planets} cameraRef={cameraRef} sceneRef={sceneRef} C={C} D={D} />
      </div>
    </div>
  );
}

export default App;
