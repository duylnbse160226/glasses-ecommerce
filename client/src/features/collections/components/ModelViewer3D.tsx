import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Box, IconButton, Button, Typography, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";

const HDR_URL = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr";

type ModelViewer3DProps = {
  open: boolean;
  onClose: () => void;
  modelUrl: string;
  productName?: string;
};

export default function ModelViewer3D({ open, onClose, modelUrl, productName }: ModelViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    controls: OrbitControls | null;
    frameId: number;
    initialCamPos: THREE.Vector3;
    initialTarget: THREE.Vector3;
    initialCamQuat: THREE.Quaternion;
    resetAnim: {
      active: boolean;
      t0: number;
      durationMs: number;
      fromPos: THREE.Vector3;
      fromQuat: THREE.Quaternion;
      fromTarget: THREE.Vector3;
      toPos: THREE.Vector3;
      toQuat: THREE.Quaternion;
      toTarget: THREE.Vector3;
    };
  }>({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    frameId: 0,
    initialCamPos: new THREE.Vector3(),
    initialTarget: new THREE.Vector3(),
    initialCamQuat: new THREE.Quaternion(),
    resetAnim: {
      active: false,
      t0: 0,
      durationMs: 420,
      fromPos: new THREE.Vector3(),
      fromQuat: new THREE.Quaternion(),
      fromTarget: new THREE.Vector3(),
      toPos: new THREE.Vector3(),
      toQuat: new THREE.Quaternion(),
      toTarget: new THREE.Vector3(),
    },
  });

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading 3D…");
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  const handleResetView = useCallback(() => {
    const s = stateRef.current;
    if (!s.camera || !s.controls) return;

    s.resetAnim.active = true;
    s.resetAnim.t0 = performance.now();
    s.resetAnim.fromPos.copy(s.camera.position);
    s.resetAnim.fromQuat.copy(s.camera.quaternion);
    s.resetAnim.fromTarget.copy(s.controls.target);
    s.resetAnim.toPos.copy(s.initialCamPos);
    s.resetAnim.toQuat.copy(s.initialCamQuat);
    s.resetAnim.toTarget.copy(s.initialTarget);

    setAutoRotate(false);
    if (s.controls) s.controls.autoRotate = false;
  }, []);

  const handleToggleExplore = useCallback(() => {
    setAutoRotate((prev) => {
      const next = !prev;
      if (stateRef.current.controls) stateRef.current.controls.autoRotate = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const s = stateRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setClearColor(0xffffff, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    s.renderer = renderer;

    // Scene
    const scene = new THREE.Scene();
    s.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.01, 100);
    camera.position.set(0, 0, 2.8);
    s.camera = camera;

    // Controls
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
    s.controls = controls;

    // Lights
    const lightRig = new THREE.Group();
    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    lightRig.add(ambient);

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
    lightRig.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 1.05);
    fill.position.set(-4.6, 2.2, 1.6);
    lightRig.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.55);
    rim.position.set(-1.0, 3.4, -4.8);
    lightRig.add(rim);

    scene.add(lightRig);

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Animation loop
    let disposed = false;
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const animate = () => {
      if (disposed) return;
      s.frameId = requestAnimationFrame(animate);

      // Reset animation
      if (s.resetAnim.active && s.camera && s.controls) {
        const now = performance.now();
        const t = (now - s.resetAnim.t0) / s.resetAnim.durationMs;
        const k = t >= 1 ? 1 : easeInOutCubic(t);
        s.camera.position.lerpVectors(s.resetAnim.fromPos, s.resetAnim.toPos, k);
        s.camera.quaternion.slerpQuaternions(s.resetAnim.fromQuat, s.resetAnim.toQuat, k);
        s.controls.target.lerpVectors(s.resetAnim.fromTarget, s.resetAnim.toTarget, k);
        s.camera.updateProjectionMatrix();
        s.controls.update();
        if (t >= 1) s.resetAnim.active = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    // Frame model helper
    const frameModel = (root: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(root);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const radius = Math.max(maxDim * 0.5, 0.01);

      // Shadow plane
      const planeGeo = new THREE.PlaneGeometry(10, 10);
      const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
      const shadowPlane = new THREE.Mesh(planeGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.set(center.x, box.min.y - 0.002, center.z);
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      controls.target.copy(center);
      controls.update();

      const fov = THREE.MathUtils.degToRad(camera.fov);
      const fitHeightDistance = radius / Math.tan(fov * 0.5);
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = 1.25 * Math.max(fitHeightDistance, fitWidthDistance);

      const dir = new THREE.Vector3(0.9, 0.35, 1.0).normalize();
      camera.position.copy(center).addScaledVector(dir, distance);
      camera.near = Math.max(0.01, distance / 200);
      camera.far = Math.max(50, distance * 20);
      camera.updateProjectionMatrix();

      controls.minDistance = distance * 0.55;
      controls.maxDistance = distance * 2.4;
      controls.saveState();

      s.initialTarget.copy(controls.target);
      s.initialCamPos.copy(camera.position);
      s.initialCamQuat.copy(camera.quaternion);
    };

    // Load environment + model
    (async () => {
      try {
        setLoadingText("Loading lighting…");
        const pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        const rgbe = new RGBELoader();
        rgbe.setDataType(THREE.HalfFloatType);
        const hdr = await rgbe.loadAsync(HDR_URL);
        const envMap = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envMap;
        hdr.dispose();
        pmrem.dispose();

        setLoadingText("Loading model…");
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelUrl);
        const root = gltf.scene || gltf.scenes?.[0];
        if (!root) throw new Error("Model loaded but no scene found in the GLB.");

        root.traverse((obj: THREE.Object3D) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && "envMapIntensity" in mat) {
              (mat as any).envMapIntensity = 1.1;
            }
            if (mat && "metalness" in mat && "roughness" in mat) {
              mat.metalness = Math.min(1, mat.metalness);
              mat.roughness = Math.min(1, Math.max(0.04, mat.roughness));
            }
          }
        });

        scene.add(root);
        frameModel(root);
        setLoading(false);
        animate();
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(s.frameId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      s.renderer = null;
      s.scene = null;
      s.camera = null;
      s.controls = null;
    };
  }, [open, modelUrl]);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "#ffffff",
          minHeight: 56,
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 15, color: "#121212" }}>
          {productName ? `${productName} — 3D View` : "3D View"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#121212" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Viewer */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {/* Loading overlay */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              bgcolor: "#ffffff",
            }}
          >
            <CircularProgress size={36} sx={{ color: "rgba(0,0,0,0.35)" }} />
            <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
              {loadingText}
            </Typography>
          </Box>
        )}

        {/* Error overlay */}
        {error && (
          <Box
            sx={{
              position: "absolute",
              left: 18,
              bottom: 18,
              maxWidth: "min(560px, calc(100% - 36px))",
              p: 2,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.1)",
              bgcolor: "rgba(255,255,255,0.96)",
              color: "rgba(0,0,0,0.8)",
              fontSize: 13,
              lineHeight: 1.35,
              boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
            }}
          >
            {error}
          </Box>
        )}

        {/* Controls panel (right side) */}
        {!loading && !error && (
          <Box
            sx={{
              position: "absolute",
              top: 18,
              right: 18,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<ThreeSixtyIcon />}
              onClick={handleToggleExplore}
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.02em",
                borderRadius: 999,
                borderColor: "rgba(0,0,0,0.1)",
                color: autoRotate ? "#B68C5A" : "#0b0b0b",
                bgcolor: autoRotate ? "rgba(182,140,90,0.08)" : "rgba(255,255,255,0.92)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                px: 2,
                py: 1,
                "&:hover": {
                  bgcolor: autoRotate ? "rgba(182,140,90,0.12)" : "rgba(255,255,255,0.98)",
                  boxShadow: "0 12px 36px rgba(0,0,0,0.1)",
                  borderColor: "rgba(0,0,0,0.15)",
                },
              }}
            >
              Explore
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={handleResetView}
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.02em",
                borderRadius: 999,
                borderColor: "rgba(0,0,0,0.1)",
                color: "#0b0b0b",
                bgcolor: "rgba(255,255,255,0.92)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                px: 2,
                py: 1,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.98)",
                  boxShadow: "0 12px 36px rgba(0,0,0,0.1)",
                  borderColor: "rgba(0,0,0,0.15)",
                },
              }}
            >
              Reset View
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
