/**
 * @module Utils
 */

import * as THREE from 'three';

/**
 * Move Camera
 * 
 * The function moves the camera in the direction specified by the moving object. Delta Time is used to calculate the distance to move and mantain a constant speed independent of the frame rate.
 * 
 * @param {number} deltaTime - Time elapsed since the last frame.
 * @param {THREE.PerspectiveCamera} camera - Camera to move.
 * @param {THREE.Vector3} C - Forward direction of the camera.
 * @param {THREE.Vector3} D - Right direction of the camera.
 * @param {object} moving - Object with boolean flags indicating the movement state.
 * @param {number} speed - Base speed of the camera.
 * @param {number} speedUp - Speed increase of the camera.
 * @returns {void}
 */
export function moveCamera(deltaTime, camera, C, D, moving, speed, speedUp) {
    if (moving.forward) {
        C.normalize();
        camera.position.addScaledVector(C, (speed + speedUp) * deltaTime);
    }
    if (moving.backward) {
        camera.position.addScaledVector(C, -(speed + speedUp) * deltaTime);
    }
    if (moving.left) {
        camera.position.addScaledVector(D, (speed + speedUp) * deltaTime);
    }
    if (moving.right) {
        camera.position.addScaledVector(D, -(speed + speedUp) * deltaTime);
    }
    const DCopy = D.clone();
    const up = DCopy.cross(C);
    if (moving.up) {
        camera.position.addScaledVector(up, -(speed + speedUp) * deltaTime);
    }
    if (moving.down) {
        camera.position.addScaledVector(up, (speed + speedUp) * deltaTime);
    }
};

/**
 * movingKeysDown 
 * 
 * Change the moving object flags to indicate the direction of movement. This flags will be used to move the camera in the moveCamera function.
 * 
 * @param {KeyboardEvent} event - The event of the key pressed.
 * @param {object} moving - Object with boolean flags that we will change to indicate the direction of movement.
 * @param {object} speedingUp - Object with a boolean flag that we will change to indicate if the camera is speeding up.
 */
export function movingKeysDown(event, moving, speedingUp) {
    switch (event.key) {
        case 'w':
            moving.forward = true;
            break;
        case 's':
            moving.backward = true;
            break;
        case 'a':
            moving.left = true;
            break;
        case 'd':
            moving.right = true;
            break;
        case 'Shift':
            moving.down = true;
            break;
        case ' ':
            moving.up = true;
            break;
        case 'Control':
            speedingUp.current = true;
            break;
        default:
            break;
    }
};

/**
 * movingKeysUp 
 * 
 * Change the moving object flags to indicate if we are not moving in a direction anymore. This flags will be used to move the camera in the moveCamera function.
 * 
 * @param {KeyboardEvent} event - The event of the key pressed.
 * @param {object} moving - Object with boolean flags that we will change to indicate the direction of movement.
 * @param {object} speedingUp - Object with a boolean flag that we will change to indicate if the camera is speeding up.
 */
export function movingKeysUp(event, moving, speedingUp) {
    switch (event.key) {
        case 'w':
            moving.forward = false;
            break;
        case 's':
            moving.backward = false;
            break;
        case 'a':
            moving.left = false;
            break;
        case 'd':
            moving.right = false;
            break;
        case 'Shift':
            moving.down = false;
            break;
        case ' ':
            moving.up = false;
            break;
        case 'Control':
            speedingUp.current = false;
            break;
        default:
            break;
    }
};
/**
 * lookRespectToVectors
 * 
 * Make the camera look to a specific direction based on the forward and right vectors.
 * 
 * @param {THREE.Vector3} Direction - Forward direction of the camera.
 * @param {THREE.Vector3} Right - Right direction of the camera.
 * @param {THREE.PerspectiveCamera} camera - Camera to set the up vector and make it look forward.
 * @returns {void}
 */
export function lookRespectToVectors(Direction, Right, camera) {
    // calculate the up vector based on the direction and right vectors
    const up = Direction.clone().cross(Right);
    up.normalize();

    // set the up vector to the camera
    camera.up.set(up.x, up.y, up.z);
    const point = new THREE.Vector3();
    point.addVectors(Direction, camera.position);
    camera.lookAt(point);
};

/**
 * rotationMatrix
 * 
 * Returns the rotation matrix for the given rotation vector and angle. This will be used to rotate the camera.
 * 
 * @param {THREE.Vector3} F - Respective rotation vector.
 * @param {number} theta - Angle of rotation in radians.
 * @returns {THREE.Matrix3} - Rotation matrix.
 */
export function rotationMatrix(F, theta) {
    return new THREE.Matrix3().set(
        Math.cos(theta) + F.x * F.x * (1 - Math.cos(theta)), F.x * F.y * (1 - Math.cos(theta)) - F.z * Math.sin(theta), F.x * F.z * (1 - Math.cos(theta)) + F.y * Math.sin(theta),
        F.y * F.x * (1 - Math.cos(theta)) + F.z * Math.sin(theta), Math.cos(theta) + F.y * F.y * (1 - Math.cos(theta)), F.y * F.z * (1 - Math.cos(theta)) - F.x * Math.sin(theta),
        F.z * F.x * (1 - Math.cos(theta)) - F.y * Math.sin(theta), F.z * F.y * (1 - Math.cos(theta)) + F.x * Math.sin(theta), Math.cos(theta) + F.z * F.z * (1 - Math.cos(theta))
    );
};
