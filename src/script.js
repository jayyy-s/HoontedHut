import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.webp");
const floorColorTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_diffuse_1k.webp"
);
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floorARMTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_arm_1k.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_nor_gl_1k.webp"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/forest_leaves_02_1k/forest_leaves_02_disp_1k.webp"
);

floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(8, 8);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
const wallColorTexture = textureLoader.load(
  "./wall/brick_wall_08_1k/brick_wall_08_diff_1k.webp"
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallARMTexture = textureLoader.load(
  "./wall/brick_wall_08_1k/brick_wall_08_arm_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "./wall/brick_wall_08_1k/brick_wall_08_nor_gl_1k.webp"
);

// Roof
const roofColorTexture = textureLoader.load(
  "./roof/roof_tiles_14_1k/roof_tiles_14_diff_1k.webp"
);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofARMTexture = textureLoader.load(
  "./roof/roof_tiles_14_1k/roof_tiles_14_arm_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "./roof/roof_tiles_14_1k/roof_tiles_14_nor_gl_1k.webp"
);

roofColorTexture.repeat.set(5, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;

roofARMTexture.repeat.set(5, 1);
roofARMTexture.wrapS = THREE.RepeatWrapping;

roofNormalTexture.repeat.set(5, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load(
  "./bush/forest_leaves_03_1k/forest_leaves_03_diff_1k.webp"
);
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
const bushARMTexture = textureLoader.load(
  "./bush/forest_leaves_03_1k/forest_leaves_03_arm_1k.webp"
);
const bushNormalTexture = textureLoader.load(
  "./bush/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.webp"
);

bushColorTexture.repeat.set(2, 1);
bushColorTexture.wrapS = THREE.RepeatWrapping;

bushARMTexture.repeat.set(2, 1);
bushARMTexture.wrapS = THREE.RepeatWrapping;

bushNormalTexture.repeat.set(2, 1);
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load(
  "./grave/concrete_wall_006_1k/concrete_wall_006_diff_1k.webp"
);
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
const graveARMTexture = textureLoader.load(
  "./grave/concrete_wall_006_1k/concrete_wall_006_arm_1k.webp"
);
const graveNormalTexture = textureLoader.load(
  "./grave/concrete_wall_006_1k/concrete_wall_006_nor_gl_1k.webp"
);

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load("./door/color.webp");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load("./door/height.webp");
const doorNormalTexture = textureLoader.load("./door/normal.webp");
const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.2,
    displacementBias: -0.06,
  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacement");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

// House group
const house = new THREE.Group();
scene.add(house);

// House walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
    map: wallColorTexture,
  })
);
walls.position.y += 1.25;
house.add(walls);

// House roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
    map: roofColorTexture,
  })
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// House door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
house.add(bush1, bush2, bush3, bush4);
bush4.rotation.x = -0.75;

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

// Make 30 graves
for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const graveZ = Math.cos(angle) * radius;
  const graveX = Math.sin(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = graveX;
  grave.position.z = graveZ;
  grave.position.y = Math.random() * 0.4;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
debugObject.lightColor = "#86cdff";

const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

gui.addColor(debugObject, "lightColor").onChange(() => {
  console.log(debugObject.color);
  ambientLight.color = new THREE.Color(debugObject.lightColor);
  directionalLight.color = new THREE.Color(debugObject.lightColor);
});

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight(0x8800ff, 6);
const ghost2 = new THREE.PointLight(0xff0088, 6);
const ghost3 = new THREE.PointLight(0xff0000, 6);
scene.add(ghost1, ghost2, ghost3);
2;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 6;
camera.position.y = 2.5;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

graves.children.map((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;

// Keep camera window a square
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

// Sky
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

// Fog
// scene.fog = new THREE.Fog(0x02343f, 1, 13);
scene.fog = new THREE.FogExp2(0x02343f, 0.1);

// Sounds
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.PositionalAudio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load("./sounds/creepy-lullaby.wav", function (buffer) {
  sound.setBuffer(buffer);
  sound.setRefDistance(1);
  sound.setMaxDistance(20);
  sound.setLoop(true);
  sound.setVolume(0.1);
  sound.play();
});
house.add(sound);

debugObject.refDistance = 1;
debugObject.maxDistance = 20;
gui.add(debugObject, "refDistance").min(0).max(2).step(0.01);
gui.add(debugObject, "maxDistance").min(1).max(100).step(1).onChange(() => {
  sound.setMaxDistance(debugObject.maxDistance);
});

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Animate ghost
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(2.34 * ghost1Angle) *
    Math.sin(3.45 * ghost1Angle);

  const ghost2Angle = -elapsedTime * 0.35;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(2.34 * ghost2Angle) *
    Math.sin(3.45 * ghost2Angle);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(2.34 * ghost3Angle) *
    Math.sin(3.45 * ghost3Angle);

  // Flicker light
  doorLight.intensity =
    2 *
    Math.abs(
      Math.sin(elapsedTime) *
        Math.sin(elapsedTime * 8) *
        Math.sin(elapsedTime * 2)
    );

  // Volume based on distance to house

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

gui.hide();
window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    // toggle using the _hidden property which is true or false
    gui.show(gui._hidden);
  }
});
