import * as THREE from "three";
import { AssetManager, type SkyTextureOptions } from "../models/index.js";

/**
 * Sets up night-time lighting for the scene
 */
export const setupNightLighting = (scene: THREE.Scene): void => {
  // Cool, dim ambient lighting for night scene
  const ambientLight = new THREE.AmbientLight(0x304080, 0.2);
  scene.add(ambientLight);

  // Moon-like directional light
  const directionalLight = new THREE.DirectionalLight(0x8080ff, 0.2);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Warm artificial point lighting
  const pointLight = new THREE.PointLight(0xffaa44, 0.8, 10);
  pointLight.position.set(0, 8, 0);
  scene.add(pointLight);
};

/**
 * Sets up sky texture as scene background
 */
export const setupSkyTexture = async (
  scene: THREE.Scene,
  assetManager: AssetManager,
  texturePath: string = "/assets/sky_night.jpg",
  options: SkyTextureOptions = { darkness: 0.05 }
): Promise<void> => {
  try {
    const skyTexture = await assetManager.createSkyBackground(
      texturePath,
      options
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
};

/**
 * Sets up complete environment (lighting + sky texture)
 */
export const setupEnvironment = async (
  scene: THREE.Scene,
  assetManager: AssetManager,
  texturePath?: string,
  skyOptions?: SkyTextureOptions
): Promise<void> => {
  setupNightLighting(scene);
  await setupSkyTexture(scene, assetManager, texturePath, skyOptions);
};
