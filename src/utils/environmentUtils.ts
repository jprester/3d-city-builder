import * as THREE from "three";
import { AssetManager, type SkyTextureOptions } from "../models/index.js";

/**
 * Sets up night-time lighting for the scene
 */
export const setupNightLighting = (scene: THREE.Scene): void => {
  // Cool, dim ambient lighting for night scene
  const ambientLight = new THREE.AmbientLight(0x304080, 0);
  scene.add(ambientLight);

  // Moon-like directional light
  const directionalLight = new THREE.DirectionalLight(0x8080ff, 0.2);
  directionalLight.position.set(10, 100, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Add sphere to represent directional light
  const dirSphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const dirSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x8080ff });
  const dirSphere = new THREE.Mesh(dirSphereGeometry, dirSphereMaterial);
  dirSphere.position.copy(directionalLight.position);
  scene.add(dirSphere);

  // Warm artificial point lighting
  const pointLight = new THREE.PointLight(0xb388ff, 500, 200);
  pointLight.position.set(100, 80, -10);
  scene.add(pointLight);
  // Add sphere to represent point light
  const pointSphereGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const pointSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
  const pointSphere = new THREE.Mesh(pointSphereGeometry, pointSphereMaterial);
  pointSphere.position.copy(pointLight.position);
  scene.add(pointSphere);

  // Duplicate: Pink point light at (200, 80, -10)
  const pinkPointLight = new THREE.PointLight(0xff69b4, 500, 200); // Pink color
  pinkPointLight.position.set(200, 80, -10);
  scene.add(pinkPointLight);
  // Add sphere to represent pink point light
  const pinkSphereGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const pinkSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff69b4 });
  const pinkSphere = new THREE.Mesh(pinkSphereGeometry, pinkSphereMaterial);
  pinkSphere.position.copy(pinkPointLight.position);
  scene.add(pinkSphere);

  // Optionally, visualize ambient light (not a point, but for reference)
  // const ambientSphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  // const ambientSphereMaterial = new THREE.MeshBasicMaterial({
  //   color: 0x304080,
  // });
  // const ambientSphere = new THREE.Mesh(
  //   ambientSphereGeometry,
  //   ambientSphereMaterial
  // );
  // ambientSphere.position.set(0, 0, 0); // Center
  // scene.add(ambientSphere);
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
