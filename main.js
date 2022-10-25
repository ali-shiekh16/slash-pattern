import './style.css';
import * as THREE from 'three';
import camera, { updateCamera } from './camera';
import configs from './configuration';
import renderer, { handleFullScreen, updateRenderer } from './renderer';
import scene from './scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const { sizes } = configs;

/**
 * Main Code
 */

const loader = new THREE.TextureLoader();
const texture = loader.load('/slash.png');

const material = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 5,
  alphaMap: texture,
  depthWrite: false,
  color: new THREE.Color(0xc94c4c),
});

const positions = [];
const rotations = [];

const planeSize = 0.4;
let colsCount;
const rowsCount = (colsCount = 5); // ! Row and column # must be same.
const countSlashes = rowsCount * colsCount;
const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
const slashPattern = new THREE.InstancedMesh(geometry, material, countSlashes);

// ! space between the slashes
const margin = 0.1;

const dummy = new THREE.Object3D();
let rowNo = 1;
for (let i = 0; i < countSlashes; i++) {
  if (i >= rowsCount && !(i % rowsCount)) rowNo++;

  dummy.position.set(
    (i % colsCount) * (planeSize + margin),
    rowNo * (planeSize + margin),
    1
  );
  dummy.rotation.z = Math.random() * Math.PI * 0.1;
  dummy.updateMatrix();
  slashPattern.setMatrixAt(i, dummy.matrix);

  positions.push(new THREE.Vector3().copy(dummy.position));
  rotations.push(dummy.rotation.z);
}

const resetPosition = -planeSize * colsCount * 0.3;
slashPattern.position.set(resetPosition, resetPosition * 2, 0);

scene.add(slashPattern);

// Mouse Move

const mouse = new THREE.Vector2();
function handleMouseMove(event) {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  const dummy = new THREE.Object3D();
  let rowNo = 1;
  for (let i = 0; i < countSlashes; i++) {
    if (i >= rowsCount && !(i % rowsCount)) rowNo++;

    dummy.position.copy(positions[i]);
    dummy.rotation.z = rotations[i] + -mouse.x * (120 * (Math.PI / 180));
    dummy.rotation.z = rotations[i] + -mouse.y * (120 * (Math.PI / 180));
    dummy.updateMatrix();
    slashPattern.setMatrixAt(i, dummy.matrix);
  }

  slashPattern.instanceMatrix.needsUpdate = true;
}

window.addEventListener('mousemove', handleMouseMove);

// Setup
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  updateCamera(sizes.width, sizes.height);
  updateRenderer(sizes.width, sizes.height);
  renderer.render(scene, camera);
});

window.addEventListener('dblclick', handleFullScreen);

const clock = new THREE.Clock();
function animate() {
  const timeElapsed = clock.getElapsedTime();
  renderer.render(scene, camera);
  controls.update();

  requestAnimationFrame(animate);
}

animate();
