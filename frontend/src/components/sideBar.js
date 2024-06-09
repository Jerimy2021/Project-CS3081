import './sideBar.css';

function SideBar() {
    return (
        <div className="sideBar">
            <div id="topSidebar">
                <h1>Welcoming!</h1>
                <button id = "welcomeStart">Start</button>
            </div>
            <div id="bottomSidebar">
                <a href = "#contact">Contact us</a>
            </div> 
        </div>
    );
}

export default SideBar;