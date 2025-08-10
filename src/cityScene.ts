import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AD_TYPES, AssetManager, ModelPlacer } from "./models/index.js";
import {
  addHumanReferenceModel,
  createGroundPlane,
  createGroundTiles,
  getGroundTileByName,
} from "./utils/helperFunctions.js";
import { setupEnvironment } from "./utils/environmentUtils.js";
import { setEnvMapIntensity as setEnvMapIntensityUtil } from "./utils/materialUtils.js";
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
// import { commercialBlockCollection1, commercialBlockCollection2, industrialBlockCollection, mixedUseBlockCollection1, mixedUseBlockCollection2 } from "./models/collections/building-collections.js";
import {
  saveCameraState,
  loadCameraState,
  applyCameraState,
} from "./utils/cameraState.js";
import {
  commercialBlockCollection1,
  commercialBlockCollection2,
  industrialBlockCollection,
  mixedUseBlockCollection1,
} from "./models/collections/building-collections.js";
import { AdSignPlacer } from "./models/index.js";

export const initCityScene = async (container: HTMLDivElement) => {
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

  // Configure controls
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = true;
  controls.minDistance = 1;
  controls.maxDistance = 2000;
  controls.maxPolarAngle = Math.PI;

  // Store initial camera position for reset functionality
  const initialCameraPosition = { x: 0, y: 0, z: 5 };
  const initialControlsTarget = { x: 0, y: 0, z: 0 };

  // Try to load saved camera state, otherwise use initial position
  const savedCameraState = loadCameraState();
  const cameraWasRestored = !!savedCameraState;
  if (savedCameraState) {
    applyCameraState(camera, controls, savedCameraState);
    console.log("Restored camera position from previous session");
  } else {
    // Set initial camera position
    camera.position.set(0, 0, 5);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  // Initialize AssetManager and ModelPlacer
  const assetManager = new AssetManager({
    materials: {
      anisotropy: effectConfig.materials.anisotropy,
      crispEmissive: effectConfig.materials.crispEmissive,
    },
  });
  const modelPlacer = new ModelPlacer(assetManager);

  // Setup environment (lighting and sky texture)
  await setupEnvironment(
    scene,
    assetManager,
    effectConfig,
    "/assets/sky_night.jpg",
    { darkness: 0.2 }
  );

  // Slightly increase exposure for better base texture visibility
  renderer.toneMappingExposure *= 1.4;

  // Boost environment lighting influence on PBR materials (mode-driven)
  setEnvMapIntensityUtil(scene, effectConfig.materials.envMapIntensity);

  // Add ground plane with custom emissive configuration
  // You can override the ground plane's emissive properties here:
  await createGroundPlane(scene, assetManager);

  // --- Neon sign test via AdSignPlacer/definitions ---
  try {
    const adPlacer = new AdSignPlacer(assetManager);
    await adPlacer.placeAd(AD_TYPES.NEON_SIGN_TEST, scene, {
      position: { x: 72, y: 244, z: -30 },
      emissiveIntensity: 1.0,
      name: "neon-sign-test",
    });
  } catch (e) {
    console.warn("Failed to create neon sign plane", e);
  }

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
      // Example: place a collection here if desired
      await modelPlacer.placeModelCollectionAsGroup(
        industrialBlockCollection,
        scene,
        tile1Placement.position
      );
    }
    // Test both regular and instanced collections
    console.log("=== Testing Grouped Models ===");
    // const tile2Placement = getGroundTileByName(scene, "tile-2");
    // if (tile2Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     residentialAndCommercialBlockCollection,
    //     scene,
    //     tile2Placement.position // Position the entire block on tile-2
    //   );
    // }

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

    // const tile9Placement = getGroundTileByName(scene, "tile-9");
    // if (tile9Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     mixedUseBlockCollection2,
    //     scene,
    //     tile9Placement.position // Position the entire block on tile-9
    //   );
    // }

    // const tile13Placement = getGroundTileByName(scene, "tile-13");
    // if (tile13Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     megaCollection,
    //     scene,
    //     tile13Placement.position // Position the entire block on tile-13
    //   );
    // }

    // const { group: residentialGroup1, models: placedModels } =
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     residentialBlockCollection,
    //     scene,
    //     { x: 0, y: 0, z: 0 } // Position the entire block
    //   );
    // console.log(`Successfully placed ${placedModels.length} models in group`);
    // residentialGroup1.position.set(0, 0, 0); // Move group to a new position

    // await modelPlacer.placeModel(
    //   {
    //     id: "dark-skyscraper2",
    //     name: "darkSkyscraper",
    //     filePath: "/assets/models/blue-skyscrapper-building_darker.glb",
    //     position: { x: 120, y: 0, z: -20 },
    //     scale: { x: 3, y: 3, z: 3 },
    //     emissiveConfig: {
    //       intensity: 2,
    //       color: colors.skyBlue,
    //     },
    //   },
    //   scene
    // );

    // await modelPlacer.placeModel(
    //   {
    //     id: "new-skyscraper1",
    //     name: "newSkyscraper1",
    //     filePath: "/assets/models/synth-remixed-skyscraper.glb",
    //     position: { x: 0, y: 0, z: 60 },
    //     scale: { x: 4.2, y: 4.2, z: 4.2 },
    //     emissiveConfig: {
    //       intensity: 1,
    //       color: colors.orangeYellow,
    //     },
    //   },
    //   scene
    // );

    // await modelPlacer.placeModel(
    //   {
    //     id: "new-skyscraper2",
    //     name: "newSkyscraper2",
    //     filePath: "/assets/models/synth-remixed-next-skyscraper2.glb",
    //     position: { x: -230, y: 0, z: 130 },
    //     scale: { x: 3.2, y: 3.2, z: 3.2 },
    //     emissiveConfig: {
    //       intensity: 1,
    //       color: colors.softYellow,

    //       roughness: 0.05,
    //       metalness: 0.3,
    //     },
    //   },
    //   scene
    // );

    // await modelPlacer.placeModel(
    //   {
    //     id: "new-skyscraper3",
    //     name: "newSkyscraper3",
    //     filePath: "/assets/models/synth-remixed-cyberpunk-skyscraper.glb",
    //     position: { x: 290, y: 0, z: -70 },
    //     scale: { x: 6.2, y: 6.2, z: 6.2 },
    //     emissiveConfig: {
    //       intensity: 4,
    //       color: colors.skyBlue,
    //     },
    //   },
    //   scene
    // );

    // await modelPlacer.placeModel(
    //   {
    //     id: "new-skyscraper4",
    //     name: "newSkyscraper4",
    //     filePath:
    //       "/assets/models/synth-remixed-cyberpunk-skyscraper-object2.obj",
    //     position: { x: -100, y: 0, z: -70 },
    //     scale: { x: 6.2, y: 6.2, z: 6.2 },
    //     emissiveConfig: {
    //       intensity: 4,
    //       color: colors.skyBlue,
    //     },
    //     textures: {
    //       base: "/assets/textures/synthcity/building_05.jpg",
    //       specular: "/assets/textures/synthcity/building_05_spec.jpg",
    //       roughness: "/assets/textures/synthcity/building_05_rough.jpg",
    //       emissive: "/assets/textures/synthcity/building_05_em.jpg",
    //     },
    //   },
    //   scene
    // );

    await modelPlacer.placeModel(
      {
        id: "new-skyscraper5",
        name: "cylinder-skyscraper",
        filePath: "/assets/models/cylinder-skyscraper.glb",
        position: { x: 200, y: 0, z: -170 },
        scale: { x: 3, y: 3, z: 3 },
        // emissiveConfig: {
        //   intensity: 2,
        //   color: colors.lightPeach,
        // },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "new-skyscraper6",
        name: "ny-office-building",
        filePath: "/assets/models/ny-office-building-optimized.glb",
        position: { x: 100, y: 0, z: -50 },
        scale: { x: 4, y: 4, z: 4 },
        emissiveConfig: {
          intensity: 1,
          color: colors.softYellow,
        },
      },
      scene
    );

    // await modelPlacer.placeModelCollectionAsGroup(
    //   cityBuildingsCollection,
    //   scene,
    //   { x: 0, y: 0, z: 0 }
    // );

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

  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    postProcessing.onWindowResize();
  };
  window.addEventListener("resize", handleResize);

  // Camera state persistence
  let lastSaveTime = 0;
  const SAVE_INTERVAL = 1000; // Save every 1 second

  // Save camera state when controls change
  const saveCameraStateDebounced = () => {
    const now = Date.now();
    if (now - lastSaveTime > SAVE_INTERVAL) {
      saveCameraState(camera, controls);
      lastSaveTime = now;
    }
  };

  controls.addEventListener("change", saveCameraStateDebounced);
  controls.addEventListener("end", () => saveCameraState(camera, controls));

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
    // Directly set camera position and controls target
    camera.position.set(0, 800, 0);
    controls.target.set(0, 0, 0);

    // Force controls to update immediately
    controls.update();
  };

  // Function to reset camera to initial position
  const resetCameraView = () => {
    console.log("resetCameraView called!");

    // Reset to initial camera position
    camera.position.set(
      initialCameraPosition.x,
      initialCameraPosition.y,
      initialCameraPosition.z
    );
    controls.target.set(
      initialControlsTarget.x,
      initialControlsTarget.y,
      initialControlsTarget.z
    );

    // Force controls to update immediately
    controls.update();
  };

  return {
    cleanup: () => {
      // Save camera state one final time before cleanup
      saveCameraState(camera, controls);

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
    cameraWasRestored,
  };
};
