const canvas = document.getElementById('3DInterface'); // Canvas where the 3D interface will be rendered

const renderer = new THREE.WebGLRenderer({canvas}); // Renderer for the 3D interface
const scene = new THREE.Scene(); // Scene where the 3D interface will be rendered
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 10000); // Field of view, aspect ratio, near, far
let speed = 0.1; // Speed of the camera

const C = new THREE.Vector3(1, 0, 0); // Camera direction
const D = new THREE.Vector3(0, 0, -1); // Camera right direction
let moving = { // Camera movement
    forward: false,
    backward: false,
    left: false,
    right: false
}


// funciones importantes ---------------------------
function initializeScene() {
    inizializeComponents();
    resizeRenderer();
}

function inizializeComponents() {

    //crear puntos
    const n = 10000;
    const geometry = new THREE.SphereGeometry(0.5, 5, 5);
    for (let i = 0; i < n; i++) {
        const material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});
        const cube = new THREE.Mesh(geometry, material);
        //random position
        cube.position.x = Math.random() * 1000 - 500;
        cube.position.y = Math.random() * 1000 - 500;
        cube.position.z = Math.random() * 1000 - 500;
        scene.add(cube);
    }

    //dibujar los axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
}

function lookRespectToVectors(Direction, Right, camera) {
    //up es el dot product de la direccion y la derecha
    const up = Direction.clone().cross(Right);
    up.normalize();
    camera.up.set(up.x, up.y, up.z);

    const point = new THREE.Vector3();
    point.addVectors(Direction, camera.position);
    camera.lookAt(point);
}

function rotationMatrix(F, theta) {
    return new THREE.Matrix3().set(
        Math.cos(theta) + F.x * F.x * (1 - Math.cos(theta)), F.x * F.y * (1 - Math.cos(theta)) - F.z * Math.sin(theta), F.x * F.z * (1 - Math.cos(theta)) + F.y * Math.sin(theta),
        F.y * F.x * (1 - Math.cos(theta)) + F.z * Math.sin(theta), Math.cos(theta) + F.y * F.y * (1 - Math.cos(theta)), F.y * F.z * (1 - Math.cos(theta)) - F.x * Math.sin(theta),
        F.z * F.x * (1 - Math.cos(theta)) - F.y * Math.sin(theta), F.z * F.y * (1 - Math.cos(theta)) + F.x * Math.sin(theta), Math.cos(theta) + F.z * F.z * (1 - Math.cos(theta))
    );
}

function moveCamera(deltaTime){
    if (moving.forward) {
        camera.position.addScaledVector(C, speed*deltaTime);
    }
    if (moving.backward) {
        camera.position.addScaledVector(C, -speed*deltaTime);
    }
    if (moving.left) {
        camera.position.addScaledVector(D, speed*deltaTime);
    }
    if (moving.right) {
        camera.position.addScaledVector(D, -speed*deltaTime);
    }
}



// bucle de renderizado ----------------------------
let lastTime = 0;
function render(time) {
    time *= 0.001; // Convertir a segundos
    const deltaTime = time - lastTime;
    lastTime = time;

    renderer.render(scene, camera);
    lookRespectToVectors(C, D, camera);
    moveCamera(deltaTime);

    requestAnimationFrame(render);
}


// iniciar la escena -------------------------------
function startScene() {
    initializeScene();
    render();
}



// Eventos
function resizeRenderer() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    
    if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

window.addEventListener('resize', () => {
    resizeRenderer();
});

window.addEventListener('mousemove', (event) => {
    let deltaX = event.movementX;
    let deltaY = event.movementY;

    const A = new THREE.Vector3().crossVectors(D, C);

    const thetaSpeed = 0.01;

    let C_ = C.clone();
    let D_ = D.clone();
    let C__ = C.clone();

    //C' = R(A, theta) * C
    C_.applyMatrix3(rotationMatrix(A, deltaX * thetaSpeed));
    //D' = R(A, theta) * D
    D_.applyMatrix3(rotationMatrix(A, deltaX * thetaSpeed));
    //C'' = R(D', theta) * C'
    C__ = C_.applyMatrix3(rotationMatrix(D_, deltaY * thetaSpeed));

    C.set(C__.x, C__.y, C__.z);
    D.set(D_.x, D_.y, D_.z);

    
    //normalizar
    C.normalize();
    D.normalize();  
});

window.addEventListener('keydown', (event) => {
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
    }
});

window.addEventListener('keyup', (event) => {
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
    }
});




// ================== MAIN ==================
startScene(); // Start the 3D interface