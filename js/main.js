//Import the THREE.js library
// import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import * as THREE from 'three';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'halo';
// let objToRender = 'eye_implant';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
    // object.rotation.y = -10;
    scene.rotation.y = 15;
    scene.position.x = 0.25;
  },
  function (xhr) {
    //While it is loading, log the progress
    if (scene.add(object)) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    } else {
      alert("Please wait while Loading");
    }
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

THREE.ColorManagement.enabled = true;

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);      // append selected container (area)
// document.body.appendChild( renderer.domElement );      // append Full body

renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing
const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const glitchPass = new GlitchPass();
composer.addPass( glitchPass );

const outputPass = new OutputPass();
composer.addPass( outputPass );

const luminosityPass = new ShaderPass( LuminosityShader );
composer.addPass( luminosityPass );

//Set how far the camera will be from the 3D model
// camera.position.z = objToRender === "dino" ? 25 : 500;
camera.position.y = objToRender === "halo" ? 300 : 6000;
if (objToRender == "halo") {
  camera.position.y = 6;
  // camera.position.x = 0.5;
  camera.position.z = 140;
}

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 6.5); // (color, intensity)
topLight.position.set(-500, 500, -500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);


const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "halo" ? 5 : 1);
scene.add(ambientLight);

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement
  composer.render();

  //Make the halo move
  if (object && objToRender === "halo") {
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    // object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX / 6;
  mouseY = e.clientY / 6;
}

//Start the 3D rendering
animate();