import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  AssetManager,
  ModelPlacer,
  // buildingsCollection,
  residentialBlockCollection,
} from "./models/index.js";
import {
  addHumanReferenceModel,
  createGroundPlane,
} from "./utils/helperFunctions.js";
import { setupEnvironment } from "./utils/environmentUtils.js";

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

  // Setup environment (lighting and sky texture)
  await setupEnvironment(
    scene,
    assetManager,
    "/assets/sky_night.jpg",
    { darkness: 0.05 }
  );

  // Add ground plane
  await createGroundPlane(scene, assetManager);

  // Add human reference for scale comparison
  addHumanReferenceModel(scene);

  try {
    // Test both regular and instanced collections
    console.log("=== Testing Grouped Models ===");
    const { group: residentialGroup1, models: placedModels } =
      await modelPlacer.placeModelCollectionAsGroup(
        residentialBlockCollection,
        scene,
        { x: 0, y: 0, z: 0 } // Position the entire block
      );
    console.log(`Successfully placed ${placedModels.length} models in group`);
    residentialGroup1.position.set(0, 0, 0); // Move group to a new position

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
