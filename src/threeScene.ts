import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AssetManager } from "./AssetManager.js";

export function logMemoryUsage(renderer: THREE.WebGLRenderer) {
  const info = renderer.info;

  console.log("Memory Info:", {
    geometries: info.memory.geometries,
    textures: info.memory.textures,
    programs: info.programs?.length || 0,
    calls: info.render.calls,
    triangles: info.render.triangles,
    points: info.render.points,
    lines: info.render.lines,
  });
}

export const initThreeScene = async (container: HTMLDivElement) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  // Add lighting for proper material rendering
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Initialize AssetManager and load a test model
  const assetManager = new AssetManager();

  try {
    // Load the existing GLB model
    const glbModel = await assetManager.loadModel(
      "/assets/models/high-rise-building.glb"
    );
    glbModel.model.position.set(50, 0, 0);
    scene.add(glbModel.model);

    // Load OBJ model with textures
    const objModel = await assetManager.loadModel(
      "/assets/models/s_01_01.obj",
      {
        base: "/assets/textures/building_01.jpg",
        specular: "/assets/textures/building_01_spec.jpg",
        roughness: "/assets/textures/building_01_rough.jpg",
        emissive: "/assets/textures/building_01_em.jpg",
      }
    );
    objModel.model.position.set(2, 0, 0);
    objModel.model.scale.set(0.5, 0.5, 0.5);
    scene.add(objModel.model);
  } catch (error) {
    console.error("Failed to load models:", error);
    // Fallback to basic geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }

  camera.position.z = 5;

  function animate() {
    controls.update(); // Update controls

    renderer.render(scene, camera);
  }

  return {
    cleanup: () => {
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      assetManager.dispose();
      renderer.dispose();
      controls.dispose();
    },
    renderer,
    assetManager,
  };
};
