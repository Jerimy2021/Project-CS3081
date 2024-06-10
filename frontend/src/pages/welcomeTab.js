import React from 'react';
import SideBar from '../components/sideBar';
import Slider from '../components/slider';
import StellarName from '../components/stellarName';
import StellarSystemSelector from '../components/StellarSystemSelector/StellarSystemSelector';
import { getStellarSystems } from '../utils/apiFunctions';
import './welcomeTab.css';

function WelcomeTab() {

  const [stellarSystems, setStellarSystems] = React.useState([]);
  const [selectedStellarSystem, setSelectedStellarSystem] = React.useState(0);

  // Load stellar systems
  React.useEffect(() => {
    //cargar de local storage
    const stellarSystemsJSON = JSON.parse(localStorage.getItem('stellarSystems'));

    console.log(stellarSystemsJSON)
    if (stellarSystemsJSON) {
      setStellarSystems(stellarSystemsJSON);
    } else {
      getStellarSystems(setStellarSystems);
    }
  }, []);

  //setear en local storage el indice del sistema estelar seleccionado
  React.useEffect(() => {
    localStorage.setItem('selectedStellarSystem', selectedStellarSystem);
  }, [selectedStellarSystem]);


  const conatinerRef = React.useRef(null);

  return (
    <div className="WelcomeTab">
      <SideBar />
      <div className="main" ref={conatinerRef}>
        <StellarSystemSelector stellarSystem={stellarSystems.length > 0 ? stellarSystems[selectedStellarSystem] : null} conatinerRef={conatinerRef} />
        <Slider length={stellarSystems.length} index={selectedStellarSystem} setIndex={setSelectedStellarSystem} />
        <StellarName name={stellarSystems.length > 0 ? stellarSystems[selectedStellarSystem].name : null} />
      </div>
    </div>
  );
}

export default WelcomeTab;