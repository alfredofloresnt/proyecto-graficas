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
renderer.shadowMapSoft = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz auxiliar
// let auxLight = new THREE.PointLight(0xffffff, 1, 25);
// auxLight.position.set(0, 1, 3);
// scene.add(auxLight);

// Crear luces del cuarto
let hue = 0;
let light = new THREE.SpotLight(0xFFE294, 1, 25);
light.position.set( -4, 4.85, -4 );
light.castShadow = true;            // default false
light.shadow.mapSize.width = 2048;  // default 512
light.shadow.mapSize.height =2048; // default 512
light.shadow.camera.near = 0.5;       // default 0.5
light.shadow.camera.far = 15;      // default 500
light.shadow.bias = -0.005;
scene.add( light );

const lightHelper = new THREE.SpotLightHelper( light );
// scene.add(lightHelper);

let light2 = new THREE.SpotLight(0xFFE294, 1, 25);
light2.position.set( 4, 4.85, -4 );
light2.castShadow = true;            // default false
light2.shadow.mapSize.width = 2048;  // default 512
light2.shadow.mapSize.height =2048; // default 512
light2.shadow.camera.near = 0.5;       // default 0.5
light2.shadow.camera.far = 15;      // default 500
light2.shadow.bias = -0.005;
scene.add( light2 );

const light2Helper = new THREE.SpotLightHelper( light2 );
// scene.add(light2Helper);

const alight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( alight );

// Helper para sombras
const helper = new THREE.CameraHelper( light.shadow.camera );
const helper2 = new THREE.CameraHelper( light2.shadow.camera );
// scene.add( helper );
// scene.add( helper2 );

// Crear cuarto
let room;
loader.load('../models/gamingRoom.glb', function (gltf) {
    room = gltf.scene;
    room.castShadow = true; 
    room.receiveShadow = true;
    room.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow = true} } );
    scene.add(room);
}, undefined, function (error) {
    console.log(error);
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
const cubeTexture = new THREE.TextureLoader().load('img/itemBox.png');
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: cubeTexture });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.scale.set(0.3,0.3,0.3);
cube.position.x = -3.5;
cube.position.y = 2.2;
cube.position.z = 0.9;
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Cube light
const cubeLight = new THREE.PointLight( 0xffe75a, 40, 0.6);
cubeLight.position.set(-3.5, 2.2, 0.9);
scene.add(cubeLight);

const cubeLightHelper = new THREE.PointLightHelper(cubeLight, 0.6);
// scene.add( cubeLightHelper );

// Earth globe
const sphereGeo = new THREE.SphereGeometry( 0.2, 50, 50 );
const sphereTex = new THREE.TextureLoader().load('img/earth.jpg');
const sphereMat = new THREE.MeshBasicMaterial({ map: sphereTex });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(-3.5, 2.2, 3.1);
scene.add(sphere);

// Earth globe lights
const sphereLightB = new THREE.PointLight( 0x0000ff, 40, 0.6 );
sphereLightB.position.set(-3.5, 2.2, 3.1);
scene.add(sphereLightB);
const sphereLightW = new THREE.PointLight( 0x895522, 40, 0.6 );
sphereLightW.position.set(-3.5, 2.2, 3.1);
scene.add(sphereLightW);
const sphereLightG = new THREE.PointLight( 0x00ff00, 40, 0.6 );
sphereLightG.position.set(-3.5, 2.2, 3.1);
scene.add(sphereLightG);

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

// hace la animacion de la lluvia cayendo.
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

    // cambiar color de las luces del cuarto
    var h = hue * 0.01 % 1;
    var s = 0.5;
    var l = 0.5;
    light.color.setHSL(h, s, l);
    light2.color.setHSL(h, s, l);
    hue = hue + 0.08;


    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    sphere.rotation.y += 0.005;

    rainVelocity();

    controls.update();
    renderer.render(scene, camera);


};

animate();
