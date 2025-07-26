import * as THREE from "three";
import { AssetManager } from "./AssetManager.js";
import {
  ModelDefinitionRegistry,
  ModelType,
  type EmissiveConfig,
} from "./definitions/ModelDefinitions.js";
import {
  InstancedModelPlacer,
  InstancedCollection,
  type PlacedInstancedModel,
} from "./InstancedModelPlacer.js";
import { applyEmissiveToObject } from "../utils/windowLightingUtils.js";

export interface ModelPosition {
  x: number;
  y: number;
  z: number;
}

export interface ModelScale {
  x: number;
  y: number;
  z: number;
}

export interface ModelRotation {
  x: number;
  y: number;
  z: number;
}

// Simplified model instance - only placement data
export interface ModelInstance {
  instanceId: string;
  modelType: ModelType | string;
  position: ModelPosition;
  scale?: ModelScale;
  rotation?: ModelRotation;
  emissiveConfig?: EmissiveConfig; // Override emissive configuration for this instance
  excludeFromEffects?: boolean; // Override exclusion from post-processing effects
}

// Legacy interface for backward compatibility
export interface ModelConfig {
  id: string;
  filePath: string;
  textures?: any;
  position: ModelPosition;
  scale?: ModelScale;
  rotation?: ModelRotation;
  name?: string;
}

export interface ModelCollection {
  name: string;
  models: ModelInstance[];
}

export interface PlacedModel {
  instanceId: string;
  object3D: THREE.Object3D;
  modelType: string;
  instance: ModelInstance;
  materials?: THREE.Material[];
}

export class ModelPlacer {
  private assetManager: AssetManager;
  private placedModels: Map<string, PlacedModel> = new Map();
  private instancedPlacer: InstancedModelPlacer;

  constructor(assetManager: AssetManager) {
    this.assetManager = assetManager;
    this.instancedPlacer = new InstancedModelPlacer(assetManager);
  }

  async placeModelInstance(
    instance: ModelInstance,
    scene: THREE.Scene
  ): Promise<PlacedModel> {
    if (this.placedModels.has(instance.instanceId)) {
      console.warn(
        `Model instance with id "${instance.instanceId}" already exists. Skipping.`
      );
      return this.placedModels.get(instance.instanceId)!;
    }

    // Get model definition
    const definition = ModelDefinitionRegistry.getDefinition(
      instance.modelType
    );
    if (!definition) {
      throw new Error(`Model definition not found: ${instance.modelType}`);
    }

    try {
      const loadedModel = await this.assetManager.loadModel(
        definition.filePath,
        definition.textures
      );

      const model = loadedModel.model;

      // Apply position
      model.position.set(
        instance.position.x,
        instance.position.y,
        instance.position.z
      );

      // Apply scale (use instance scale or default from definition)
      const scale = instance.scale ||
        definition.defaultScale || { x: 1, y: 1, z: 1 };
      model.scale.set(scale.x, scale.y, scale.z);

      // Apply rotation
      if (instance.rotation) {
        model.rotation.set(
          instance.rotation.x,
          instance.rotation.y,
          instance.rotation.z
        );
      }

      // Set name for debugging
      model.name = `${definition.name}_${instance.instanceId}`;

      // Store exclusion flag on the model for post-processing
      const excludeFromEffects =
        instance.excludeFromEffects ?? definition.excludeFromEffects ?? false;
      (model as any).excludeFromEffects = excludeFromEffects;

      // Apply emissive configuration (instance override takes precedence)
      const emissiveConfig =
        instance.emissiveConfig || definition.emissiveConfig;
      if (emissiveConfig && !excludeFromEffects) {
        applyEmissiveToObject(model, emissiveConfig);
        // Mark objects with custom emissive configs as excluded from global effects
        // to prevent enhanceMaterialsForBloom from overriding them
        // Apply the flag to all children recursively
        model.traverse((child) => {
          (child as any).excludeFromEffects = true;
        });
        console.log(
          `Applied custom emissive config to ${definition.name}_${instance.instanceId} and excluded all children from global effects`
        );
      } else if (excludeFromEffects) {
        console.log(
          `Excluded ${definition.name}_${instance.instanceId} from effects`
        );
      }

      scene.add(model);

      const placedModel: PlacedModel = {
        instanceId: instance.instanceId,
        object3D: model,
        modelType: instance.modelType,
        instance,
        materials: loadedModel.materials,
      };

      this.placedModels.set(instance.instanceId, placedModel);

      return placedModel;
    } catch (error) {
      console.error(
        `Failed to place model instance "${instance.instanceId}":`,
        error
      );
      throw error;
    }
  }

  // Legacy method for backward compatibility
  async placeModel(
    config: ModelConfig,
    scene: THREE.Scene
  ): Promise<PlacedModel> {
    const instance: ModelInstance = {
      instanceId: config.id,
      modelType: "LEGACY",
      position: config.position,
      scale: config.scale,
      rotation: config.rotation,
    };

    // For legacy models, we bypass the definition system
    try {
      const loadedModel = await this.assetManager.loadModel(
        config.filePath,
        config.textures
      );

      const model = loadedModel.model;
      model.position.set(
        config.position.x,
        config.position.y,
        config.position.z
      );

      if (config.scale) {
        model.scale.set(config.scale.x, config.scale.y, config.scale.z);
      }

      if (config.rotation) {
        model.rotation.set(
          config.rotation.x,
          config.rotation.y,
          config.rotation.z
        );
      }

      model.name = config.name || config.id;
      scene.add(model);

      const placedModel: PlacedModel = {
        instanceId: config.id,
        object3D: model,
        modelType: "LEGACY",
        instance,
        materials: loadedModel.materials,
      };

      this.placedModels.set(config.id, placedModel);
      return placedModel;
    } catch (error) {
      console.error(`Failed to place legacy model "${config.id}":`, error);
      throw error;
    }
  }

  async placeModelCollection(
    collection: ModelCollection,
    scene: THREE.Scene
  ): Promise<PlacedModel[]> {
    console.log(`Placing model collection: ${collection.name}`);

    const placedModels: PlacedModel[] = [];
    const loadPromises = collection.models.map(async (modelInstance) => {
      try {
        const placedModel = await this.placeModelInstance(modelInstance, scene);
        placedModels.push(placedModel);
        return placedModel;
      } catch (error) {
        console.error(
          `Failed to place model instance "${modelInstance.instanceId}" from collection "${collection.name}":`,
          error
        );
        return null;
      }
    });

    const results = await Promise.allSettled(loadPromises);
    const successfulModels = results
      .filter(
        (result): result is PromiseFulfilledResult<PlacedModel | null> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value!);

    console.log(
      `Successfully placed ${successfulModels.length}/${collection.models.length} models from collection "${collection.name}"`
    );

    return successfulModels;
  }

  async placeModelCollectionAsGroup(
    collection: ModelCollection,
    scene: THREE.Scene,
    groupPosition?: ModelPosition
  ): Promise<{ group: THREE.Group; models: PlacedModel[] }> {
    console.log(`Placing model collection as group: ${collection.name}`);

    const group = new THREE.Group();
    group.name = `${collection.name}_group`;

    const placedModels: PlacedModel[] = [];
    const loadPromises = collection.models.map(async (modelInstance) => {
      try {
        // The model is placed at its defined position, but will be parented to the group.
        const placedModel = await this.placeModelInstance(modelInstance, scene);
        // by default it will be added to the scene, so we need to remove it and add it to the group
        scene.remove(placedModel.object3D);
        group.add(placedModel.object3D);
        placedModels.push(placedModel);
        return placedModel;
      } catch (error) {
        console.error(
          `Failed to place model instance "${modelInstance.instanceId}" from collection "${collection.name}":`,
          error
        );
        return null;
      }
    });

    const results = await Promise.allSettled(loadPromises);
    const successfulModels = results
      .filter(
        (result): result is PromiseFulfilledResult<PlacedModel | null> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value!);

    // Position the entire group
    if (groupPosition) {
      group.position.set(groupPosition.x, groupPosition.y, groupPosition.z);
    }

    scene.add(group);

    console.log(
      `Successfully placed ${successfulModels.length}/${collection.models.length} models in group "${collection.name}"`
    );

    return { group, models: successfulModels };
  }

  async placeMultipleCollections(
    collections: ModelCollection[],
    scene: THREE.Scene
  ): Promise<Map<string, PlacedModel[]>> {
    const results = new Map<string, PlacedModel[]>();

    for (const collection of collections) {
      try {
        const placedModels = await this.placeModelCollection(collection, scene);
        results.set(collection.name, placedModels);
      } catch (error) {
        console.error(
          `Failed to place collection "${collection.name}":`,
          error
        );
        results.set(collection.name, []);
      }
    }

    return results;
  }

  removeModel(id: string, scene: THREE.Scene): boolean {
    const placedModel = this.placedModels.get(id);
    if (!placedModel) {
      console.warn(`Model with id "${id}" not found`);
      return false;
    }

    scene.remove(placedModel.object3D);
    this.placedModels.delete(id);

    return true;
  }

  removeCollection(collectionName: string, scene: THREE.Scene): number {
    let removedCount = 0;

    for (const [id, placedModel] of this.placedModels.entries()) {
      if (
        placedModel.object3D.name?.includes(collectionName) ||
        id.startsWith(collectionName)
      ) {
        scene.remove(placedModel.object3D);
        this.placedModels.delete(id);
        removedCount++;
      }
    }

    return removedCount;
  }

  getPlacedModel(id: string): PlacedModel | undefined {
    return this.placedModels.get(id);
  }

  getAllPlacedModels(): PlacedModel[] {
    return Array.from(this.placedModels.values());
  }

  updateModelPosition(
    instanceId: string,
    position: Partial<ModelPosition>
  ): boolean {
    const placedModel = this.placedModels.get(instanceId);
    if (!placedModel) {
      return false;
    }

    const currentPos = placedModel.object3D.position;
    placedModel.object3D.position.set(
      position.x ?? currentPos.x,
      position.y ?? currentPos.y,
      position.z ?? currentPos.z
    );

    // Update instance
    Object.assign(placedModel.instance.position, position);

    return true;
  }

  updateModelScale(instanceId: string, scale: Partial<ModelScale>): boolean {
    const placedModel = this.placedModels.get(instanceId);
    if (!placedModel) {
      return false;
    }

    const currentScale = placedModel.object3D.scale;
    placedModel.object3D.scale.set(
      scale.x ?? currentScale.x,
      scale.y ?? currentScale.y,
      scale.z ?? currentScale.z
    );

    // Update instance
    if (!placedModel.instance.scale) {
      placedModel.instance.scale = { x: 1, y: 1, z: 1 };
    }
    Object.assign(placedModel.instance.scale, scale);

    return true;
  }

  updateModelRotation(
    instanceId: string,
    rotation: Partial<ModelRotation>
  ): boolean {
    const placedModel = this.placedModels.get(instanceId);
    if (!placedModel) {
      return false;
    }

    const currentRot = placedModel.object3D.rotation;
    placedModel.object3D.rotation.set(
      rotation.x ?? currentRot.x,
      rotation.y ?? currentRot.y,
      rotation.z ?? currentRot.z
    );

    // Update instance
    if (!placedModel.instance.rotation) {
      placedModel.instance.rotation = { x: 0, y: 0, z: 0 };
    }
    Object.assign(placedModel.instance.rotation, rotation);

    return true;
  }

  getModelStats(): {
    totalModels: number;
    modelsByType: Record<string, number>;
  } {
    const totalModels = this.placedModels.size;
    const modelsByType: Record<string, number> = {};

    for (const placedModel of this.placedModels.values()) {
      const modelType = placedModel.modelType;
      modelsByType[modelType] = (modelsByType[modelType] || 0) + 1;
    }

    return {
      totalModels,
      modelsByType,
    };
  }

  // Instanced model methods
  async placeInstancedCollection(
    collection: InstancedCollection,
    scene: THREE.Scene
  ): Promise<PlacedInstancedModel[]> {
    return this.instancedPlacer.placeInstancedCollection(collection, scene);
  }

  getInstancedModel(modelType: string): PlacedInstancedModel | undefined {
    return this.instancedPlacer.getInstancedModel(modelType);
  }

  getAllInstancedModels(): PlacedInstancedModel[] {
    return this.instancedPlacer.getAllInstancedModels();
  }

  getInstanceStats(): {
    totalGroups: number;
    totalInstances: number;
    groupsByType: Record<string, number>;
  } {
    return this.instancedPlacer.getInstanceStats();
  }

  updateInstance(
    modelType: string,
    instanceIndex: number,
    position?: THREE.Vector3,
    rotation?: THREE.Euler,
    scale?: THREE.Vector3
  ): boolean {
    return this.instancedPlacer.updateInstance(
      modelType,
      instanceIndex,
      position,
      rotation,
      scale
    );
  }

  removeInstancedModel(modelType: string, scene: THREE.Scene): boolean {
    return this.instancedPlacer.removeInstancedModel(modelType, scene);
  }

  updateGroupPosition(
    groupName: string,
    position: Partial<ModelPosition>,
    scene: THREE.Scene
  ): boolean {
    const group = scene.getObjectByName(`${groupName}_group`) as THREE.Group;
    if (!group) {
      console.warn(`Group "${groupName}_group" not found in scene`);
      return false;
    }

    const currentPos = group.position;
    group.position.set(
      position.x ?? currentPos.x,
      position.y ?? currentPos.y,
      position.z ?? currentPos.z
    );

    return true;
  }

  updateGroupRotation(
    groupName: string,
    rotation: Partial<ModelRotation>,
    scene: THREE.Scene
  ): boolean {
    const group = scene.getObjectByName(`${groupName}_group`) as THREE.Group;
    if (!group) {
      console.warn(`Group "${groupName}_group" not found in scene`);
      return false;
    }

    const currentRot = group.rotation;
    group.rotation.set(
      rotation.x ?? currentRot.x,
      rotation.y ?? currentRot.y,
      rotation.z ?? currentRot.z
    );

    return true;
  }

  updateGroupScale(
    groupName: string,
    scale: Partial<ModelScale>,
    scene: THREE.Scene
  ): boolean {
    const group = scene.getObjectByName(`${groupName}_group`) as THREE.Group;
    if (!group) {
      console.warn(`Group "${groupName}_group" not found in scene`);
      return false;
    }

    const currentScale = group.scale;
    group.scale.set(
      scale.x ?? currentScale.x,
      scale.y ?? currentScale.y,
      scale.z ?? currentScale.z
    );

    return true;
  }

  dispose(): void {
    this.placedModels.clear();
    this.instancedPlacer.dispose();
  }
}
