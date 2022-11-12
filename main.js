import './style.css';
import * as THREE from 'three';
import camera, { updateCamera } from './camera';
import configs from './configuration';
import renderer, { handleFullScreen, updateRenderer } from './renderer';
import scene from './scene';

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

// const planeSize = 0.4;
// let colsCount;
// const rowsCount = (colsCount = 5); // ! Row and column # must be same.
// const countSlashes = rowsCount * colsCount;
// const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
// const slashPattern = new THREE.InstancedMesh(geometry, material, countSlashes);
// ! space between the slashes
// const margin = 0.1;
// const dummy = new THREE.Object3D();
// let rowNo = 1;
// for (let i = 0; i < countSlashes; i++) {
//   if (i >= rowsCount && !(i % rowsCount)) rowNo++;
//   dummy.position.set(
//     (i % colsCount) * (planeSize + margin),
//     rowNo * (planeSize + margin),
//     1
//   );
//   dummy.updateMatrix();
//   slashPattern.setMatrixAt(i, dummy.matrix);
//   positions.push(new THREE.Vector3().copy(dummy.position));
// }
// const resetPosition = -planeSize * colsCount * 0.3;
// slashPattern.position.set(resetPosition, resetPosition * 2, 0);
// scene.add(slashPattern);

// Mouse Move

const rowsCount = 20;
const colsCount = 20;
const size = 0.3;
const planesCount = rowsCount * colsCount;
const planes = new THREE.InstancedMesh(
  new THREE.PlaneBufferGeometry(size, size),
  material,
  // new THREE.MeshBasicMaterial({ color: 0xc94c4c, side: THREE.DoubleSide }),
  planesCount
);

const positions = [];
const dummy = new THREE.Object3D();
const margin = 0.1;

let rowNo = 1;
for (let i = 0; i < planesCount; i++) {
  if (i >= rowsCount && !(i % rowsCount)) rowNo++;
  dummy.position.set(
    (i % colsCount) * (size + margin) - 3,
    rowNo * (size + margin) - 2,
    1
  );

  positions.push(new THREE.Vector3().copy(dummy.position));

  dummy.updateMatrix();
  planes.setMatrixAt(i, dummy.matrix);
}

scene.add(planes);

const mouse = new THREE.Vector2();
var vec = new THREE.Vector3(); // create once and reuse
var pos = new THREE.Vector3(); // create once and reuse
function handleMouseMove(event) {
  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;
  mouse.x = (clientX / sizes.width) * 2 - 1;
  mouse.y = -(clientY / sizes.height) * 2 + 1;

  vec.set(mouse.x, mouse.y, 0.5);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  var distance = -camera.position.z / vec.z;
  pos.copy(camera.position).add(vec.multiplyScalar(distance));

  const dummy = new THREE.Object3D();
  for (let i = 0; i < planesCount; i++) {
    dummy.position.copy(positions[i]);
    const angle = Math.atan2(pos.y - positions[i].y, pos.x - positions[i].x);
    dummy.rotation.z = angle;
    dummy.updateMatrix();
    planes.setMatrixAt(i, dummy.matrix);
  }
  planes.instanceMatrix.needsUpdate = true;
}

window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('touchmove', handleMouseMove);

// Setup
renderer.render(scene, camera);

// const controls = new OrbitControls(camera, renderer.domElement);

// window.addEventListener('resize', () => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   updateCamera(sizes.width, sizes.height);
//   updateRenderer(sizes.width, sizes.height);
//   renderer.render(scene, camera);
// });

// window.addEventListener('dblclick', handleFullScreen);

const clock = new THREE.Clock();
function animate() {
  const timeElapsed = clock.getElapsedTime();
  renderer.render(scene, camera);
  // controls.update();

  requestAnimationFrame(animate);
}

animate();
