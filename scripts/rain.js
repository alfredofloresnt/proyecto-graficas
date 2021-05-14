/*
    Me apoyo del codigo de Mugen87 usuario de stackoverflow.
    link: https://stackoverflow.com/questions/60935920/converting-three-js-geometry-into-buffergeometry
*/
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

let camera, scene, renderer, rain;

const vertex = new THREE.Vector3();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 2000, 3500);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
        vertices.push(
            Math.random() * 12 - 6,
            Math.random() * 18 - 9,
            Math.random() * 13 - 6
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
         color: '#ffffff',
         size: 0.1
        });

    rain = new THREE.Points(geometry, material);
    scene.add(rain);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

}

function rainVariation() {

    var positionAttribute = rain.geometry.getAttribute('position');

    for (var i = 0; i < positionAttribute.count; i++) {

        vertex.fromBufferAttribute(positionAttribute, i);

        vertex.y -= 1;

        if (vertex.y < - 60) {
            vertex.y = 90;
        }

        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);

    }

    positionAttribute.needsUpdate = true;

}

function animate() {

    requestAnimationFrame(animate);

    rainVariation();

    renderer.render(scene, camera);

}