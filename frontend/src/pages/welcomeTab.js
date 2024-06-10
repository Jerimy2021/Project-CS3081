import React from 'react';
import SideBar from '../components/sideBar';
import Slider from '../components/slider';
import CanvasComponent from '../components/canvasComponent';
import StellarName from '../components/stellarName';
import './welcomeTab.css';

function WelcomeTab() {
  const StellarNameProps = {
    name: 'My solar system',
  };

  return (
    <div className="WelcomeTab">
      <SideBar />
      <div className="main">
        <CanvasComponent />
        <Slider />
        <StellarName {...StellarNameProps} />
      </div>
    </div>
  );
}

export default WelcomeTab;