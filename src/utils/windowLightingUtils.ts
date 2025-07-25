import * as THREE from "three";

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
    0xffdd88, // Warm white
    // 0xff9944, // Orange/amber
    0x88ddff, // Cool blue
    0xffaa66, // Warm yellow
    // 0xdd88ff, // Purple/pink
    // 0x66ffaa, // Cool green
    // 0xffcc99, // Peach
    0x99ccff, // Light blue
  ],
  emissiveIntensity: 0.5,
  opacity: 1,
  roughness: 0.1,
  metalness: 0.1,
  randomizeColors: true,
};

export const CYBERPUNK_WINDOW_CONFIG: WindowLightingConfig = {
  colors: [
    0x00ffff, // Cyan
    0xff0080, // Hot pink
    0x8000ff, // Purple
    0x00ff40, // Neon green
    0xff4000, // Orange
    0x4080ff, // Electric blue
  ],
  emissiveIntensity: 2.2,
  opacity: 1,
  roughness: 0.05,
  metalness: 0.2,
  randomizeColors: true,
};

export const REALISTIC_WINDOW_CONFIG: WindowLightingConfig = {
  colors: [
    0xfff4e6, // Warm white
    0xffe6cc, // Warm beige
    0xfff0b3, // Soft yellow
    0xffe0cc, // Peach
  ],
  emissiveIntensity: 0.1,
  opacity: 1,
  roughness: 0.2,
  metalness: 0.0,
  randomizeColors: false,
};

/**
 * Enhanced window material enhancement with configurable settings
 */
export const enhanceWindowMaterials = (
  scene: THREE.Scene,
  config: WindowLightingConfig = DEFAULT_WINDOW_CONFIG
): void => {
  scene.traverse((object) => {
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
            meshMaterial.emissive = new THREE.Color(0x222244);
            meshMaterial.emissiveIntensity = 0.3;
          } else {
            meshMaterial.emissive = new THREE.Color(0x050508);
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
