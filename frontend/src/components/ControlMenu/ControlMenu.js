import "./ControlMenu.css";
import KeyComponent from "../KeyComponent/KeyComponent";

function ControlMenu() {
    return (
        <div className="control-menu">
            <div className="control-menu-top">
                <h1>Control Menu</h1>
                <KeyComponent keyValue="w" description="Adelante"/>
                <button className="control-menu-close">X</button>
            </div>
            <div className="control-menu-content">
                <div className="control-menu-left">
                    <div className="movement-keys">
                        <div className="movement-keys-wasd">
                            <h2>WASD</h2>
                        </div>
                        <div className="movement-keys-ud">
                            <h2>up and down Keys</h2>
                        </div>
                    </div>
                    <div className="control-others">
                        <h1>others</h1>
                    </div>
                </div>
                <div className="control-menu-right">
                    <div className="focuss-mode">
                        <h1>Focus Mode</h1>
                    </div>
                    <div className="turbo-motor-mode">
                        <h1>Turbo Motor Mode</h1>
                    </div>
                    <div className="camara-rotation-details">
                        <h1>Camera Rotation Details</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlMenu;