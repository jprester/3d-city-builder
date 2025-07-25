import { ModelCollection } from "../ModelPlacer.js";
import { MODEL_TYPES } from "../definitions/ModelDefinitions.js";
import { colors } from "../../utils/constants.js";

// Demo collection showing per-model emissive configuration
export const emissiveDemoCollection: ModelCollection = {
  name: "emissive-demo-collection",
  models: [
    // Glass cube with custom blue-green theme
    {
      instanceId: "glass-cube-custom",
      modelType: MODEL_TYPES.GLASS_CUBE,
      position: { x: 0, y: 0, z: 0 },
      emissiveConfig: {
        color: [colors.cyan, colors.dodgerBlue, colors.skyBlue], // Cyan to blue gradient
        intensity: 1.2,
        opacity: 0.85,
        randomizeColors: true,
      },
    },

    // High-rise with warm orange/red theme
    {
      instanceId: "high-rise-warm",
      modelType: MODEL_TYPES.HIGH_RISE,
      position: { x: 40, y: 0, z: 0 },
      emissiveConfig: {
        color: [colors.vermilion, colors.darkOrange, colors.darkWarmYellow], // Orange gradient
        intensity: 0.8,
        opacity: 0.9,
        randomizeColors: true,
      },
    },

    // Skyscraper with single purple color
    {
      instanceId: "skyscraper-purple",
      modelType: MODEL_TYPES.SKYSCRAPER_01,
      position: { x: -40, y: 0, z: 0 },
      emissiveConfig: {
        color: colors.mediumPurple, // Single purple color
        intensity: 1.5,
        opacity: 0.8,
        roughness: 0.05,
        metalness: 0.3,
        randomizeColors: false, // Use same color for all windows
      },
    },

    // Another glass cube using definition defaults (no override)
    {
      instanceId: "glass-cube-default",
      modelType: MODEL_TYPES.GLASS_CUBE,
      position: { x: 80, y: 0, z: 0 },
      // Will use emissiveConfig from MODEL_DEFINITIONS.GLASS_CUBE
    },

    // Residential with specific material filtering
    {
      instanceId: "residential-filtered",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 0, y: 0, z: 40 },
      emissiveConfig: {
        color: [colors.canaryYellow, colors.goldenYellow], // Warm yellow tones
        intensity: 0.6,
        opacity: 0.95,
        materialFilter: ["window", "glass", "light"], // Only apply to these materials
        randomizeColors: true,
      },
    },

    // Dark skyscraper with cyberpunk colors
    {
      instanceId: "skyscraper-cyberpunk",
      modelType: MODEL_TYPES.SKYSCRAPER_02,
      position: { x: -80, y: 0, z: 0 },
      emissiveConfig: {
        color: [
          colors.hotPink,
          colors.neonGreen,
          colors.purple,
          colors.electricBlue,
        ], // Hot pink, neon green, purple, cyan
        intensity: 1.8,
        opacity: 0.75,
        roughness: 0.02,
        metalness: 0.4,
        randomizeColors: true,
      },
    },
  ],
};

// Export for easy access
export default emissiveDemoCollection;
