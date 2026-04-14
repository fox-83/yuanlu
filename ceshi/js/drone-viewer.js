import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('viewer-container');
const status = document.getElementById('status');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f4fb);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.4);
light.position.set(0, 1, 0);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

const grid = new THREE.GridHelper(10, 20, 0x888888, 0xdadada);
scene.add(grid);

const loader = new GLTFLoader();
const modelPath = 'assets/drone.gltf';
let propellers = [];

loader.load(
  modelPath,
  gltf => {
    const model = gltf.scene;
    scene.add(model);

    propellers = findPropellers(model);
    if (propellers.length === 0) {
      status.textContent = '已加载模型，但未找到螺旋桨节点，请检查模型节点名称。';
      console.warn('未找到螺旋桨节点，当前模型节点列表：');
      model.traverse(node => { if (node.name) console.log(node.name); });
    } else {
      status.textContent = `已加载模型，并找到 ${propellers.length} 个螺旋桨节点。`;
    }

    fitCamera(model);
  },
  xhr => {
    if (xhr.total) {
      status.textContent = `加载中：${Math.round((xhr.loaded / xhr.total) * 100)}%`;
    }
  },
  error => {
    status.textContent = '模型加载失败，请确认文件已放到 assets/drone.gltf。';
    console.error(error);
  }
);

function findPropellers(root) {
  const results = [];
  root.traverse(node => {
    if (!node.name) return;
    const name = node.name.toLowerCase();
    if (name.includes('prop') || name.includes('螺旋') || name.includes('blade') || name.includes('rotor') || name.includes('桨')) {
      results.push(node);
    }
  });
  return results;
}

function fitCamera(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  cameraZ *= 1.5;

  camera.position.set(center.x, center.y + maxDim * 0.2, center.z + cameraZ);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}

function animate() {
  requestAnimationFrame(animate);

  if (propellers.length > 0) {
    propellers.forEach(node => {
      node.rotation.z += 0.25;
    });
  }

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onResize);
animate();
