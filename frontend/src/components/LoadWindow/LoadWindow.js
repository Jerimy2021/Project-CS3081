import React, { useState, useEffect } from "react";
import "./LoadWindow.css";

function LoadWindow({ loaded }) {
    const [loading, setLoading] = useState(true);
    const [slide, setSlide] = useState(false);

    useEffect(() => {
        if (loaded) {
            setSlide(true);
            const timer = setTimeout(() => setLoading(false), 500); // Tiempo suficiente para la animación
            return () => clearTimeout(timer);
        } else {
            setLoading(true);
            setSlide(false);
        }
    }, [loaded]);

    return (
        <div className={`load-window ${loading ? "active" : ""} ${slide ? "slide-out" : ""}`}>
            <div className="loader-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    );
}

export default LoadWindow;