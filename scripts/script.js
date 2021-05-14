import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);


camera.position.z = 5;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear luz //
let light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 12, 0);
light.castShadow = true;            // default false
light.shadow.mapSize.width = 1024;  // default 512
light.shadow.mapSize.height = 1024; // default 512
light.shadow.camera.near = 2;       // default 0.5
light.shadow.camera.far = 100;      // default 500
scene.add(light);


// Helper //
const helper = new THREE.CameraHelper(light.shadow.camera);
//scene.add( helper );




let room;
loader.load('../models/room2.glb', function (gltf) {
    room = gltf.scene;
    scene.add(room);
    // model.traverse( function ( object ) {

    //     if ( object.isMesh ) object.castShadow = true;

    // } );
    // room.castShadow = true; 
    // room.receiveShadow = true; 
}, undefined, function (error) {
    console.errr(error);
});


// Crear plano //
var texture = new THREE.TextureLoader().load('img/floor.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);
var planeGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
var planeMaterial = new THREE.MeshPhongMaterial({ map: texture, shininess: 1, shading: THREE.FlatShading })
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.position.y = 0;
plane.rotation.x = -Math.PI / 2;

// Crear Cubo //
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x7ffc66 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.scale.set(0.5, 0.5, 0.5);
cube.position.y = 5.9;
cube.position.x = -4;
cube.position.z = 4;
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);


camera.position.z = 20;
camera.position.y = 1.10;
camera.rotation.y = Math.PI / 2;
controls.update();

// luvia
let rain;
const vertex = new THREE.Vector3();
const rainSprite = new THREE.TextureLoader().load('img/disc.png');
const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 10000; i++) {
    vertices.push(
        Math.random() * 20 - 10,
        Math.random() * 30,
        Math.random() * 20 - 10
    );
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
    map: rainSprite,
    transparent: true
});

rain = new THREE.Points(geometry, material);
scene.add(rain);

function rainVelocity() {

    var positionAttribute = rain.geometry.getAttribute('position');

    for (var i = 0; i < positionAttribute.count; i++) {

        vertex.fromBufferAttribute(positionAttribute, i);
        
        vertex.y -= 0.05;

        if (vertex.x >= -4 && vertex.x <= 4 && vertex.z >= -4 && vertex.z <= 4) {
            if (vertex.y < 6) {
                vertex.y = 10;
            }
        }


        if (vertex.y < 0) {
            vertex.y = 10;
        }

        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);

    }

    positionAttribute.needsUpdate = true;

}


const animate = function () {
    requestAnimationFrame(animate);
    // cube.rotation.y += 0.1;
    // cube.rotation.z += 0.1;

    rainVelocity();

    controls.update();
    renderer.render(scene, camera);


};

animate();
