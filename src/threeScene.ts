import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  AssetManager,
  ModelPlacer,
  buildingsCollection,
  type SkyTextureOptions,
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

  // Set sky texture as scene background
  try {
    const skyTextureOptions: SkyTextureOptions = {
      darkness: 0.05, // Darken to 40% of original brightness
    };

    const skyTexture = await assetManager.createSkyBackground(
      "/assets/sky_night.jpg",
      skyTextureOptions
    );
    scene.background = skyTexture;
    console.log("Sky texture set as scene background");
  } catch (error) {
    console.warn(
      "Failed to load sky texture, using default background:",
      error
    );
    scene.background = new THREE.Color(0x000814); // Dark blue fallback
  }

  // Add lighting for proper material rendering (adjusted for night scene)
  const ambientLight = new THREE.AmbientLight(0x304080, 0.2); // Cooler, dimmer ambient
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x8080ff, 0.2); // Moon-like light
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Add some warm artificial lighting
  const pointLight = new THREE.PointLight(0xffaa44, 0.8, 10);
  pointLight.position.set(0, 8, 0);
  scene.add(pointLight);

  // Add ground plane
  try {
    const groundTextures = await assetManager.loadTextures({
      base: "/assets/textures/ground.jpg",
      emissive: "/assets/textures/ground_em.jpg",
    });

    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: groundTextures.base,
      emissiveMap: groundTextures.emissive,
      emissive: new THREE.Color(0x202020),
      emissiveIntensity: 1.1,
    });

    if (groundTextures.base) {
      groundTextures.base.wrapS = THREE.RepeatWrapping;
      groundTextures.base.wrapT = THREE.RepeatWrapping;
      groundTextures.base.repeat.set(10, 10);
    }

    if (groundTextures.emissive) {
      groundTextures.emissive.wrapS = THREE.RepeatWrapping;
      groundTextures.emissive.wrapT = THREE.RepeatWrapping;
      groundTextures.emissive.repeat.set(10, 10);
    }

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = -0.5; // Position slightly below origin
    ground.receiveShadow = true;
    ground.scale.set(30, 30, 30); // Scale to fit scene
    ground.name = "GroundPlane"; // Set name for easier identification
    scene.add(ground);

    console.log("Ground plane added to scene");
  } catch (error) {
    console.warn("Failed to load ground textures:", error);
    // Fallback ground without textures
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);
    console.log("Fallback ground plane added to scene");
  }

  try {
    // Test both regular and instanced collections
    console.log("=== Testing Regular Models ===");
    const placedModels = await modelPlacer.placeModelCollection(
      buildingsCollection,
      scene
    );
    console.log(`Successfully placed ${placedModels.length} regular models`);

    // console.log("=== Testing Instanced Models ===");
    // const instancedModels = await modelPlacer.placeInstancedCollection(
    //   massResidentialCollection,
    //   scene
    // );
    // console.log(
    //   `Successfully created ${instancedModels.length} instanced model groups`
    // );

    // Log comprehensive stats
    const regularStats = modelPlacer.getModelStats();
    const instanceStats = modelPlacer.getInstanceStats();
    const cacheStats = assetManager.getCacheStats();

    console.log("=== Performance Comparison ===");
    console.log("Regular models:", regularStats);
    console.log("Instanced models:", instanceStats);
    console.log("Asset cache:", cacheStats);
    console.log(
      `Total objects in scene: ${
        regularStats.totalModels + instanceStats.totalInstances
      }`
    );
    console.log(
      `Memory efficiency: ${instanceStats.totalGroups} draw calls for ${instanceStats.totalInstances} instances`
    );
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
