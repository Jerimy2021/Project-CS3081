/**
 * @module Utils
 */

/**
 * HandleResize
 * 
 * The function handles with the resizing of the canvas and the camera aspect ratio.
 * 
 * @param {WebGLRenderer} renderer - The renderer of the scene.
 * @param {PerspectiveCamera} camera - The camera of the scene.
 * @param {HTMLCanvasElement} canvas - The canvas element of the scene.
 * @returns {void}
 */
export function handleResize(renderer, camera, canvas) {
    const width = canvas.clientWidth; // Ancho del canvas
    const height = canvas.clientHeight; // Alto del canvas

    // Ajustar el tamaño del renderer al tamaño actual del canvas
    renderer.setSize(width, height, false);

    // Actualizar el aspect ratio de la cámara según el nuevo tamaño del canvas
    camera.aspect = width / height;

    // Actualizar la matriz de proyección de la cámara con el nuevo aspect ratio
    camera.updateProjectionMatrix();
};
