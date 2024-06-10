import { useEffect } from 'react';
import * as THREE from 'three';
import { rotationMatrix } from '../utils/camaraControls'

export const usePointerLock = (canvasRef, C, D, moving) => {
    useEffect(() => {
        const canvas = canvasRef.current;

        const onPointerLockChange = () => {
            if (document.pointerLockElement === canvas) {
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
            canvas.requestPointerLock();
        };

        canvas.addEventListener('click', onClick);
        document.addEventListener('pointerlockchange', onPointerLockChange, false);


        return () => {
            canvas.removeEventListener('click', onClick);
            document.removeEventListener('pointerlockchange', onPointerLockChange, false);
            document.removeEventListener('mousemove', onMouseMove, false);
        };
    }, [canvasRef, C, D, moving]);
};
