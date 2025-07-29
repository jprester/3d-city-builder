import * as THREE from "three";
import type { EmissiveConfig } from "../models/definitions/ModelDefinitions.js";
import { colors } from "./constants.js";

export interface WindowLightingConfig {
  colors: number[];
  emissiveIntensity: number;
  opacity: number;
  roughness: number;
  metalness: number;
  randomizeColors: boolean;
}

export const DEFAULT_WINDOW_CONFIG: WindowLightingConfig = {
  colors: [
    colors.warmWhite, // Warm white
    // colors.orangeYellow, // Orange/amber
    colors.coolBlue, // Cool blue
    colors.warmYellow, // Warm yellow
    // colors.purple, // Purple/pink
    // colors.neonGreen, // Cool green
    // colors.peach, // Peach
    colors.lightBlue, // Light blue
  ],
  emissiveIntensity: 0.8,
  opacity: 1,
  roughness: 0.1,
  metalness: 0.1,
  randomizeColors: true,
};

export const CYBERPUNK_WINDOW_CONFIG: WindowLightingConfig = {
  colors: [
    colors.cyan, // Cyan
    colors.hotPink, // Hot pink
    colors.purple, // Purple
    colors.mediumNeonGreen, // Neon green
    colors.orange, // Orange
    colors.electricBlue, // Electric blue
  ],
  emissiveIntensity: 0.9,
  opacity: 1,
  roughness: 0.05,
  metalness: 0.2,
  randomizeColors: true,
};

export const REALISTIC_WINDOW_CONFIG: WindowLightingConfig = {
  colors: [
    colors.offWhite, // Warm white
    colors.lightPeach, // Warm beige
    colors.softYellow, // Soft yellow
    colors.peach, // Peach
  ],
  emissiveIntensity: 0.1,
  opacity: 1,
  roughness: 0.2,
  metalness: 0.0,
  randomizeColors: false,
};

/**
 * Converts EmissiveConfig to WindowLightingConfig
 */
const convertEmissiveToWindowConfig = (
  emissiveConfig: EmissiveConfig
): WindowLightingConfig => {
  // If intensity is 0, use black color to ensure no emission
  const colors = emissiveConfig.intensity === 0
    ? [0x000000] // Black - no emission
    : Array.isArray(emissiveConfig.color)
    ? (emissiveConfig.color as number[])
    : emissiveConfig.color
    ? [emissiveConfig.color as number]
    : DEFAULT_WINDOW_CONFIG.colors;

  return {
    colors,
    emissiveIntensity:
      emissiveConfig.intensity ?? DEFAULT_WINDOW_CONFIG.emissiveIntensity,
    opacity: emissiveConfig.opacity ?? DEFAULT_WINDOW_CONFIG.opacity,
    roughness: emissiveConfig.roughness ?? DEFAULT_WINDOW_CONFIG.roughness,
    metalness: emissiveConfig.metalness ?? DEFAULT_WINDOW_CONFIG.metalness,
    randomizeColors:
      emissiveConfig.randomizeColors ?? DEFAULT_WINDOW_CONFIG.randomizeColors,
  };
};

/**
 * Applies emissive configuration to a specific object/mesh
 */
export const applyEmissiveToObject = (
  object: THREE.Object3D,
  emissiveConfig: EmissiveConfig
): void => {
  const config = convertEmissiveToWindowConfig(emissiveConfig);

  object.traverse((child) => {
    // Check if this child object should be excluded from effects
    if ((child as any).excludeFromEffects) {
      return; // Skip objects marked for exclusion
    }

    if (child instanceof THREE.Mesh && child.material) {
      const material = child.material as THREE.Material;

      if ("emissive" in material) {
        const meshMaterial = material as THREE.MeshStandardMaterial;

        // Check if this material should be affected
        const materialName = meshMaterial.name?.toLowerCase() || "";
        const shouldApply =
          !emissiveConfig.materialFilter ||
          emissiveConfig.materialFilter.some((filter) =>
            materialName.includes(filter.toLowerCase())
          );

        if (shouldApply) {
          // When applying custom emissive config, override ALL materials
          // not just windows - this ensures custom configs take full precedence
          const forceApply = emissiveConfig.materialFilter || config.emissiveIntensity === 0;
          
          // Enhanced window detection
          const isWindow =
            materialName.includes("window") ||
            materialName.includes("glass") ||
            materialName.includes("emit") ||
            materialName.includes("light") ||
            (meshMaterial.transparent && meshMaterial.opacity < 0.9) ||
            (meshMaterial.color.r > 0.7 &&
              meshMaterial.color.g > 0.7 &&
              meshMaterial.color.b > 0.7) ||
            (meshMaterial.roughness < 0.3 && meshMaterial.metalness < 0.3);

          if (isWindow || forceApply) {
            // Apply emissive configuration
            let selectedColor: number;

            if (config.randomizeColors && config.colors.length > 1) {
              selectedColor =
                config.colors[Math.floor(Math.random() * config.colors.length)];
            } else {
              // Use consistent color based on object position
              const hash = Math.abs(
                Math.floor(child.position.x) +
                  Math.floor(child.position.y) * 10 +
                  Math.floor(child.position.z) * 100
              );
              selectedColor = config.colors[hash % config.colors.length];
            }

            meshMaterial.emissive = new THREE.Color(selectedColor);
            meshMaterial.emissiveIntensity = config.emissiveIntensity;

            // Apply material properties
            if (!meshMaterial.transparent && config.opacity < 1) {
              meshMaterial.transparent = true;
            }
            meshMaterial.opacity = config.opacity;
            meshMaterial.roughness = config.roughness;
            meshMaterial.metalness = config.metalness;

            // Add variation if randomization is enabled
            if (config.randomizeColors) {
              meshMaterial.emissiveIntensity += (Math.random() - 0.5) * 0.2;
              if (config.opacity < 1) {
                meshMaterial.opacity += (Math.random() - 0.5) * 0.1;
              }
            }
          }
        }
      }
    }
  });
};

/**
 * Enhanced window material enhancement with configurable settings
 */
export const enhanceWindowMaterials = (
  scene: THREE.Scene,
  config: WindowLightingConfig = DEFAULT_WINDOW_CONFIG
): void => {
  scene.traverse((object) => {
    // Check if this object should be excluded from effects
    if ((object as any).excludeFromEffects) {
      return; // Skip objects marked for exclusion
    }

    if (object instanceof THREE.Mesh && object.material) {
      const material = object.material as THREE.Material;

      if ("emissive" in material) {
        const meshMaterial = material as THREE.MeshStandardMaterial;

        // Enhanced window detection
        const materialName = meshMaterial.name?.toLowerCase() || "";
        const isWindow =
          materialName.includes("window") ||
          materialName.includes("glass") ||
          materialName.includes("emit") ||
          materialName.includes("light") ||
          (meshMaterial.transparent && meshMaterial.opacity < 0.9) ||
          (meshMaterial.color.r > 0.7 &&
            meshMaterial.color.g > 0.7 &&
            meshMaterial.color.b > 0.7) ||
          (meshMaterial.roughness < 0.3 && meshMaterial.metalness < 0.3);

        if (isWindow) {
          // Apply window lighting configuration
          let selectedColor: number;

          if (config.randomizeColors) {
            selectedColor =
              config.colors[Math.floor(Math.random() * config.colors.length)];
          } else {
            // Use consistent color based on object position for more realistic distribution
            const hash = Math.abs(
              Math.floor(object.position.x) +
                Math.floor(object.position.y) * 10 +
                Math.floor(object.position.z) * 100
            );
            selectedColor = config.colors[hash % config.colors.length];
          }

          meshMaterial.emissive = new THREE.Color(selectedColor);
          meshMaterial.emissiveIntensity = config.emissiveIntensity;

          // Apply material properties
          if (!meshMaterial.transparent) {
            meshMaterial.transparent = true;
          }
          meshMaterial.opacity = config.opacity;
          meshMaterial.roughness = config.roughness;
          meshMaterial.metalness = config.metalness;

          // Add slight variation to prevent uniform look
          if (config.randomizeColors) {
            meshMaterial.emissiveIntensity += (Math.random() - 0.5) * 0.4;
            meshMaterial.opacity += (Math.random() - 0.5) * 0.1;
          }
        } else {
          // Subtle enhancement for non-window materials
          const isBrightSurface =
            meshMaterial.color.r > 0.6 ||
            meshMaterial.color.g > 0.6 ||
            meshMaterial.color.b > 0.6 ||
            meshMaterial.metalness > 0.7;

          if (isBrightSurface) {
            meshMaterial.emissive = new THREE.Color(colors.darkIndigo);
            meshMaterial.emissiveIntensity = 0.3;
          } else {
            meshMaterial.emissive = new THREE.Color(colors.nearBlack);
            meshMaterial.emissiveIntensity = 0.02;
          }
        }
      }
    }
  });
};

/**
 * Creates window lights that match the building materials
 */
export const addWindowPointLights = (scene: THREE.Scene): void => {
  const windowLights: THREE.PointLight[] = [];

  scene.traverse((object) => {
    if (object instanceof THREE.Mesh && object.material) {
      const material = object.material as THREE.MeshStandardMaterial;

      // Check if this is an emissive window material
      if (material.emissive && material.emissiveIntensity > 1.0) {
        const worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition);

        // Add a subtle point light at the window location
        const windowLight = new THREE.PointLight(
          material.emissive.getHex(),
          material.emissiveIntensity * 20, // Scale up for point light
          15 // Small radius to not dominate the scene
        );

        windowLight.position.copy(worldPosition);
        // Offset slightly outward from the building
        windowLight.position.add(
          object.getWorldDirection(new THREE.Vector3()).multiplyScalar(2)
        );

        scene.add(windowLight);
        windowLights.push(windowLight);
      }
    }
  });

  console.log(`Added ${windowLights.length} window point lights`);
};

/**
 * Determines if a building should have roof lights based on its model definition
 */
const shouldHaveRoofLights = (object: THREE.Object3D): boolean => {
  // Check if the object has model definition data in userData
  if (object.userData && object.userData.modelDefinition) {
    return object.userData.modelDefinition.hasRoofLights === true;
  }
  
  // Fallback: no roof lights if no model definition found
  return false;
};

/**
 * Finds the highest point of a building for roof light placement
 */
const getBuildingRoofPosition = (object: THREE.Object3D): THREE.Vector3 => {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  
  // Place light at the highest point (roof)
  return new THREE.Vector3(center.x, box.max.y + 2, center.z);
};

/**
 * Adds red warning lights to buildings that have hasRoofLights flag enabled in their model definition
 */
export const addSkyscraperRoofLights = (scene: THREE.Scene): void => {
  const roofLights: THREE.PointLight[] = [];
  const processedBuildings = new Set<string>();

  scene.traverse((object) => {
    // Check if this object should be excluded from effects
    if ((object as THREE.Object3D & { excludeFromEffects?: boolean }).excludeFromEffects) {
      return;
    }

    // Look for building objects (groups or meshes that represent complete buildings)
    if (object instanceof THREE.Group || object instanceof THREE.Mesh) {
      // Create a unique identifier for this building to avoid duplicates
      const buildingId = `${Math.round(object.position.x)}_${Math.round(object.position.z)}`;
      
      if (processedBuildings.has(buildingId)) {
        return;
      }

      // Check if this building should have roof lights based on model definition
      if (shouldHaveRoofLights(object)) {
        processedBuildings.add(buildingId);
        
        const roofPosition = getBuildingRoofPosition(object);
        
        // Create red warning light (like real skyscraper lights)
        const roofLight = new THREE.PointLight(
          colors.red, // Bright red color
          0.8, // Moderate intensity
          25 // Medium radius
        );
        
        roofLight.position.copy(roofPosition);
        
        // Add a subtle pulsing effect by varying intensity slightly
        const originalIntensity = roofLight.intensity;
        roofLight.userData = {
          originalIntensity,
          pulsePhase: Math.random() * Math.PI * 2, // Random starting phase
          isRoofLight: true
        };
        
        scene.add(roofLight);
        roofLights.push(roofLight);
        
        // Optionally add a small red emissive sphere as visual indicator
        const lightIndicator = new THREE.Mesh(
          new THREE.SphereGeometry(1, 8, 6),
          new THREE.MeshStandardMaterial({
            color: colors.red,
            emissive: colors.red,
            emissiveIntensity: 0.8
          })
        );
        
        lightIndicator.position.copy(roofPosition);
        lightIndicator.userData = { isRoofLightIndicator: true };
        scene.add(lightIndicator);
      }
    }
  });

  console.log(`Added ${roofLights.length} red roof lights to buildings with hasRoofLights flag`);
};

/**
 * Animates the roof lights with a subtle pulsing effect
 * Call this in your render loop for animated effects
 */
export const animateRoofLights = (scene: THREE.Scene, time: number): void => {
  scene.traverse((object) => {
    if (object instanceof THREE.PointLight && object.userData.isRoofLight) {
      const { originalIntensity, pulsePhase } = object.userData;
      // Create a subtle pulsing effect (±20% intensity variation)
      object.intensity = originalIntensity + Math.sin(time * 0.002 + pulsePhase) * 0.2;
    }
  });
};
