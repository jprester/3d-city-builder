import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  AssetManager,
  ModelPlacer,
  buildingsCollection,
  type SkyboxOptions,
} from "./models/index.js";

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

  // Initialize AssetManager and ModelPlacer
  const assetManager = new AssetManager();
  const modelPlacer = new ModelPlacer(assetManager);

  // Add skybox first with darker settings
  try {
    const skyboxOptions: SkyboxOptions = {
      darkness: 0.4, // Darken to 40% of original brightness
      opacity: 0.3, // Set opacity to 30%
      transparent: true, // Enable transparency blending
    };

    const skybox = await assetManager.createSkybox(
      "/assets/sky_night.jpg",
      skyboxOptions
    );
    scene.add(skybox);
    console.log("Darkened night sky added to scene");
  } catch (error) {
    console.warn(
      "Failed to load sky texture, using default background:",
      error
    );
    scene.background = new THREE.Color(0x000814); // Dark blue fallback
  }

  // Add lighting for proper material rendering (adjusted for night scene)
  const ambientLight = new THREE.AmbientLight(0x304080, 0.1); // Cooler, dimmer ambient
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x8080ff, 0.1); // Moon-like light
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  // scene.add(directionalLight);

  // Add some warm artificial lighting
  const pointLight = new THREE.PointLight(0xffaa44, 0.8, 10);
  pointLight.position.set(0, 8, 0);
  scene.add(pointLight);

  try {
    // Place all models from the optimized collection
    const placedModels = await modelPlacer.placeModelCollection(
      buildingsCollection,
      scene
    );
    console.log(`Successfully placed ${placedModels.length} models`);

    // Log model stats
    const stats = modelPlacer.getModelStats();
    console.log("Model placement stats:", stats);

    // Log asset manager cache stats
    const cacheStats = assetManager.getCacheStats();
    console.log("Asset cache stats:", cacheStats);
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
      modelPlacer.dispose();
      assetManager.dispose();
      renderer.dispose();
      controls.dispose();
    },
    renderer,
    assetManager,
    modelPlacer,
  };
};
