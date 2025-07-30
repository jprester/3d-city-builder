import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  AssetManager,
  ModelPlacer,
  residentialAndCommercialBlockCollection,
  // buildingsCollection,
  residentialBlockCollection,
} from "./models/index.js";
import {
  addHumanReferenceModel,
  createGroundPlane,
  createGroundTiles,
  getGroundTileByName,
} from "./utils/helperFunctions.js";
import { setupEnvironment } from "./utils/environmentUtils.js";
import {
  setupPostProcessing,
  enhanceMaterialsForBloom,
} from "./utils/postProcessingUtils.js";
import {
  addSkyscraperRoofLights,
  animateRoofLights,
} from "./utils/windowLightingUtils.js";
import {
  getEffectConfiguration,
  type EffectMode,
  DEFAULT_EFFECT_MODE,
} from "./utils/effectsConfig.js";
import { colors } from "./utils/constants.js";
import {
  commercialBlockCollection1,
  commercialBlockCollection2,
  industrialBlockCollection,
  mixedUseBlockCollection1,
  mixedUseBlockCollection2,
} from "./models/collections/building-collections.js";

export const initThreeScene = async (container: HTMLDivElement) => {
  const scene = new THREE.Scene();

  // Get effect configuration - Change this line to switch modes:
  // 'none' = No effects, standard lighting
  // 'light' = Subtle bloom and colorful lights (DEFAULT)
  // 'heavy' = Full cyberpunk effects with animation
  const effectMode: EffectMode = DEFAULT_EFFECT_MODE; // Change to 'none', 'light' or 'heavy' for different effects
  const effectConfig = getEffectConfiguration(effectMode);

  if (effectMode === "none") {
    // Add axes helper for coordinate system guide
    const axesHelper = new THREE.AxesHelper(300); // The number represents the size of the axes
    scene.add(axesHelper);
  }

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = effectConfig.renderer.toneMappingExposure;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Setup post-processing for cyberpunk effects
  // We'll initialize post-processing after scene setup

  const controls = new OrbitControls(camera, renderer.domElement);

  // Store initial camera position for reset functionality
  const initialCameraPosition = { x: 0, y: 0, z: 5 };
  const initialControlsTarget = { x: 0, y: 0, z: 0 };

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

  createGroundTiles(
    scene,
    [
      {
        name: "tile-1",
        size: { width: 250, depth: 250 },
        position: { x: -150, y: 0, z: -150 },
        color: colors.darkIndigo,
        emissive: colors.electricBlue,
        emissiveIntensity: 0.8, // Testing HMR - should see bright blue glow!
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(0, 50, 100, 0.9)", // More opaque to test HMR
          height: 1,
        },
      },
      {
        name: "tile-2",
        size: { width: 250, depth: 250 },
        position: { x: -150, y: 0, z: 150 },
        color: colors.veryDarkGrey,
        emissive: colors.neonGreen,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(0, 100, 50, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-3",
        size: { width: 250, depth: 250 },
        position: { x: 150, y: 0, z: 150 },
        color: colors.darkRed,
        emissive: colors.vermilion,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(100, 20, 20, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-4",
        size: { width: 250, depth: 250 },
        position: { x: 150, y: 0, z: -150 },
        color: colors.darkerGrey,
        emissive: colors.hotPink,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(100, 20, 80, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-5",
        size: { width: 250, depth: 250 },
        position: { x: 150, y: 0, z: -450 },
        color: colors.veryDarkBlue,
        emissive: colors.cyan,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(0, 80, 100, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-6",
        size: { width: 250, depth: 250 },
        position: { x: -150, y: 0, z: -450 },
        color: colors.darkGrey,
        emissive: colors.canaryYellow,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#000000",
          backgroundColor: "rgba(200, 200, 0, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-7",
        size: { width: 250, depth: 250 },
        position: { x: -450, y: 0, z: -150 },
        color: colors.neonGreen,
        emissive: colors.neonGreen,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(80, 20, 100, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-8",
        size: { width: 250, depth: 250 },
        position: { x: -450, y: 0, z: 150 },
        color: colors.veryDarkGrey,
        emissive: colors.orangeYellow,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#000000",
          backgroundColor: "rgba(200, 150, 0, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-9",
        size: { width: 250, depth: 250 },
        position: { x: -450, y: 0, z: -450 },
        color: colors.darkRed,
        emissive: colors.mediumNeonGreen,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(0, 150, 0, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-10",
        size: { width: 250, depth: 250 },
        position: { x: 450, y: 0, z: 150 },
        color: colors.darkerGrey,
        emissive: colors.skyBlue,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 150,
          textColor: "#ffffff",
          backgroundColor: "rgba(50, 150, 200, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-11",
        size: { width: 250, depth: 250 },
        position: { x: 450, y: 0, z: -150 },
        color: colors.veryDarkBlue,
        emissive: colors.goldenYellow,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 150,
          textColor: "#000000",
          backgroundColor: "rgba(255, 215, 0, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-12",
        size: { width: 250, depth: 250 },
        position: { x: 450, y: 0, z: -450 },
        color: colors.darkGrey,
        emissive: colors.purple,
        emissiveIntensity: 0.2,
        showLabel: true,
        labelOptions: {
          fontSize: 150,
          textColor: "#ffffff",
          backgroundColor: "rgba(128, 0, 128, 0.8)",
          height: 1,
        },
      },
      {
        name: "tile-13",
        size: { width: 250, depth: 250 },
        position: { x: 0, y: 0, z: -950 },
        color: colors.darkIndigo,
        emissive: colors.electricBlue,
        emissiveIntensity: 0.8, // Testing HMR - should see bright blue glow!
        showLabel: true,
        labelOptions: {
          fontSize: 160,
          textColor: "#ffffff",
          backgroundColor: "rgba(0, 50, 100, 0.9)", // More opaque to test HMR
          height: 1,
        },
      },
    ],
    effectMode !== "none" // Hide tiles if no effects are enabled
  );

  // Add human reference for scale comparison
  addHumanReferenceModel(scene);

  try {
    const tile1Placement = getGroundTileByName(scene, "tile-1");
    if (tile1Placement) {
      await modelPlacer.placeModelCollectionAsGroup(
        industrialBlockCollection,
        scene,
        tile1Placement.position // Position the entire block on tile-1
      );
    }
    // Test both regular and instanced collections
    console.log("=== Testing Grouped Models ===");
    const tile2Placement = getGroundTileByName(scene, "tile-2");
    if (tile2Placement) {
      await modelPlacer.placeModelCollectionAsGroup(
        residentialAndCommercialBlockCollection,
        scene,
        tile2Placement.position // Position the entire block on tile-2
      );
    }

    const tile6Placement = getGroundTileByName(scene, "tile-6");
    if (tile6Placement) {
      await modelPlacer.placeModelCollectionAsGroup(
        commercialBlockCollection1,
        scene,
        tile6Placement.position // Position the entire block on tile-8
      );
    }

    const tile4Placement = getGroundTileByName(scene, "tile-4");
    if (tile4Placement) {
      await modelPlacer.placeModelCollectionAsGroup(
        commercialBlockCollection2,
        scene,
        tile4Placement.position // Position the entire block on tile-4
      );
    }

    const tile5Placement = getGroundTileByName(scene, "tile-5");
    if (tile5Placement) {
      await modelPlacer.placeModelCollectionAsGroup(
        commercialBlockCollection2,
        scene,
        tile5Placement.position // Position the entire block on tile-5
      );
    }

    const tile12Placement = getGroundTileByName(scene, "tile-12");
    if (tile12Placement) {
      await modelPlacer.placeModelCollectionAsGroup(
        mixedUseBlockCollection1,
        scene,
        tile12Placement.position // Position the entire block on tile-10
      );
    }

    const tile9Placement = getGroundTileByName(scene, "tile-9");
    if (tile9Placement) {
      await modelPlacer.placeModelCollectionAsGroup(
        mixedUseBlockCollection2,
        scene,
        tile9Placement.position // Position the entire block on tile-9
      );
    }

    // const tile13Placement = getGroundTileByName(scene, "tile-13");
    // if (tile13Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     megaCollection,
    //     scene,
    //     tile13Placement.position // Position the entire block on tile-13
    //   );
    // }

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

  // Add red roof lights to tall buildings
  addSkyscraperRoofLights(scene);

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

    // Animate roof lights with pulsing effect
    animateRoofLights(scene, Date.now());

    // Render with or without post-processing based on configuration
    postProcessing.render(renderer, scene, camera);
  }

  renderer.setAnimationLoop(animate);

  // Function to position camera for top-down city map view
  const setCityMapView = () => {
    console.log("setCityMapView called!");
    console.log("Camera position before:", camera.position.clone());
    console.log("Controls target before:", controls.target.clone());
    
    // Position camera high above the center of the city
    camera.position.set(0, 800, 0);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
    
    console.log("Camera position after:", camera.position.clone());
    console.log("Controls target after:", controls.target.clone());
  };

  // Function to reset camera to initial position
  const resetCameraView = () => {
    console.log("resetCameraView called!");
    console.log("Camera position before:", camera.position.clone());
    console.log("Controls target before:", controls.target.clone());
    
    // Reset to initial camera position
    camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
    controls.target.set(initialControlsTarget.x, initialControlsTarget.y, initialControlsTarget.z);
    controls.update();
    
    console.log("Camera position after:", camera.position.clone());
    console.log("Controls target after:", controls.target.clone());
  };

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
    camera,
    controls,
    setCityMapView,
    resetCameraView,
    assetManager,
    modelPlacer,
    postProcessing,
  };
};
