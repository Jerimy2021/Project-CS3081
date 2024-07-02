/**
 * @module Components
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './sideBar.css';

/**
 * SideBar
 * 
 * This component is the sidebar of the application.
 * 
 * @returns {JSX.Element} The SideBar component
 */
function SideBar() {
    return (
        <div className="sideBar">
            <div id="topSidebar">
                <h1>Welcoming!</h1>
                <Link to="/UI"> 
                    <button id = "welcomeStart">Start</button>
                </Link>
            </div>
            <div id="bottomSidebar">
               <Link to="/Contact"> Contact us </Link>
            </div> 
        </div>
    );
}

export default SideBar;