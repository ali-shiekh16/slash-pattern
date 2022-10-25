import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const pointsGeometry = new THREE.BufferGeometry();

// const pointsSize = 1;
const pointsSize = 0.45;
const pointsWidth = pointsSize * 0.42;
const pointsColumnsCount = Math.floor(camera.position.z / pointsWidth);

const vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
// const height = 2 * Math.tan(vFOV / 2) * camera.position.z; // * visible height (full screen)
const height = Math.tan(vFOV / 2) * camera.position.z; // * visible height (Half screen)
const width = height * camera.aspect; // visible width

const pointsRowsCount = Math.ceil(height / pointsSize) * 2;

// * Setting positions attribute, positioning points as a matrix.
const positions = new Float32Array(pointsColumnsCount * pointsRowsCount * 3);

let rowCount = 0;
let currentRowIdx = pointsColumnsCount * 3;
for (let i = 0; i < positions.length; i++) {
  const i3 = i * 3;
  positions[i3] = -5 + (i % pointsColumnsCount) * pointsWidth;
  if (!(i % 3) && i >= currentRowIdx) {
    positions[i + 1] =
      -(pointsWidth * pointsRowsCount) / 2 + rowCount * pointsWidth;
  }

  if (i && !((i / 3) % pointsColumnsCount)) {
    currentRowIdx = i;
    rowCount++;
  }
}

pointsGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions, 3)
);

const loader = new THREE.TextureLoader();
const texture = loader.load('/slash.png');

const pointsMaterial = new THREE.ShaderMaterial({
  depthWrite: false,
  vertexShader,
  fragmentShader,
  transparent: true,
  uniforms: {
    uSize: { value: pointsSize * 300 },
    uTexture: { value: texture },
    uTime: { value: 0 },
    // uCursor: { value: new THREE.Vector3() },
    uCursor: { value: new THREE.Vector2() },
    uRotationMatrix: {
      value: new THREE.Matrix4().makeRotationZ(0),
    },
  },
});

const points = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(points);

const mouse = new THREE.Vector2();
function handleMouseMove(event) {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
  // mouse.z = 1;

  // pointsMaterial.uniforms.uCursor.value = mouse;
  // pointsMaterial.uniforms.uRotationMatrix.value =
  //   new THREE.Matrix4().makeRotationZ(Math.PI * 2 * mouse.x);
  // new THREE.Matrix4().makeRotationZ(Math.PI * 2 * mouse.y);

  // * convert screen coordinates to threejs world position
  // https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z

  // var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  // vector.unproject(camera);
  // var dir = vector.sub(camera.position).normalize();
  // var distance = -camera.position.z / dir.z;
  // var pos = camera.position.clone().add(dir.multiplyScalar(distance));

  // mouse = pos;
}

window.addEventListener('mousemove', handleMouseMove);
