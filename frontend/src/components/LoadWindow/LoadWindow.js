/**
 * @module Components
 */
import React from "react";

import { useState, useEffect } from "react";

import "./LoadWindow.css";

function LoadWindow({ loaded }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loaded) {
            setLoading(false);
        }
    }, [loaded]);

    return (
        <div className="load-window" style={{ display: loading ? "flex" : "none" }}>
            <div className="loader"></div>
        </div>
    );
}

export default LoadWindow;