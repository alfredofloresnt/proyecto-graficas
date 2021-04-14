import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
camera.position.z = 5;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Crear luz //
let light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, 12, 0 );
light.castShadow = true;            // default false
light.shadow.mapSize.width = 1024;  // default 512
light.shadow.mapSize.height = 1024; // default 512
light.shadow.camera.near = 2;       // default 0.5
light.shadow.camera.far = 100;      // default 500
scene.add( light );

// Helper //
const helper = new THREE.CameraHelper( light.shadow.camera );
//scene.add( helper );



/*
let room;
loader.load('../models/room.glb', function (gltf) {
    room = gltf.scene;
    room.castShadow = true; 
    room.receiveShadow = true; 
    scene.add(room);
}, undefined, function (error) {
    console.errr(error);
});
*/

// Crear plano //
var texture = new THREE.TextureLoader().load( 'img/floor.jpg' );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );
var planeGeometry = new THREE.PlaneGeometry( 10, 10, 32, 32 );
var planeMaterial = new THREE.MeshPhongMaterial( { map: texture, shininess: 1, shading: THREE.FlatShading } )
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );
plane.position.y = 0;
plane.rotation.x = -Math.PI/2;

// Crear Cubo //
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.scale.set(0.5,0.5,0.5);
cube.position.y = 1;
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);


camera.position.z = 4;
camera.position.y = 1.10;

const animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.1;
    cube.rotation.z += 0.1;
    renderer.render(scene, camera);
};

animate();
