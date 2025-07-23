import { ModelTextures } from "../AssetManager.js";

export interface ModelDefinition {
  id: string;
  name: string;
  filePath: string;
  textures?: ModelTextures;
  defaultScale?: { x: number; y: number; z: number };
  category?: string;
  description?: string;
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
    description: "A modern glass cube building"
  },
  
  HIGH_RISE: {
    id: "HIGH_RISE",
    name: "High Rise Building",
    filePath: "/assets/models/high-rise-building.glb",
    defaultScale: { x: 1, y: 1, z: 1 },
    category: "commercial",
    description: "A tall commercial high-rise building"
  },

  RESIDENTIAL_01: {
    id: "RESIDENTIAL_01",
    name: "Residential Building Type 1",
    filePath: "/assets/models/s_01_01.obj",
    textures: {
      base: "/assets/textures/building_01.jpg",
      specular: "/assets/textures/building_01_spec.jpg",
      roughness: "/assets/textures/building_01_rough.jpg",
      emissive: "/assets/textures/building_01_em.jpg"
    },
    defaultScale: { x: 0.8, y: 0.8, z: 0.8 },
    category: "residential",
    description: "A residential building with detailed textures"
  },

  RESIDENTIAL_02: {
    id: "RESIDENTIAL_02",
    name: "Residential Building Type 2",
    filePath: "/assets/models/s_01_02.obj",
    textures: {
      base: "/assets/textures/building_02.jpg",
      specular: "/assets/textures/building_02_spec.jpg",
      roughness: "/assets/textures/building_02_rough.jpg",
      emissive: "/assets/textures/building_02_em.jpg"
    },
    defaultScale: { x: 0.6, y: 0.6, z: 0.6 },
    category: "residential",
    description: "Another residential building variant with different textures"
  }
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
    return Object.values(this.definitions).filter(def => def.category === category);
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
  RESIDENTIAL_01: "RESIDENTIAL_01" as const,
  RESIDENTIAL_02: "RESIDENTIAL_02" as const,
} as const;

export type ModelType = typeof MODEL_TYPES[keyof typeof MODEL_TYPES];