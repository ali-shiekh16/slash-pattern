import { PerspectiveCamera, OrthographicCamera } from 'three';
import configs from './configuration';

const { width, height } = configs.sizes;

const camera = new PerspectiveCamera(45, width / height);
camera.position.setZ(5);

function updateCamera(width, height) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

export default camera;
export { updateCamera };
