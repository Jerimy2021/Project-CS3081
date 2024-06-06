import * as THREE from 'three';

export const moveCamera = (deltaTime, camera, C, D, moving, speed) => {
    console.log(moving);
    if (moving.forward) {
        camera.position.addScaledVector(C, speed * deltaTime);
    }
    if (moving.backward) {
        camera.position.addScaledVector(C, -speed * deltaTime);
    }
    if (moving.left) {
        camera.position.addScaledVector(D, speed * deltaTime);
    }
    if (moving.right) {
        camera.position.addScaledVector(D, -speed * deltaTime);
    }
};

export const movingKeysDown = (event, moving) => {
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
    }
}

export const movingKeysUp = (event, moving) => {
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
    }
}

export const lookRespectToVectors = (Direction, Right, camera) => {
    // Up es el dot product de la dirección y la derecha
    const up = Direction.clone().cross(Right);
    up.normalize();
    camera.up.set(up.x, up.y, up.z);

    const point = new THREE.Vector3();
    point.addVectors(Direction, camera.position);
    camera.lookAt(point);
};

export const rotationMatrix = (F, theta) => {
    return new THREE.Matrix3().set(
        Math.cos(theta) + F.x * F.x * (1 - Math.cos(theta)), F.x * F.y * (1 - Math.cos(theta)) - F.z * Math.sin(theta), F.x * F.z * (1 - Math.cos(theta)) + F.y * Math.sin(theta),
        F.y * F.x * (1 - Math.cos(theta)) + F.z * Math.sin(theta), Math.cos(theta) + F.y * F.y * (1 - Math.cos(theta)), F.y * F.z * (1 - Math.cos(theta)) - F.x * Math.sin(theta),
        F.z * F.x * (1 - Math.cos(theta)) - F.y * Math.sin(theta), F.z * F.y * (1 - Math.cos(theta)) + F.x * Math.sin(theta), Math.cos(theta) + F.z * F.z * (1 - Math.cos(theta))
    );
};
