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
import {
  setupPostProcessing,
  enhanceMaterialsForBloom,
} from "./utils/postProcessingUtils.js";
import {
  getEffectConfiguration,
  type EffectMode,
} from "./utils/effectsConfig.js";
import { colors } from "./utils/constants.js";

export const initThreeScene = async (container: HTMLDivElement) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Get effect configuration - Change this line to switch modes:
  // 'none' = No effects, standard lighting
  // 'light' = Subtle bloom and colorful lights (DEFAULT)
  // 'heavy' = Full cyberpunk effects with animation
  const effectMode: EffectMode = "light"; // Change to 'light' or 'heavy' for different effects
  const effectConfig = getEffectConfiguration(effectMode);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = effectConfig.renderer.toneMappingExposure;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Setup post-processing for cyberpunk effects
  // We'll initialize post-processing after scene setup

  const controls = new OrbitControls(camera, renderer.domElement);

  // Initialize AssetManager and ModelPlacer
  const assetManager = new AssetManager();
  const modelPlacer = new ModelPlacer(assetManager);

  // Setup environment (lighting and sky texture)
  await setupEnvironment(
    scene,
    assetManager,
    effectConfig,
    "/assets/sky_night.jpg",
    { darkness: 0.2 }
  );

  // Add ground plane with custom emissive configuration
  // You can override the ground plane's emissive properties here:
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
    const material = new THREE.MeshStandardMaterial({
      color: colors.limeGreen,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }

  // Initialize post-processing after all scene elements are added
  const postProcessing = setupPostProcessing(
    renderer,
    scene,
    camera,
    effectConfig
  );

  // // Enhance materials for better bloom interaction (only if post-processing is enabled)
  if (effectConfig.postProcessing.enabled) {
    enhanceMaterialsForBloom(scene);
  }

  camera.position.z = 5;

  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    postProcessing.onWindowResize();
  };
  window.addEventListener("resize", handleResize);

  function animate() {
    controls.update(); // Update controls

    // Render with or without post-processing based on configuration
    postProcessing.render(renderer, scene, camera);
  }

  renderer.setAnimationLoop(animate);

  return {
    cleanup: () => {
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      postProcessing.dispose();
      modelPlacer.dispose();
      assetManager.dispose();
      renderer.dispose();
      controls.dispose();
    },
    renderer,
    assetManager,
    modelPlacer,
    postProcessing,
  };
};
