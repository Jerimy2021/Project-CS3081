/**
 * @module Hooks
 */

import { useEffect } from 'react';
import * as THREE from 'three';
import { rotationMatrix } from '../utils/camaraControls'

/**
 * Use pointer lock hook
 * 
 * This function is a hook that allows the user to move the camera using the mouse.
 * 
 * @param {Object} canvasRef - The reference to the canvas element
 * @param {Object} C - The camera's direction vector
 * @param {Object} D - The camera's up vector
 * @param {Boolean} moving - A boolean that indicates if the camera is moving
 * 
 * @returns {void}
 */
export function usePointerLock(canvasRef, C, D, moving) {
    useEffect(() => {
        const onPointerLockChange = () => {
            if (document.pointerLockElement === document.body) {
                document.addEventListener('mousemove', onMouseMove, false);
            } else {
                document.removeEventListener('mousemove', onMouseMove, false);
            }
        };

        const onMouseMove = (event) => {
            let deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            let deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            const A = new THREE.Vector3().crossVectors(D.current, C.current);

            const thetaSpeed = 0.01;

            let C_ = C.current.clone();
            let D_ = D.current.clone();
            let C__ = C.current.clone();

            // C' = R(A, theta) * C
            C_.applyMatrix3(rotationMatrix(A, deltaX * thetaSpeed));
            // D' = R(A, theta) * D
            D_.applyMatrix3(rotationMatrix(A, deltaX * thetaSpeed));
            // C'' = R(D', theta) * C'
            C__ = C_.applyMatrix3(rotationMatrix(D_, deltaY * thetaSpeed));

            C.current.set(C__.x, C__.y, C__.z);
            D.current.set(D_.x, D_.y, D_.z);

            // Normalize
            C.current.normalize();
            D.current.normalize();
        };

        const onClick = () => {
            if (!document.pointerLockElement) {
                document.body.requestPointerLock();
            } else {
                document.exitPointerLock();
            }
        };

        window.addEventListener('click', onClick);
        document.addEventListener('pointerlockchange', onPointerLockChange, false);


        return () => {
            window.removeEventListener('click', onClick);
            document.removeEventListener('pointerlockchange', onPointerLockChange, false);
            document.removeEventListener('mousemove', onMouseMove, false);
        };
    }, [canvasRef, C, D, moving]);
};
