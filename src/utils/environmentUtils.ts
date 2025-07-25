import * as THREE from "three";
import { AssetManager, type SkyTextureOptions } from "../models/index.js";
import type { EffectConfiguration } from "./effectsConfig.js";

/**
 * Sets up night-time lighting for the scene
 */
export const setupNightLighting = (
  scene: THREE.Scene,
  config: EffectConfiguration
): void => {
  // Ambient lighting based on configuration
  const ambientLight = new THREE.AmbientLight(
    0x0a0a2a,
    config.lighting.ambientIntensity
  );
  scene.add(ambientLight);

  // // Moon-like directional light
  const directionalLight = new THREE.DirectionalLight(0x4d79ff, 0.4);
  directionalLight.position.set(10, 100, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  if (config.lighting.colorfulLights) {
    // Define all possible lights
    const availableLights = [
      // Bright cyan light
      {
        color: 0x00ffff,
        position: { x: 100, y: 30, z: -50 },
        sphereColor: 0x00ffff,
      },
      // Hot pink/magenta light
      {
        color: 0xff0080,
        position: { x: 220, y: 30, z: -70 },
        sphereColor: 0xff0080,
      },
      // Electric purple light
      {
        color: 0xb266ff, // lighter purple
        position: { x: 180, y: 40, z: -60 },
        sphereColor: 0xb266ff,
      },
      // Bright white light
      {
        color: 0xffffff, // bright white
        position: { x: 100, y: 50, z: -40 },
        sphereColor: 0xffffff,
      },
      // // Orange/amber light
      {
        color: 0xff4000,
        position: { x: 220, y: 60, z: -70 },
        sphereColor: 0xff4000,
      },
    ];

    // Use only the number of lights specified in config
    const lightsToUse = availableLights.slice(0, config.lighting.lightCount);

    lightsToUse.forEach((lightConfig, index) => {
      // Create point light
      const pointLight = new THREE.PointLight(
        lightConfig.color,
        config.lighting.baseIntensity,
        250
      );
      pointLight.position.set(
        lightConfig.position.x,
        lightConfig.position.y,
        lightConfig.position.z
      );
      scene.add(pointLight);

      // Create glowing sphere to represent the light source
      const sphereGeometry = new THREE.SphereGeometry(
        0.8 + index * 0.1,
        16,
        16
      );
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: lightConfig.sphereColor,
        transparent: true,
        opacity: 0.8,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(pointLight.position);
      scene.add(sphere);

      // Add animation if enabled
      if (config.lighting.animatedIntensity) {
        const originalIntensity = config.lighting.baseIntensity;
        const animate = () => {
          const time = Date.now() * 0.001;
          pointLight.intensity =
            originalIntensity +
            Math.sin(time + index) * config.lighting.animationAmplitude;
          requestAnimationFrame(animate);
        };
        animate();
      }
    });
  } else {
    // Simple warm lighting for 'none' mode
    const pointLight = new THREE.PointLight(
      0xffaa44,
      config.lighting.baseIntensity,
      100
    );
    pointLight.position.set(0, 8, 0);
    scene.add(pointLight);
  }
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
  config: EffectConfiguration,
  texturePath?: string,
  skyOptions?: SkyTextureOptions
): Promise<void> => {
  setupNightLighting(scene, config);
  await setupSkyTexture(scene, assetManager, texturePath, skyOptions);
};
