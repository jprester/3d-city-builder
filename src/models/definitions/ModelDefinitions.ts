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
    filePath: "/assets/models/skyscraper_new.glb",
    defaultScale: { x: 2.3, y: 2.3, z: 2.3 },
    category: "commercial",
    description: "A tall commercial skyscraper",
    hasRoofLights: true,
    emissiveConfig: {
      color: colors.cyan, // Bright cyan for futuristic look
      intensity: 1.2,
      opacity: 0.85,
      roughness: 0.05,
      metalness: 0.2,
    },
  },
  SKYSCRAPER_02: {
    id: "SKYSCRAPER_02",
    name: "Skyscraper",
    filePath: "/assets/models/skyscraper_dark.glb",
    defaultScale: { x: 1.8, y: 1.8, z: 1.8 },
    category: "commercial",
    description: "A tall commercial skyscraper",
    hasRoofLights: true,
    emissiveConfig: {
      color: [colors.hotPink, colors.purple], // Hot pink, purple for dark building
      intensity: 1.5,
      opacity: 0.8,
      randomizeColors: true,
    },
  },

  // Residential Series 1 (Small Houses)
  RESIDENTIAL_01_A: {
    id: "RESIDENTIAL_01_A",
    name: "Small House Type A",
    filePath: "/assets/models/s_01_01.obj",
    textures: {
      base: "/assets/textures/building_01.jpg",
      specular: "/assets/textures/building_01_spec.jpg",
      roughness: "/assets/textures/building_01_rough.jpg",
      emissive: "/assets/textures/building_01_em.jpg",
    },
    defaultScale: { x: 0.8, y: 0.8, z: 0.8 },
    category: "residential",
    description: "Small residential house with warm textures",
  },

  RESIDENTIAL_01_B: {
    id: "RESIDENTIAL_01_B",
    name: "Small House Type B",
    filePath: "/assets/models/s_01_02.obj",
    textures: {
      base: "/assets/textures/building_01.jpg",
      specular: "/assets/textures/building_01_spec.jpg",
      roughness: "/assets/textures/building_01_rough.jpg",
      emissive: "/assets/textures/building_01_em.jpg",
    },
    defaultScale: { x: 0.8, y: 0.8, z: 0.8 },
    category: "residential",
    description: "Small residential house variant",
  },

  RESIDENTIAL_01_C: {
    id: "RESIDENTIAL_01_C",
    name: "Small House Type C",
    filePath: "/assets/models/s_01_03.obj",
    textures: {
      base: "/assets/textures/building_01.jpg",
      specular: "/assets/textures/building_01_spec.jpg",
      roughness: "/assets/textures/building_01_rough.jpg",
      emissive: "/assets/textures/building_01_em.jpg",
    },
    defaultScale: { x: 0.8, y: 0.8, z: 0.8 },
    category: "residential",
    description: "Small residential house variant",
  },

  // Residential Series 2 (Mid-size Buildings)
  RESIDENTIAL_02_A: {
    id: "RESIDENTIAL_02_A",
    name: "Mid-size Residential A",
    filePath: "/assets/models/s_02_01.obj",
    textures: {
      base: "/assets/textures/building_03.jpg",
      specular: "/assets/textures/building_03_spec.jpg",
      roughness: "/assets/textures/building_03_rough.jpg",
      emissive: "/assets/textures/building_03_em.jpg",
    },
    defaultScale: { x: 1.0, y: 1.0, z: 1.0 },
    category: "residential",
    description: "Mid-size residential building",
  },

  RESIDENTIAL_02_B: {
    id: "RESIDENTIAL_02_B",
    name: "Mid-size Residential B",
    filePath: "/assets/models/s_02_02.obj",
    textures: {
      base: "/assets/textures/building_04.jpg",
      specular: "/assets/textures/building_04_spec.jpg",
      roughness: "/assets/textures/building_04_rough.jpg",
      emissive: "/assets/textures/building_04_em.jpg",
    },
    defaultScale: { x: 1.0, y: 1.0, z: 1.0 },
    category: "residential",
    description: "Mid-size residential building variant",
  },

  RESIDENTIAL_02_C: {
    id: "RESIDENTIAL_02_C",
    name: "Mid-size Residential C",
    filePath: "/assets/models/s_02_03.obj",
    textures: {
      base: "/assets/textures/building_05.jpg",
      specular: "/assets/textures/building_05_spec.jpg",
      roughness: "/assets/textures/building_05_rough.jpg",
      emissive: "/assets/textures/building_05_em.jpg",
    },
    defaultScale: { x: 1.0, y: 1.0, z: 1.0 },
    category: "residential",
    description: "Mid-size residential building third variant",
  },

  // Commercial Series 3 (Office Buildings)
  COMMERCIAL_03_A: {
    id: "COMMERCIAL_03_A",
    name: "Office Building A",
    filePath: "/assets/models/s_03_01.obj",
    textures: {
      base: "/assets/textures/building_06.jpg",
      specular: "/assets/textures/building_06_spec.jpg",
      roughness: "/assets/textures/building_06_rough.jpg",
      emissive: "/assets/textures/building_06_em.jpg",
    },
    defaultScale: { x: 1.2, y: 1.2, z: 1.2 },
    category: "commercial",
    description: "Commercial office building",
  },

  COMMERCIAL_03_B: {
    id: "COMMERCIAL_03_B",
    name: "Office Building B",
    filePath: "/assets/models/s_03_02.obj",
    textures: {
      base: "/assets/textures/building_07.jpg",
      specular: "/assets/textures/building_07_spec.jpg",
      roughness: "/assets/textures/building_07_rough.jpg",
      emissive: "/assets/textures/building_07_em.jpg",
    },
    defaultScale: { x: 1.2, y: 1.2, z: 1.2 },
    category: "commercial",
    description: "Commercial office building variant",
  },

  COMMERCIAL_03_C: {
    id: "COMMERCIAL_03_C",
    name: "Office Building C",
    filePath: "/assets/models/s_03_03.obj",
    textures: {
      base: "/assets/textures/building_08.jpg",
      specular: "/assets/textures/building_08_spec.jpg",
      roughness: "/assets/textures/building_08_rough.jpg",
      emissive: "/assets/textures/building_08_em.jpg",
    },
    defaultScale: { x: 1.2, y: 1.2, z: 1.2 },
    category: "commercial",
    description: "Commercial office building third variant",
  },

  // Industrial Series 4 (Large Buildings)
  INDUSTRIAL_04_A: {
    id: "INDUSTRIAL_04_A",
    name: "Industrial Building A",
    filePath: "/assets/models/s_04_01.obj",
    textures: {
      base: "/assets/textures/building_09.jpg",
      specular: "/assets/textures/building_09_spec.jpg",
      roughness: "/assets/textures/building_09_rough.jpg",
      emissive: "/assets/textures/building_09_em.jpg",
    },
    defaultScale: { x: 1.5, y: 1.5, z: 1.5 },
    category: "industrial",
    description: "Large industrial building",
  },

  INDUSTRIAL_04_B: {
    id: "INDUSTRIAL_04_B",
    name: "Industrial Building B",
    filePath: "/assets/models/s_04_02.obj",
    textures: {
      base: "/assets/textures/building_10.jpg",
      specular: "/assets/textures/building_10_spec.jpg",
      roughness: "/assets/textures/building_10_rough.jpg",
      emissive: "/assets/textures/building_10_em.jpg",
    },
    defaultScale: { x: 1.5, y: 1.5, z: 1.5 },
    category: "industrial",
    description: "Large industrial building variant",
  },

  INDUSTRIAL_04_C: {
    id: "INDUSTRIAL_04_C",
    name: "Industrial Building C",
    filePath: "/assets/models/s_04_03.obj",
    textures: {
      base: "/assets/textures/building.jpg", // Fallback texture
      specular: "/assets/textures/building_01_spec.jpg",
      roughness: "/assets/textures/building_01_rough.jpg",
      emissive: "/assets/textures/building_01_em.jpg",
    },
    defaultScale: { x: 1.5, y: 1.5, z: 1.5 },
    category: "industrial",
    description: "Large industrial building third variant",
  },

  // Mixed-use Series 5 (Modern Buildings)
  MIXED_USE_05_A: {
    id: "MIXED_USE_05_A",
    name: "Modern Mixed-use A",
    filePath: "/assets/models/s_05_01.obj",
    textures: {
      base: "/assets/textures/building_03.jpg",
      specular: "/assets/textures/building_03_spec.jpg",
      roughness: "/assets/textures/building_03_rough.jpg",
      emissive: "/assets/textures/building_03_em.jpg",
    },
    defaultScale: { x: 1.3, y: 1.3, z: 1.3 },
    category: "mixed-use",
    description: "Modern mixed-use building",
  },

  MIXED_USE_05_B: {
    id: "MIXED_USE_05_B",
    name: "Modern Mixed-use B",
    filePath: "/assets/models/s_05_02.obj",
    textures: {
      base: "/assets/textures/building_05.jpg",
      specular: "/assets/textures/building_05_spec.jpg",
      roughness: "/assets/textures/building_05_rough.jpg",
      emissive: "/assets/textures/building_05_em.jpg",
    },
    defaultScale: { x: 1.3, y: 1.3, z: 1.3 },
    category: "mixed-use",
    description: "Modern mixed-use building variant",
  },

  MIXED_USE_05_C: {
    id: "MIXED_USE_05_C",
    name: "Modern Mixed-use C",
    filePath: "/assets/models/s_05_03.obj",
    textures: {
      base: "/assets/textures/building_07.jpg",
      specular: "/assets/textures/building_07_spec.jpg",
      roughness: "/assets/textures/building_07_rough.jpg",
      emissive: "/assets/textures/building_07_em.jpg",
    },
    defaultScale: { x: 1.3, y: 1.3, z: 1.3 },
    category: "mixed-use",
    description: "Modern mixed-use building third variant",
  },

  // Mega Buildings (Skyscrapers)
  MEGA_TOWER_01: {
    id: "MEGA_TOWER_01",
    name: "Mega Tower 1",
    filePath: "/assets/models/mega_01.obj",
    textures: {
      base: "/assets/textures/mega_building_01.jpg",
      emissive: "/assets/textures/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower",
    hasRoofLights: true,
  },

  MEGA_TOWER_02: {
    id: "MEGA_TOWER_02",
    name: "Mega Tower 2",
    filePath: "/assets/models/mega_02.obj",
    textures: {
      base: "/assets/textures/mega_building_01.jpg",
      emissive: "/assets/textures/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_03: {
    id: "MEGA_TOWER_03",
    name: "Mega Tower 3",
    filePath: "/assets/models/mega_03.obj",
    textures: {
      base: "/assets/textures/mega_building_01.jpg",
      emissive: "/assets/textures/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower third variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_04: {
    id: "MEGA_TOWER_04",
    name: "Mega Tower 4",
    filePath: "/assets/models/mega_04.obj",
    textures: {
      base: "/assets/textures/mega_building_01.jpg",
      emissive: "/assets/textures/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower fourth variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_05: {
    id: "MEGA_TOWER_05",
    name: "Mega Tower 5",
    filePath: "/assets/models/mega_05.obj",
    textures: {
      base: "/assets/textures/mega_building_01.jpg",
      emissive: "/assets/textures/mega_building_01_em.jpg",
    },
    defaultScale: { x: 2.0, y: 2.0, z: 2.0 },
    category: "skyscraper",
    description: "Massive skyscraper tower fifth variant",
    hasRoofLights: true,
  },

  MEGA_TOWER_06: {
    id: "MEGA_TOWER_06",
    name: "Mega Tower 6",
    filePath: "/assets/models/mega_06.obj",
    textures: {
      base: "/assets/textures/mega_building_01.jpg",
      emissive: "/assets/textures/mega_building_01_em.jpg",
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
      base: "/assets/textures/ground.jpg",
      emissive: "/assets/textures/ground_em.jpg",
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

// Type-safe model type constants
export const MODEL_TYPES = {
  GLASS_CUBE: "GLASS_CUBE" as const,
  HIGH_RISE: "HIGH_RISE" as const,
  SKYSCRAPER_01: "SKYSCRAPER_01" as const,
  SKYSCRAPER_02: "SKYSCRAPER_02" as const,

  // Residential buildings
  RESIDENTIAL_01_A: "RESIDENTIAL_01_A" as const,
  RESIDENTIAL_01_B: "RESIDENTIAL_01_B" as const,
  RESIDENTIAL_01_C: "RESIDENTIAL_01_C" as const,
  RESIDENTIAL_02_A: "RESIDENTIAL_02_A" as const,
  RESIDENTIAL_02_B: "RESIDENTIAL_02_B" as const,
  RESIDENTIAL_02_C: "RESIDENTIAL_02_C" as const,

  // Commercial buildings
  COMMERCIAL_03_A: "COMMERCIAL_03_A" as const,
  COMMERCIAL_03_B: "COMMERCIAL_03_B" as const,
  COMMERCIAL_03_C: "COMMERCIAL_03_C" as const,

  // Industrial buildings
  INDUSTRIAL_04_A: "INDUSTRIAL_04_A" as const,
  INDUSTRIAL_04_B: "INDUSTRIAL_04_B" as const,
  INDUSTRIAL_04_C: "INDUSTRIAL_04_C" as const,

  // Mixed-use buildings
  MIXED_USE_05_A: "MIXED_USE_05_A" as const,
  MIXED_USE_05_B: "MIXED_USE_05_B" as const,
  MIXED_USE_05_C: "MIXED_USE_05_C" as const,

  // Mega towers
  MEGA_TOWER_01: "MEGA_TOWER_01" as const,
  MEGA_TOWER_02: "MEGA_TOWER_02" as const,
  MEGA_TOWER_03: "MEGA_TOWER_03" as const,
  MEGA_TOWER_04: "MEGA_TOWER_04" as const,
  MEGA_TOWER_05: "MEGA_TOWER_05" as const,
  MEGA_TOWER_06: "MEGA_TOWER_06" as const,

  // Environment elements
  GROUND_PLANE: "GROUND_PLANE" as const,
} as const;

export type ModelType = (typeof MODEL_TYPES)[keyof typeof MODEL_TYPES];
