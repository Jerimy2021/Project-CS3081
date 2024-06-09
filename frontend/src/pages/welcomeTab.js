import SideBar from '../components/sideBar.js'
import Slider from '../components/slider.js'
import canvasComponent from '../components/canvasComponent.js'
import StellarName from '../components/stellarName.js';
import './welcomeTab.css';

function WelcomeTab() {
    return (
        <div className="WelcomeTab">
            <SideBar />
            <div className='main'>
                <canvasComponent />
                <Slider />
                <StellarName />
            </div>
        </div>
    );
}

export default WelcomeTab;

