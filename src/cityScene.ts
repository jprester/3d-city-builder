import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createFpsControls, type FpsControls } from "./utils/fpsControls.js";
import { AssetManager, ModelPlacer } from "./models/index.js";
import {
  addHumanReferenceModel,
  createGroundPlane,
  createGroundTiles,
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
  saveCameraStateWithTarget,
  applyCameraStateToCamera,
} from "./utils/cameraState.js";
// import {
//   commercialBlockCollection1,
//   commercialBlockCollection2,
//   industrialBlockCollection,
//   mixedUseBlockCollection1,
//   mixedUseBlockCollection2,
//   residentialAndCommercialBlockCollection,
// } from "./models/collections/building-collections.js";
// import { AdSignPlacer } from "./models/index.js";

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
  let fpsControls: FpsControls | null = null;
  let isFirstPerson = false;

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
    // Start in Orbit mode by default; apply with Orbit controls
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
    { darkness: 0.12 }
  );

  // Load a separate env map for reflections and prefilter it with PMREM
  try {
    const envEquirect = await assetManager.loadSkyTexture(
      "/assets/environment_night.jpg"
    );
    // LDR JPG should be treated as sRGB before PMREM
    envEquirect.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envPMREM = pmrem.fromEquirectangular(envEquirect).texture;
    scene.environment = envPMREM; // keep background from sky_night.jpg
    pmrem.dispose();
    console.log(
      "Reflection environment applied with PMREM: /assets/environment_night.jpg"
    );
  } catch (e) {
    console.warn(
      "Failed to load reflection env map; using sky as environment",
      e
    );
  }

  // Slightly increase exposure for better base texture visibility
  renderer.toneMappingExposure *= 1.1;

  // Boost environment lighting influence on PBR materials (mode-driven)
  setEnvMapIntensityUtil(scene, effectConfig.materials.envMapIntensity);

  // Add ground plane with custom emissive configuration
  // You can override the ground plane's emissive properties here:
  await createGroundPlane(scene, assetManager);

  // Preload common low-poly building atlases to avoid hitches and enable reuse
  await assetManager.preloadTextures([
    "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
    "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
    "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
    "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
  ]);

  // --- Neon sign test via AdSignPlacer/definitions ---
  // try {
  //   const adPlacer = new AdSignPlacer(assetManager);
  //   await adPlacer.placeAd(AD_TYPES.NEON_SIGN_TEST, scene, {
  //     position: { x: 42, y: 244, z: -20 },
  //     emissiveIntensity: 2,
  //     name: "neon-sign-test",
  //   });
  // } catch (e) {
  //   console.warn("Failed to create neon sign plane", e);
  // }

  // --- Neon sign test via AdSignPlacer/definitions ---
  // try {
  //   const adPlacer = new AdSignPlacer(assetManager);
  //   await adPlacer.placeAd(
  //     {
  //       diffusePath: "/assets/textures/test-neon-sign_text_diffuse.png",
  //       emissivePath: "/assets/textures/test-neon-sign_text_emissive.png",
  //       id: "test-neon-sign",
  //       name: "my-simple-ad",
  //       emissiveColor: colors.neonGreen,
  //       emissiveIntensity: 1,
  //     },
  //     scene,
  //     {
  //       position: { x: 92, y: 242, z: -20 },
  //       width: 18,
  //       height: 4,
  //     }
  //   );
  // } catch (e) {
  //   console.warn("Failed to create neon sign plane", e);
  // }

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
    // const tile1Placement = getGroundTileByName(scene, "tile-1");
    // if (tile1Placement) {
    //   // Example: place a collection here if desired
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     industrialBlockCollection,
    //     scene,
    //     tile1Placement.position
    //   );
    // }
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

    // const tile6Placement = getGroundTileByName(scene, "tile-6");
    // if (tile6Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     commercialBlockCollection1,
    //     scene,
    //     tile6Placement.position // Position the entire block on tile-8
    //   );
    // }

    // const tile4Placement = getGroundTileByName(scene, "tile-4");
    // if (tile4Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     commercialBlockCollection2,
    //     scene,
    //     tile4Placement.position // Position the entire block on tile-4
    //   );
    // }

    // const tile5Placement = getGroundTileByName(scene, "tile-5");
    // if (tile5Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     commercialBlockCollection2,
    //     scene,
    //     tile5Placement.position // Position the entire block on tile-5
    //   );
    // }

    // const tile12Placement = getGroundTileByName(scene, "tile-12");
    // if (tile12Placement) {
    //   await modelPlacer.placeModelCollectionAsGroup(
    //     mixedUseBlockCollection1,
    //     scene,
    //     tile12Placement.position // Position the entire block on tile-10
    //   );
    // }

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

    await modelPlacer.placeModel(
      {
        id: "dark-skyscraper2",
        name: "darkSkyscraper",
        filePath: "/assets/models/blue-skyscraper.glb",
        position: { x: 150, y: 0, z: -260 },
        scale: { x: 3, y: 3, z: 3 },
        emissiveConfig: {
          intensity: 2,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "dark-skyscraper3",
        name: "darkSkyscraper",
        filePath: "/assets/models/dark-skyscraper.glb",
        position: { x: 80, y: 0, z: -450 },
        scale: { x: 3, y: 3, z: 3 },
        emissiveConfig: {
          intensity: 5,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "skyscraper5",
        name: "ny-office-building2",
        filePath: "/assets/models/ny-office-building-optimized2.glb",
        position: { x: 170, y: 0, z: -140 },
        scale: { x: 1, y: 1, z: 1 },
        emissiveConfig: {
          intensity: 1.2,
          color: colors.offWhite,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "skyscraper6",
        name: "ny-office-building2",
        filePath: "/assets/models/ny-office-building-optimized2.glb",
        position: { x: -200, y: 0, z: -230 },
        scale: { x: 1, y: 1, z: 1 },
        emissiveConfig: {
          intensity: 1.2,
          color: colors.offWhite,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "ad-building",
        name: "advertisment-building",
        filePath: "/assets/models/advertisment-building.glb",
        position: { x: -50, y: 0, z: -48 },
        scale: { x: 1, y: 1, z: 1 },
        emissiveConfig: {
          intensity: 1.4,
          color: colors.lightPeach,
          roughness: 1,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "apartment-building",
        name: "apartment-building",
        filePath: "/assets/models/cyberpunk-apartment-building.glb",
        position: { x: -86, y: 0, z: -34 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        emissiveConfig: {
          intensity: 1.4,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "apartment-building",
        name: "apartment-building",
        filePath: "/assets/models/cyberpunk-apartment-building.glb",
        position: { x: -120, y: 0, z: -34 },
        scale: { x: 1.2, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        emissiveConfig: {
          intensity: 1.4,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "anime-residential",
        name: "anime-residential",
        filePath: "/assets/models/anime-residential-building.glb",
        position: { x: -33, y: -2, z: -74 },
        scale: { x: 1.2, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        emissiveConfig: {
          intensity: 1.4,
          color: colors.lightPeach,
        },
      },
      scene
    );
    await modelPlacer.placeModel(
      {
        id: "anime-residential",
        name: "anime-residential",
        filePath: "/assets/models/anime-residential-building.glb",
        position: { x: -33, y: -2, z: -94 },
        scale: { x: 1.3, y: 1.3, z: 1.3 },
        rotation: { x: 0, y: 0, z: 0 },
        emissiveConfig: {
          intensity: 1.4,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "low-poly-skyscraper",
        name: "low-poly-skyscraper",
        filePath:
          "/assets/models/low-poly-city-buildings/modular-skyscraper.glb",
        position: { x: -100, y: 0, z: -100 },
        scale: { x: 1.5, y: 1.5, z: 1.5 },
        emissiveConfig: {
          intensity: 0.5,
          color: colors.lightPeach,
        },
      },
      scene
    );

    // Additional instances of the same curved building to validate texture reuse
    await modelPlacer.placeModel(
      {
        id: "lp-curved-02",
        name: "lp-curved-02",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/curved-skyscraper.glb",
        position: { x: -60, y: 0, z: -200 },
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1.2,
          color: colors.offWhite,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "lp-curved-03",
        name: "lp-curved-03",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/curved-skyscraper.glb",
        position: { x: -240, y: 0, z: -160 },
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1.2,
          color: colors.offWhite,
        },
      },
      scene
    );

    // Another model using the same atlas to test sharing: blocky building
    await modelPlacer.placeModel(
      {
        id: "lp-blocky-01",
        name: "lp-blocky-01",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/blocky-building_nt_alpha_logo.glb",
        position: { x: 60, y: 0, z: -220 },
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    // Another model using the same atlas to test sharing: blocky building
    await modelPlacer.placeModel(
      {
        id: "brutalist-office",
        name: "brutalist-office",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/brutalist-office-building.glb",
        position: { x: -170, y: 0, z: -40 },
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "hotel-office2",
        name: "hotel-office2",
        filePath: "/assets/models/low-poly-city-buildings/hotel-building.glb",
        position: { x: 50, y: 0, z: -100 },
        scale: { x: 1, y: 1, z: 1 },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "rounded-corner-building",
        name: "rounded-corner-building",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/rounded-corners-building.glb",
        position: { x: 50, y: 0, z: -50 },
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    // Additional no-texture buildings distributed across tiles 1 and 4
    await modelPlacer.placeModel(
      {
        id: "box-like-building",
        name: "box-like-building",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/box-like-building.glb",
        position: { x: -200, y: 0, z: -100 }, // tile-1
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "blocky-building-nt",
        name: "blocky-building-nt",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/blocky-building_nt.glb",
        position: { x: -100, y: 0, z: -200 }, // tile-1
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "glassy-office-building",
        name: "glassy-office-building",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/glassy-office-building.glb",
        position: { x: -80, y: 0, z: -100 }, // tile-1
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "multi-level-skyscraper",
        name: "multi-level-skyscraper",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/multi-level-skyscraper.glb",
        position: { x: -220, y: 0, z: -180 }, // tile-1
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "ny-skyscraper",
        name: "ny-skyscraper",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/ny-skyscraper.glb",
        position: { x: 100, y: 0, z: -350 }, // tile-1
        scale: { x: 1.3, y: 1.3, z: 1.3 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "public-building",
        name: "public-building",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/public-building.glb",
        position: { x: -60, y: 0, z: -140 }, // tile-1
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "rectangular-skyscraper",
        name: "rectangular-skyscraper",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/rectangular-skyscraper.glb",
        position: { x: 80, y: 0, z: -200 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "residential-complex-building",
        name: "residential-complex-building",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/residential-complex-building.glb",
        position: { x: 200, y: 0, z: -80 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "standard-office-building",
        name: "standard-office-building",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/standard-office-building.glb",
        position: { x: 120, y: 0, z: -100 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "brutalist-office-building-2",
        name: "brutalist-office-building-2",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/brutalist-office-building.glb",
        position: { x: 220, y: 0, z: -120 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "curved-skyscraper-2",
        name: "curved-skyscraper-2",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/curved-skyscraper.glb",
        position: { x: 180, y: 0, z: -220 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "blocky-building-nt-alpha",
        name: "blocky-building-nt-alpha",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/blocky-building_nt_alpha_logo.glb",
        position: { x: 100, y: 0, z: -220 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "rounded-corners-building-2",
        name: "rounded-corners-building-2",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/rounded-corners-building.glb",
        position: { x: 220, y: 0, z: -180 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

    await modelPlacer.placeModel(
      {
        id: "multi-level-skyscraper-2",
        name: "multi-level-skyscraper-2",
        filePath:
          "/assets/models/low-poly-city-buildings/no-textures/multi-level-skyscraper.glb",
        position: { x: 120, y: 0, z: -180 }, // tile-4
        scale: { x: 1, y: 1, z: 1 },
        textures: {
          base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
          roughness:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
          normal:
            "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
          emissive:
            "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
        },
        emissiveConfig: {
          intensity: 1,
          color: colors.lightPeach,
        },
      },
      scene
    );

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

  // First-person setup and toggling
  const ensureFpsControls = () => {
    if (!fpsControls) {
      fpsControls = createFpsControls(camera, renderer.domElement, {
        // Human-scale feel: ~6 m/s walk, ~10.8 m/s sprint, ~1.7 m eye height
        moveSpeed: 6,
        sprintMultiplier: 1.8,
        gravity: 30,
        jumpVelocity: 7,
        minY: 1.65,
      });
    }
  };

  const setFirstPersonEnabled = (enabled: boolean) => {
    if (enabled === isFirstPerson) return;
    ensureFpsControls();
    if (!fpsControls) return;

    isFirstPerson = enabled;
    if (enabled) {
      // Switch from Orbit -> FPS
      controls.enabled = false;
      fpsControls.enable();

      // Always ensure camera is at ground level (eye height) when entering FPS mode
      // Keep the current X and Z position but reset Y to ground level
      const currentPosition = camera.position.clone();
      camera.position.set(currentPosition.x, 1.65, currentPosition.z);

      // Narrow FOV slightly for human-like perspective
      camera.fov = 60;
      camera.updateProjectionMatrix();

      // If we had a saved state, apply the orientation but keep ground-level Y position
      if (savedCameraState) {
        // Apply the saved camera orientation but override the Y position
        const tempCamera = camera.clone();
        applyCameraStateToCamera(tempCamera, savedCameraState);

        // Keep ground level Y but apply the rotation/orientation
        camera.position.set(camera.position.x, 1.65, camera.position.z);
        camera.quaternion.copy(tempCamera.quaternion);
      }
    } else {
      // Switch from FPS -> Orbit
      fpsControls.disable();
      controls.enabled = true;
      controls.update();
      // Restore broader FOV used for orbiting
      camera.fov = 75;
      camera.updateProjectionMatrix();
    }
  };

  const toggleFirstPerson = () => setFirstPersonEnabled(!isFirstPerson);

  function animate() {
    // Orbit or FPS update
    if (isFirstPerson && fpsControls) {
      fpsControls.update();
      // Persist camera in FPS mode (compute a forward-look target)
      const now = Date.now();
      if (now - lastSaveTime > SAVE_INTERVAL) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const target = new THREE.Vector3().copy(camera.position).add(forward);
        saveCameraStateWithTarget(camera, target);
        lastSaveTime = now;
      }
    } else {
      controls.update(); // Update Orbit controls
    }

    // Animate roof lights with pulsing effect
    animateRoofLights(scene, Date.now());

    // Render with or without post-processing based on configuration
    postProcessing.render(renderer, scene, camera);
  }

  renderer.setAnimationLoop(animate);

  // Function to position camera for top-down city map view
  const setCityMapView = () => {
    // Directly set camera position and controls target
    // Ensure we are in orbit mode for a map view
    setFirstPersonEnabled(false);
    camera.position.set(0, 800, 0);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  // Function to reset camera to initial position
  const resetCameraView = () => {
    console.log("resetCameraView called!");
    setFirstPersonEnabled(false);
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
      if (fpsControls) {
        fpsControls.dispose();
      }
    },
    renderer,
    camera,
    controls,
    setCityMapView,
    resetCameraView,
    setFirstPersonEnabled,
    toggleFirstPerson,
    isFirstPersonEnabled: () => isFirstPerson,
    assetManager,
    modelPlacer,
    postProcessing,
    cameraWasRestored,
  };
};
