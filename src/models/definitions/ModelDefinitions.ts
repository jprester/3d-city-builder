import * as THREE from "three";
import { ModelTextures } from "../AssetManager.js";
import { colors } from "../../utils/constants.js";

export interface EmissiveConfig {
  color?: number | number[]; // Single color or array of colors
  intensity?: number;
  opacity?: number;
  roughness?: number;
  metalness?: number;
  randomizeColors?: boolean;
  materialFilter?: string[]; // Names of materials to apply emissive to
}

export interface AdDefinition {
  id: string;
  name: string;
  diffusePath: string;
  emissivePath?: string;
  defaultSize?: { width: number; height: number };
  emissiveColor?: number | THREE.Color;
  emissiveIntensity?: number;
  doubleSided?: boolean;
  crispEmissive?: boolean;
  excludeFromEffects?: boolean;
  category?: string; // e.g., "ad", "billboard"
  description?: string;
}

export type AdRegistry = Record<string, AdDefinition>;

export interface ModelDefinition {
  id: string;
  name: string;
  filePath: string;
  textures?: ModelTextures;
  defaultScale?: { x: number; y: number; z: number };
  category?: string;
  description?: string;
  emissiveConfig?: EmissiveConfig;
  excludeFromEffects?: boolean; // Flag to exclude from post-processing effects
  hasRoofLights?: boolean; // Flag to enable red roof lights for tall buildings
}

export interface ModelRegistry {
  [key: string]: ModelDefinition;
}

// Define all available model types
export const MODEL_DEFINITIONS: ModelRegistry = {
  GLASS_CUBE: {
    id: "GLASS_CUBE",
    name: "Glass Cube Building",
    filePath: "/assets/models/glassyCube.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "modern",
    description: "A modern glass cube building",
    emissiveConfig: {
      color: [colors.coolBlue, colors.warmWhite, colors.lightBlue], // Cool blue, warm white, light blue
      intensity: 0.8,
      opacity: 0.9,
      randomizeColors: true,
    },
  },

  HIGH_RISE: {
    id: "HIGH_RISE",
    name: "High Rise Building",
    filePath: "/assets/models/high-rise-building.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "A tall commercial high-rise building",
    hasRoofLights: true,
    emissiveConfig: {
      color: [colors.warmYellow, colors.orangeYellow], // Warm yellow, orange
      intensity: 0.6,
      opacity: 0.95,
      randomizeColors: true,
    },
  },
  SKYSCRAPER_01: {
    id: "SKYSCRAPER_01",
    name: "Skyscraper",
    filePath: "/assets/models/blue-skyscraper.glb",
    defaultScale: { x: 2.3, y: 2.3, z: 2.3 },
    category: "commercial",
    description: "A tall commercial skyscraper",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.lightPeach, // Bright peach for futuristic look
      intensity: 2,
      opacity: 0.98,
    },
  },
  SKYSCRAPER_02: {
    id: "SKYSCRAPER_02",
    name: "Skyscraper",
    filePath: "/assets/models/dark_skyscraper.glb",
    defaultScale: { x: 1.8, y: 1.8, z: 1.8 },
    category: "commercial",
    description: "A tall commercial skyscraper",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.softYellow,
      intensity: 2,
      opacity: 0.98,
    },
  },

  // Residential Series 1 (Small Houses)
  RESIDENTIAL_01_A: {
    id: "RESIDENTIAL_01_A",
    name: "Small House Type A",
    filePath: "/assets/models/synthcity/s_01_01.obj",
    textures: {
      base: "/assets/textures/synthcity/building_01.jpg",
      specular: "/assets/textures/synthcity/building_01_spec.jpg",
      roughness: "/assets/textures/synthcity/building_01_rough.jpg",
      emissive: "/assets/textures/synthcity/building_01_em.jpg",
    },
    defaultScale: { x: 0.8, y: 0.8, z: 0.8 },
    category: "residential",
    description: "Small residential house with warm textures",
  },

  RESIDENTIAL_01_B: {
    id: "RESIDENTIAL_01_B",
    name: "Small House Type B",
    filePath: "/assets/models/synthcity/s_01_02.obj",
    textures: {
      base: "/assets/textures/synthcity/building_01.jpg",
      specular: "/assets/textures/synthcity/building_01_spec.jpg",
      roughness: "/assets/textures/synthcity/building_01_rough.jpg",
      emissive: "/assets/textures/synthcity/building_01_em.jpg",
    },
    defaultScale: { x: 0.8, y: 0.8, z: 0.8 },
    category: "residential",
    description: "Small residential house variant",
  },

  RESIDENTIAL_01_C: {
    id: "RESIDENTIAL_01_C",
    name: "Small House Type C",
    filePath: "/assets/models/synthcity/s_01_03.obj",
    textures: {
      base: "/assets/textures/synthcity/building_01.jpg",
      specular: "/assets/textures/synthcity/building_01_spec.jpg",
      roughness: "/assets/textures/synthcity/building_01_rough.jpg",
      emissive: "/assets/textures/synthcity/building_01_em.jpg",
    },
    defaultScale: { x: 0.8, y: 0.8, z: 0.8 },
    category: "residential",
    description: "Small residential house variant",
  },

  // Residential Series 2 (Mid-size Buildings)
  RESIDENTIAL_02_A: {
    id: "RESIDENTIAL_02_A",
    name: "Mid-size Residential A",
    filePath: "/assets/models/synthcity/s_02_01.obj",
    textures: {
      base: "/assets/textures/synthcity/building_03.jpg",
      specular: "/assets/textures/synthcity/building_03_spec.jpg",
      roughness: "/assets/textures/synthcity/building_03_rough.jpg",
      emissive: "/assets/textures/synthcity/building_03_em.jpg",
    },
    defaultScale: { x: 1.0, y: 1.0, z: 1.0 },
    category: "residential",
    description: "Mid-size residential building",
  },

  RESIDENTIAL_02_B: {
    id: "RESIDENTIAL_02_B",
    name: "Mid-size Residential B",
    filePath: "/assets/models/synthcity/s_02_02.obj",
    textures: {
      base: "/assets/textures/synthcity/building_04.jpg",
      specular: "/assets/textures/synthcity/building_04_spec.jpg",
      roughness: "/assets/textures/synthcity/building_04_rough.jpg",
      emissive: "/assets/textures/synthcity/building_04_em.jpg",
    },
    defaultScale: { x: 1.0, y: 1.0, z: 1.0 },
    category: "residential",
    description: "Mid-size residential building variant",
  },

  RESIDENTIAL_02_C: {
    id: "RESIDENTIAL_02_C",
    name: "Mid-size Residential C",
    filePath: "/assets/models/synthcity/s_02_03.obj",
    textures: {
      base: "/assets/textures/synthcity/building_05.jpg",
      specular: "/assets/textures/synthcity/building_05_spec.jpg",
      roughness: "/assets/textures/synthcity/building_05_rough.jpg",
      emissive: "/assets/textures/synthcity/building_05_em.jpg",
    },
    defaultScale: { x: 1.0, y: 1.0, z: 1.0 },
    category: "residential",
    description: "Mid-size residential building third variant",
  },

  // Commercial Series 3 (Office Buildings)
  COMMERCIAL_03_A: {
    id: "COMMERCIAL_03_A",
    name: "Office Building A",
    filePath: "/assets/models/synthcity/s_03_01.obj",
    textures: {
      base: "/assets/textures/synthcity/building_06.jpg",
      specular: "/assets/textures/synthcity/building_06_spec.jpg",
      roughness: "/assets/textures/synthcity/building_06_rough.jpg",
      emissive: "/assets/textures/synthcity/building_06_em.jpg",
    },
    defaultScale: { x: 1.2, y: 1.2, z: 1.2 },
    category: "commercial",
    description: "Commercial office building",
  },

  COMMERCIAL_03_B: {
    id: "COMMERCIAL_03_B",
    name: "Office Building B",
    filePath: "/assets/models/synthcity/s_03_02.obj",
    textures: {
      base: "/assets/textures/synthcity/building_07.jpg",
      specular: "/assets/textures/synthcity/building_07_spec.jpg",
      roughness: "/assets/textures/synthcity/building_07_rough.jpg",
      emissive: "/assets/textures/synthcity/building_07_em.jpg",
    },
    defaultScale: { x: 1.2, y: 1.2, z: 1.2 },
    category: "commercial",
    description: "Commercial office building variant",
  },

  COMMERCIAL_03_C: {
    id: "COMMERCIAL_03_C",
    name: "Office Building C",
    filePath: "/assets/models/synthcity/s_03_03.obj",
    textures: {
      base: "/assets/textures/synthcity/building_08.jpg",
      specular: "/assets/textures/synthcity/building_08_spec.jpg",
      roughness: "/assets/textures/synthcity/building_08_rough.jpg",
      emissive: "/assets/textures/synthcity/building_08_em.jpg",
    },
    defaultScale: { x: 1.2, y: 1.2, z: 1.2 },
    category: "commercial",
    description: "Commercial office building third variant",
  },

  // Industrial Series 4 (Large Buildings)
  INDUSTRIAL_04_A: {
    id: "INDUSTRIAL_04_A",
    name: "Industrial Building A",
    filePath: "/assets/models/synthcity/s_04_01.obj",
    textures: {
      base: "/assets/textures/synthcity/building_09.jpg",
      specular: "/assets/textures/synthcity/building_09_spec.jpg",
      roughness: "/assets/textures/synthcity/building_09_rough.jpg",
      emissive: "/assets/textures/synthcity/building_09_em.jpg",
    },
    defaultScale: { x: 1.5, y: 1.5, z: 1.5 },
    category: "industrial",
    description: "Large industrial building",
  },

  INDUSTRIAL_04_B: {
    id: "INDUSTRIAL_04_B",
    name: "Industrial Building B",
    filePath: "/assets/models/synthcity/s_04_02.obj",
    textures: {
      base: "/assets/textures/synthcity/building_10.jpg",
      specular: "/assets/textures/synthcity/building_10_spec.jpg",
      roughness: "/assets/textures/synthcity/building_10_rough.jpg",
      emissive: "/assets/textures/synthcity/building_10_em.jpg",
    },
    defaultScale: { x: 1.5, y: 1.5, z: 1.5 },
    category: "industrial",
    description: "Large industrial building variant",
  },

  INDUSTRIAL_04_C: {
    id: "INDUSTRIAL_04_C",
    name: "Industrial Building C",
    filePath: "/assets/models/synthcity/s_04_03.obj",
    textures: {
      base: "/assets/textures/synthcity/building.jpg", // Fallback texture
      specular: "/assets/textures/synthcity/building_01_spec.jpg",
      roughness: "/assets/textures/synthcity/building_01_rough.jpg",
      emissive: "/assets/textures/synthcity/building_01_em.jpg",
    },
    defaultScale: { x: 1.5, y: 1.5, z: 1.5 },
    category: "industrial",
    description: "Large industrial building third variant",
  },

  // Mixed-use Series 5 (Modern Buildings)
  MIXED_USE_05_A: {
    id: "MIXED_USE_05_A",
    name: "Modern Mixed-use A",
    filePath: "/assets/models/synthcity/s_05_01.obj",
    textures: {
      base: "/assets/textures/synthcity/building_03.jpg",
      specular: "/assets/textures/synthcity/building_03_spec.jpg",
      roughness: "/assets/textures/synthcity/building_03_rough.jpg",
      emissive: "/assets/textures/synthcity/building_03_em.jpg",
    },
    defaultScale: { x: 1.3, y: 1.3, z: 1.3 },
    category: "mixed-use",
    description: "Modern mixed-use building",
  },

  MIXED_USE_05_B: {
    id: "MIXED_USE_05_B",
    name: "Modern Mixed-use B",
    filePath: "/assets/models/synthcity/s_05_02.obj",
    textures: {
      base: "/assets/textures/synthcity/building_05.jpg",
      specular: "/assets/textures/synthcity/building_05_spec.jpg",
      roughness: "/assets/textures/synthcity/building_05_rough.jpg",
      emissive: "/assets/textures/synthcity/building_05_em.jpg",
    },
    defaultScale: { x: 1.3, y: 1.3, z: 1.3 },
    category: "mixed-use",
    description: "Modern mixed-use building variant",
  },

  MIXED_USE_05_C: {
    id: "MIXED_USE_05_C",
    name: "Modern Mixed-use C",
    filePath: "/assets/models/synthcity/s_05_03.obj",
    textures: {
      base: "/assets/textures/synthcity/building_07.jpg",
      specular: "/assets/textures/synthcity/building_07_spec.jpg",
      roughness: "/assets/textures/synthcity/building_07_rough.jpg",
      emissive: "/assets/textures/synthcity/building_07_em.jpg",
    },
    defaultScale: { x: 1.3, y: 1.3, z: 1.3 },
    category: "mixed-use",
    description: "Modern mixed-use building third variant",
  },

  // Mega Buildings (Skyscrapers)
  MEGA_TOWER_01: {
    id: "MEGA_TOWER_01",
    name: "Mega Tower 1",
    filePath: "/assets/models/synthcity/mega_01.obj",
    textures: {
      base: "/assets/textures/synthcity/mega_building_01.jpg",
      emissive: "/assets/textures/synthcity/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower",
    hasRoofLights: true,
  },

  MEGA_TOWER_02: {
    id: "MEGA_TOWER_02",
    name: "Mega Tower 2",
    filePath: "/assets/models/synthcity/mega_02.obj",
    textures: {
      base: "/assets/textures/synthcity/mega_building_01.jpg",
      emissive: "/assets/textures/synthcity/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_03: {
    id: "MEGA_TOWER_03",
    name: "Mega Tower 3",
    filePath: "/assets/models/synthcity/mega_03.obj",
    textures: {
      base: "/assets/textures/synthcity/mega_building_01.jpg",
      emissive: "/assets/textures/synthcity/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower third variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_04: {
    id: "MEGA_TOWER_04",
    name: "Mega Tower 4",
    filePath: "/assets/models/synthcity/mega_04.obj",
    textures: {
      base: "/assets/textures/synthcity/mega_building_01.jpg",
      emissive: "/assets/textures/synthcity/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower fourth variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_05: {
    id: "MEGA_TOWER_05",
    name: "Mega Tower 5",
    filePath: "/assets/models/synthcity/mega_05.obj",
    textures: {
      base: "/assets/textures/synthcity/mega_building_01.jpg",
      emissive: "/assets/textures/synthcity/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower fifth variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_06: {
    id: "MEGA_TOWER_06",
    name: "Mega Tower 6",
    filePath: "/assets/models/synthcity/mega_06.obj",
    textures: {
      base: "/assets/textures/synthcity/mega_building_01.jpg",
      emissive: "/assets/textures/synthcity/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower sixth variant",
    hasRoofLights: true,
  },

  // Environment elements
  GROUND_PLANE: {
    id: "GROUND_PLANE",
    name: "Ground Plane",
    filePath: "", // No file path needed for procedural geometry
    textures: {
      base: "/assets/textures/synthcity/ground.jpg",
      emissive: "/assets/textures/synthcity/ground_em.jpg",
    },
    emissiveConfig: {
      color: [colors.lightBlue], // Warm yellow, orange
      intensity: 0.5,
      opacity: 1,
      randomizeColors: false,
    },
    excludeFromEffects: true, // Exclude ground plane from post-processing effects
    defaultScale: { x: 30, y: 30, z: 30 },
    category: "environment",
    description: "Ground plane with texture mapping for scene base",
  },

  // ============================================
  // LOW-POLY CITY BUILDINGS (Atlas-Textured)
  // ============================================
  LP_MODULAR_SKYSCRAPER: {
    id: "LP_MODULAR_SKYSCRAPER",
    name: "Low-Poly Modular Skyscraper",
    filePath: "/assets/models/low-poly-city-buildings/modular-skyscraper.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "skyscraper",
    description: "Modular low-poly skyscraper with built-in textures",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 0.8,
    },
  },

  LP_CURVED_SKYSCRAPER: {
    id: "LP_CURVED_SKYSCRAPER",
    name: "Curved Skyscraper",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/curved-skyscraper.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "skyscraper",
    description: "Modern curved facade skyscraper",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.offWhite,
      intensity: 1.2,
    },
  },

  LP_BLOCKY_BUILDING_LOGO: {
    id: "LP_BLOCKY_BUILDING_LOGO",
    name: "Blocky Building with Logo",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/blocky-building_nt_alpha_logo.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Blocky commercial building with logo area",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_BLOCKY_BUILDING: {
    id: "LP_BLOCKY_BUILDING",
    name: "Blocky Building",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/blocky-building_nt.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Blocky commercial building",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_BRUTALIST_OFFICE: {
    id: "LP_BRUTALIST_OFFICE",
    name: "Brutalist Office Building",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/brutalist-office-building.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Brutalist architecture office building",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_HOTEL_BUILDING: {
    id: "LP_HOTEL_BUILDING",
    name: "Hotel Building",
    filePath: "/assets/models/low-poly-city-buildings/hotel-building.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Mid-rise hotel with built-in textures",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_ROUNDED_CORNER: {
    id: "LP_ROUNDED_CORNER",
    name: "Rounded Corner Building",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/rounded-corners-building.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Modern building with rounded corners",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_BOX_BUILDING: {
    id: "LP_BOX_BUILDING",
    name: "Box-Like Building",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/box-like-building.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Simple rectangular commercial building",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_GLASSY_OFFICE: {
    id: "LP_GLASSY_OFFICE",
    name: "Glassy Office Building",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/glassy-office-building.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Modern glass facade office building",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_MULTI_LEVEL_SKYSCRAPER: {
    id: "LP_MULTI_LEVEL_SKYSCRAPER",
    name: "Multi-Level Skyscraper",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/multi-level-skyscraper.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "skyscraper",
    description: "Tall skyscraper with stepped levels",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_NY_SKYSCRAPER: {
    id: "LP_NY_SKYSCRAPER",
    name: "NY-Style Skyscraper",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/ny-skyscraper.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "skyscraper",
    description: "Art deco New York-style skyscraper",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_PUBLIC_BUILDING: {
    id: "LP_PUBLIC_BUILDING",
    name: "Public Building",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/public-building.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "public",
    description: "Public/government building",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_RECTANGULAR_SKYSCRAPER: {
    id: "LP_RECTANGULAR_SKYSCRAPER",
    name: "Rectangular Skyscraper",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/rectangular-skyscraper.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "skyscraper",
    description: "Classic rectangular tower",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_RESIDENTIAL_COMPLEX: {
    id: "LP_RESIDENTIAL_COMPLEX",
    name: "Residential Complex",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/residential-complex-building.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "residential",
    description: "Multi-unit residential complex",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  LP_STANDARD_OFFICE: {
    id: "LP_STANDARD_OFFICE",
    name: "Standard Office Building",
    filePath: "/assets/models/low-poly-city-buildings/no-textures/standard-office-building.glb",
    textures: {
      base: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-diffuse.jpeg",
      roughness: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-roughness.jpg",
      normal: "/assets/textures/low-poly-city-buildings/lp-buildings-textures-normal.jpeg",
      emissive: "/assets/textures/low-poly-city-buildings/lp-buildings-emissive-updated.jpg",
    },
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Standard office building",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.0,
    },
  },

  // ============================================
  // PREMIUM BUILDINGS (Root Models Folder)
  // ============================================
  PREMIUM_NY_OFFICE: {
    id: "PREMIUM_NY_OFFICE",
    name: "NY Office Building",
    filePath: "/assets/models/ny-office-building-optimized2.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "skyscraper",
    description: "Premium NY office building with detailed facade",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.offWhite,
      intensity: 1.2,
    },
  },

  PREMIUM_AD_BUILDING: {
    id: "PREMIUM_AD_BUILDING",
    name: "Advertisement Building",
    filePath: "/assets/models/advertisment-building.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "Building with large advertisement display areas",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.4,
      roughness: 1,
    },
  },

  PREMIUM_CYBERPUNK_APARTMENT: {
    id: "PREMIUM_CYBERPUNK_APARTMENT",
    name: "Cyberpunk Apartment",
    filePath: "/assets/models/cyberpunk-apartment-building.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "residential",
    description: "Futuristic cyberpunk apartment complex",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.4,
    },
  },

  PREMIUM_ANIME_RESIDENTIAL: {
    id: "PREMIUM_ANIME_RESIDENTIAL",
    name: "Anime Residential Building",
    filePath: "/assets/models/anime-residential-building.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "residential",
    description: "Anime-style residential building",
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 1.4,
    },
  },

  PREMIUM_DARK_SKYSCRAPER: {
    id: "PREMIUM_DARK_SKYSCRAPER",
    name: "Dark Skyscraper",
    filePath: "/assets/models/dark_skyscraper_new2.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "skyscraper",
    description: "Dramatic dark-themed skyscraper",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.lightPeach,
      intensity: 3.0,
    },
  },
};

// Ad definitions registry
export const AD_DEFINITIONS: AdRegistry = {
  NEON_SIGN_TEST: {
    id: "NEON_SIGN_TEST",
    name: "Neon Sign Test",
    diffusePath: "/assets/textures/neon-sign-test-diffuse.jpg",
    emissivePath: "/assets/textures/neon-sign-test-emissive.jpg",
    defaultSize: { width: 32, height: 8 },
    emissiveColor: colors.warmWhite,
    emissiveIntensity: 1.0,
    doubleSided: true,
    crispEmissive: true,
    excludeFromEffects: true,
    category: "ad",
    description: "Sample neon sign used for development",
  },
};

// Helper functions for working with model definitions
export class ModelDefinitionRegistry {
  private static definitions = MODEL_DEFINITIONS;

  static getDefinition(modelType: string): ModelDefinition | undefined {
    return this.definitions[modelType];
  }

  static getAllDefinitions(): ModelDefinition[] {
    return Object.values(this.definitions);
  }

  static getDefinitionsByCategory(category: string): ModelDefinition[] {
    return Object.values(this.definitions).filter(
      (def) => def.category === category
    );
  }

  static addDefinition(definition: ModelDefinition): void {
    this.definitions[definition.id] = definition;
  }

  static hasDefinition(modelType: string): boolean {
    return modelType in this.definitions;
  }

  static validateDefinition(modelType: string): boolean {
    const definition = this.getDefinition(modelType);
    if (!definition) {
      console.error(`Model definition not found: ${modelType}`);
      return false;
    }

    if (!definition.filePath) {
      console.error(`Model definition missing filePath: ${modelType}`);
      return false;
    }

    return true;
  }

  static getAvailableModelTypes(): string[] {
    return Object.keys(this.definitions);
  }
}

// Helper functions for working with ad definitions
export class AdDefinitionRegistry {
  private static definitions = AD_DEFINITIONS;

  static getDefinition(adType: string): AdDefinition | undefined {
    return this.definitions[adType];
  }

  static getAllDefinitions(): AdDefinition[] {
    return Object.values(this.definitions);
  }

  static getDefinitionsByCategory(category: string): AdDefinition[] {
    return Object.values(this.definitions).filter(
      (def) => def.category === category
    );
  }

  static addDefinition(definition: AdDefinition): void {
    this.definitions[definition.id] = definition;
  }

  static hasDefinition(adType: string): boolean {
    return adType in this.definitions;
  }

  static getAvailableAdTypes(): string[] {
    return Object.keys(this.definitions);
  }
}

// Type-safe model type constants
export const MODEL_TYPES = {
  GLASS_CUBE: "GLASS_CUBE" as const,
  HIGH_RISE: "HIGH_RISE" as const,
  SKYSCRAPER_01: "SKYSCRAPER_01" as const,
  SKYSCRAPER_02: "SKYSCRAPER_02" as const,

  // Residential buildings (Synthcity - legacy)
  RESIDENTIAL_01_A: "RESIDENTIAL_01_A" as const,
  RESIDENTIAL_01_B: "RESIDENTIAL_01_B" as const,
  RESIDENTIAL_01_C: "RESIDENTIAL_01_C" as const,
  RESIDENTIAL_02_A: "RESIDENTIAL_02_A" as const,
  RESIDENTIAL_02_B: "RESIDENTIAL_02_B" as const,
  RESIDENTIAL_02_C: "RESIDENTIAL_02_C" as const,

  // Commercial buildings (Synthcity - legacy)
  COMMERCIAL_03_A: "COMMERCIAL_03_A" as const,
  COMMERCIAL_03_B: "COMMERCIAL_03_B" as const,
  COMMERCIAL_03_C: "COMMERCIAL_03_C" as const,

  // Industrial buildings (Synthcity - legacy)
  INDUSTRIAL_04_A: "INDUSTRIAL_04_A" as const,
  INDUSTRIAL_04_B: "INDUSTRIAL_04_B" as const,
  INDUSTRIAL_04_C: "INDUSTRIAL_04_C" as const,

  // Mixed-use buildings (Synthcity - legacy)
  MIXED_USE_05_A: "MIXED_USE_05_A" as const,
  MIXED_USE_05_B: "MIXED_USE_05_B" as const,
  MIXED_USE_05_C: "MIXED_USE_05_C" as const,

  // Mega towers (Synthcity - legacy)
  MEGA_TOWER_01: "MEGA_TOWER_01" as const,
  MEGA_TOWER_02: "MEGA_TOWER_02" as const,
  MEGA_TOWER_03: "MEGA_TOWER_03" as const,
  MEGA_TOWER_04: "MEGA_TOWER_04" as const,
  MEGA_TOWER_05: "MEGA_TOWER_05" as const,
  MEGA_TOWER_06: "MEGA_TOWER_06" as const,

  // Low-poly city buildings
  LP_MODULAR_SKYSCRAPER: "LP_MODULAR_SKYSCRAPER" as const,
  LP_CURVED_SKYSCRAPER: "LP_CURVED_SKYSCRAPER" as const,
  LP_BLOCKY_BUILDING_LOGO: "LP_BLOCKY_BUILDING_LOGO" as const,
  LP_BLOCKY_BUILDING: "LP_BLOCKY_BUILDING" as const,
  LP_BRUTALIST_OFFICE: "LP_BRUTALIST_OFFICE" as const,
  LP_HOTEL_BUILDING: "LP_HOTEL_BUILDING" as const,
  LP_ROUNDED_CORNER: "LP_ROUNDED_CORNER" as const,
  LP_BOX_BUILDING: "LP_BOX_BUILDING" as const,
  LP_GLASSY_OFFICE: "LP_GLASSY_OFFICE" as const,
  LP_MULTI_LEVEL_SKYSCRAPER: "LP_MULTI_LEVEL_SKYSCRAPER" as const,
  LP_NY_SKYSCRAPER: "LP_NY_SKYSCRAPER" as const,
  LP_PUBLIC_BUILDING: "LP_PUBLIC_BUILDING" as const,
  LP_RECTANGULAR_SKYSCRAPER: "LP_RECTANGULAR_SKYSCRAPER" as const,
  LP_RESIDENTIAL_COMPLEX: "LP_RESIDENTIAL_COMPLEX" as const,
  LP_STANDARD_OFFICE: "LP_STANDARD_OFFICE" as const,

  // Premium buildings
  PREMIUM_NY_OFFICE: "PREMIUM_NY_OFFICE" as const,
  PREMIUM_AD_BUILDING: "PREMIUM_AD_BUILDING" as const,
  PREMIUM_CYBERPUNK_APARTMENT: "PREMIUM_CYBERPUNK_APARTMENT" as const,
  PREMIUM_ANIME_RESIDENTIAL: "PREMIUM_ANIME_RESIDENTIAL" as const,
  PREMIUM_DARK_SKYSCRAPER: "PREMIUM_DARK_SKYSCRAPER" as const,

  // Environment elements
  GROUND_PLANE: "GROUND_PLANE" as const,
} as const;

export type ModelType = (typeof MODEL_TYPES)[keyof typeof MODEL_TYPES];

// Type-safe ad type constants
export const AD_TYPES = {
  NEON_SIGN_TEST: "NEON_SIGN_TEST" as const,
} as const;

export type AdType = (typeof AD_TYPES)[keyof typeof AD_TYPES];
