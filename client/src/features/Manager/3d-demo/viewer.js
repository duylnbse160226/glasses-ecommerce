import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const canvas = document.getElementById('c');
const viewerEl = document.getElementById('viewer');
const loadingEl = document.getElementById('loading');
const loadingTextEl = document.getElementById('loadingText');
const errorEl = document.getElementById('error');

const btnExplore = document.getElementById('btnExplore');
const btnReset = document.getElementById('btnReset');

const state = {
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  modelRoot: null,
  shadowPlane: null,
  shadowGroup: null,
  frame: {
    target: new THREE.Vector3(),
    radius: 1,
    initialCamPos: new THREE.Vector3(),
    initialCamQuat: new THREE.Quaternion(),
    initialTarget: new THREE.Vector3(),
    initialDistance: 1
  },
  resetAnim: {
    active: false,
    t0: 0,
    durationMs: 420,
    fromPos: new THREE.Vector3(),
    fromQuat: new THREE.Quaternion(),
    fromTarget: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    toQuat: new THREE.Quaternion(),
    toTarget: new THREE.Vector3()
  }
};

const MODEL_CANDIDATES = [
  './glasses.glb',
  './Copilot3D-4f8241a0-fa11-4b24-a25c-820bf0d8cb5b.glb'
];

const HDR_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr';

init();

function init() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(viewerEl.clientWidth, viewerEl.clientHeight, false);
  renderer.setClearColor(0xffffff, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  camera.position.set(0, 0, 2.8);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.enablePan = true;
  controls.panSpeed = 0.55;
  controls.rotateSpeed = 0.65;
  controls.zoomSpeed = 0.9;
  controls.minPolarAngle = 0.15 * Math.PI;
  controls.maxPolarAngle = 0.85 * Math.PI;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1.2;

  const lightRig = createLightRig();
  scene.add(lightRig);

  state.renderer = renderer;
  state.scene = scene;
  state.camera = camera;
  state.controls = controls;

  wireUI();
  onResize();
  window.addEventListener('resize', onResize, { passive: true });

  loadEnvironment(scene)
    .then(() => loadModel(scene))
    .then(() => {
      loadingEl.style.display = 'none';
      animate();
    })
    .catch((err) => {
      showError(err);
    });
}

function wireUI() {
  btnExplore.addEventListener('click', () => {
    const pressed = btnExplore.getAttribute('aria-pressed') === 'true';
    const next = !pressed;
    btnExplore.setAttribute('aria-pressed', String(next));
    state.controls.autoRotate = next;
  });

  btnReset.addEventListener('click', () => {
    requestResetView();
  });
}

function createLightRig() {
  const group = new THREE.Group();

  const ambient = new THREE.AmbientLight(0xffffff, 0.15);
  group.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2.6, 4.4, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.03;
  group.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 1.05);
  fill.position.set(-4.6, 2.2, 1.6);
  group.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.55);
  rim.position.set(-1.0, 3.4, -4.8);
  group.add(rim);

  return group;
}

async function loadEnvironment(scene) {
  loadingTextEl.textContent = 'Loading lighting…';

  const pmrem = new THREE.PMREMGenerator(state.renderer);
  pmrem.compileEquirectangularShader();

  const rgbe = new RGBELoader();
  rgbe.setDataType(THREE.HalfFloatType);

  const hdr = await rgbe.loadAsync(HDR_URL);
  const envMap = pmrem.fromEquirectangular(hdr).texture;

  scene.environment = envMap;

  hdr.dispose();
  pmrem.dispose();
}

async function loadModel(scene) {
  loadingTextEl.textContent = 'Loading model…';

  const loader = new GLTFLoader();

  const gltf = await loadFirstWorkingGLB(loader, MODEL_CANDIDATES);

  const root = gltf.scene || gltf.scenes?.[0];
  if (!root) throw new Error('Model loaded but no scene was found in the GLB.');

  root.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;

      const mat = obj.material;
      if (mat && 'envMapIntensity' in mat) {
        mat.envMapIntensity = 1.1;
      }

      if (mat && 'metalness' in mat && 'roughness' in mat) {
        mat.metalness = Math.min(1, mat.metalness);
        mat.roughness = Math.min(1, Math.max(0.04, mat.roughness));
      }
    }
  });

  const shadowGroup = new THREE.Group();
  shadowGroup.position.set(0, 0, 0);
  scene.add(shadowGroup);

  const planeGeo = new THREE.PlaneGeometry(10, 10);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
  const shadowPlane = new THREE.Mesh(planeGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0;
  shadowPlane.receiveShadow = true;
  shadowGroup.add(shadowPlane);

  scene.add(root);

  state.modelRoot = root;
  state.shadowPlane = shadowPlane;
  state.shadowGroup = shadowGroup;

  frameModel(root);
}

async function loadFirstWorkingGLB(loader, urls) {
  let lastError = null;

  for (const url of urls) {
    try {
      const gltf = await loader.loadAsync(url);
      return gltf;
    } catch (e) {
      lastError = e;
    }
  }

  const tried = urls.map((u) => u.replace('./', '')).join(', ');
  const err = new Error(`Failed to load GLB. Tried: ${tried}`);
  err.cause = lastError;
  throw err;
}

function frameModel(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const radius = maxDim * 0.5;

  state.frame.target.copy(center);
  state.frame.radius = Math.max(radius, 0.01);

  if (state.shadowGroup) {
    state.shadowGroup.position.set(center.x, box.min.y - 0.002, center.z);
  }

  state.controls.target.copy(center);
  state.controls.update();

  const fov = THREE.MathUtils.degToRad(state.camera.fov);
  const fitHeightDistance = state.frame.radius / Math.tan(fov * 0.5);
  const fitWidthDistance = fitHeightDistance / state.camera.aspect;
  const distance = 1.25 * Math.max(fitHeightDistance, fitWidthDistance);

  const dir = new THREE.Vector3(0.9, 0.35, 1.0).normalize();
  state.camera.position.copy(center).addScaledVector(dir, distance);
  state.camera.near = Math.max(0.01, distance / 200);
  state.camera.far = Math.max(50, distance * 20);
  state.camera.updateProjectionMatrix();

  state.controls.minDistance = distance * 0.55;
  state.controls.maxDistance = distance * 2.4;

  state.controls.saveState();

  state.frame.initialTarget.copy(state.controls.target);
  state.frame.initialCamPos.copy(state.camera.position);
  state.frame.initialCamQuat.copy(state.camera.quaternion);
  state.frame.initialDistance = distance;
}

function requestResetView() {
  const now = performance.now();
  state.resetAnim.active = true;
  state.resetAnim.t0 = now;

  state.resetAnim.fromPos.copy(state.camera.position);
  state.resetAnim.fromQuat.copy(state.camera.quaternion);
  state.resetAnim.fromTarget.copy(state.controls.target);

  state.resetAnim.toPos.copy(state.frame.initialCamPos);
  state.resetAnim.toQuat.copy(state.frame.initialCamQuat);
  state.resetAnim.toTarget.copy(state.frame.initialTarget);

  state.controls.autoRotate = false;
  btnExplore.setAttribute('aria-pressed', 'false');
}

function updateResetAnimation(now) {
  if (!state.resetAnim.active) return;

  const t = (now - state.resetAnim.t0) / state.resetAnim.durationMs;
  const k = t >= 1 ? 1 : easeInOutCubic(t);

  state.camera.position.lerpVectors(state.resetAnim.fromPos, state.resetAnim.toPos, k);
  THREE.Quaternion.slerp(state.resetAnim.fromQuat, state.resetAnim.toQuat, state.camera.quaternion, k);
  state.controls.target.lerpVectors(state.resetAnim.fromTarget, state.resetAnim.toTarget, k);

  state.camera.updateProjectionMatrix();
  state.controls.update();

  if (t >= 1) {
    state.resetAnim.active = false;
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function onResize() {
  const w = viewerEl.clientWidth;
  const h = viewerEl.clientHeight;

  state.renderer.setSize(w, h, false);

  state.camera.aspect = w / h;
  state.camera.updateProjectionMatrix();
}

function showError(err) {
  loadingEl.style.display = 'none';

  const details = err && err.cause ? `\n\n${String(err.cause)}` : '';
  errorEl.hidden = false;
  errorEl.textContent = `${String(err?.message || err)}${details}`;

  throw err;
}

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  updateResetAnimation(now);

  state.controls.update();
  state.renderer.render(state.scene, state.camera);
}
