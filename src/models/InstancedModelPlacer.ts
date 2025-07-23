import * as THREE from "three";
import { AssetManager } from "./AssetManager.js";
import { ModelDefinitionRegistry, ModelType } from "./definitions/ModelDefinitions.js";

export interface InstancedModelData {
  instanceId: string;
  modelType: ModelType | string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export interface InstancedModelGroup {
  modelType: ModelType | string;
  instances: InstancedModelData[];
  maxInstances?: number; // Optional limit for performance
}

export interface InstancedCollection {
  name: string;
  groups: InstancedModelGroup[];
}

export interface PlacedInstancedModel {
  modelType: string;
  instancedMesh: THREE.InstancedMesh;
  instanceData: InstancedModelData[];
  materials: THREE.Material[];
}

export class InstancedModelPlacer {
  private assetManager: AssetManager;
  private placedInstancedModels: Map<string, PlacedInstancedModel> = new Map();
  private instanceMatrices: Map<string, THREE.Matrix4[]> = new Map();

  constructor(assetManager: AssetManager) {
    this.assetManager = assetManager;
  }

  async createInstancedModel(
    modelType: string,
    instances: InstancedModelData[],
    maxInstances?: number
  ): Promise<PlacedInstancedModel> {
    const definition = ModelDefinitionRegistry.getDefinition(modelType);
    if (!definition) {
      throw new Error(`Model definition not found: ${modelType}`);
    }

    const loadedModel = await this.assetManager.loadModel(
      definition.filePath,
      definition.textures
    );

    // Extract geometry and material from the loaded model
    let geometry: THREE.BufferGeometry | null = null;
    let materials: THREE.Material[] = [];

    loadedModel.model.traverse((child) => {
      if (child instanceof THREE.Mesh && !geometry) {
        geometry = child.geometry;
        if (Array.isArray(child.material)) {
          materials = [...child.material];
        } else {
          materials = [child.material];
        }
        return; // Use first mesh found
      }
    });

    if (!geometry) {
      throw new Error(`No geometry found in model: ${modelType}`);
    }

    const instanceCount = maxInstances || instances.length;
    const material = materials[0] || new THREE.MeshStandardMaterial({ color: 0x888888 });

    // Create instanced mesh
    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      instanceCount
    );

    // Set up instance matrices
    const matrices: THREE.Matrix4[] = [];
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    instances.forEach((instance, index) => {
      if (index >= instanceCount) return;

      position.copy(instance.position);
      rotation.setFromEuler(instance.rotation);
      scale.copy(instance.scale);

      matrix.compose(position, rotation, scale);
      instancedMesh.setMatrixAt(index, matrix);
      matrices.push(matrix.clone());
    });

    // Hide unused instances by scaling them to zero
    const zeroScale = new THREE.Vector3(0, 0, 0);
    const zeroMatrix = new THREE.Matrix4();
    for (let i = instances.length; i < instanceCount; i++) {
      zeroMatrix.compose(new THREE.Vector3(), new THREE.Quaternion(), zeroScale);
      instancedMesh.setMatrixAt(i, zeroMatrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.name = `instanced_${modelType}`;

    // Enable frustum culling per instance for better performance
    instancedMesh.frustumCulled = true;

    const placedModel: PlacedInstancedModel = {
      modelType,
      instancedMesh,
      instanceData: instances,
      materials
    };

    this.placedInstancedModels.set(modelType, placedModel);
    this.instanceMatrices.set(modelType, matrices);

    return placedModel;
  }

  async placeInstancedCollection(
    collection: InstancedCollection,
    scene: THREE.Scene
  ): Promise<PlacedInstancedModel[]> {
    console.log(`Placing instanced collection: ${collection.name}`);

    const placedModels: PlacedInstancedModel[] = [];

    for (const group of collection.groups) {
      try {
        const placedModel = await this.createInstancedModel(
          group.modelType,
          group.instances,
          group.maxInstances
        );
        
        scene.add(placedModel.instancedMesh);
        placedModels.push(placedModel);
        
        console.log(
          `Created instanced model ${group.modelType} with ${group.instances.length} instances`
        );
      } catch (error) {
        console.error(
          `Failed to create instanced model ${group.modelType}:`,
          error
        );
      }
    }

    console.log(
      `Successfully placed ${placedModels.length}/${collection.groups.length} instanced model groups`
    );

    return placedModels;
  }

  updateInstance(
    modelType: string,
    instanceIndex: number,
    position?: THREE.Vector3,
    rotation?: THREE.Euler,
    scale?: THREE.Vector3
  ): boolean {
    const placedModel = this.placedInstancedModels.get(modelType);
    if (!placedModel || instanceIndex >= placedModel.instanceData.length) {
      return false;
    }

    const instance = placedModel.instanceData[instanceIndex];
    const matrix = new THREE.Matrix4();
    const currentPos = position || instance.position;
    const currentRot = rotation || instance.rotation;
    const currentScale = scale || instance.scale;

    // Update instance data
    if (position) instance.position.copy(position);
    if (rotation) instance.rotation.copy(rotation);
    if (scale) instance.scale.copy(scale);

    // Update matrix
    const quaternion = new THREE.Quaternion().setFromEuler(currentRot);
    matrix.compose(currentPos, quaternion, currentScale);
    
    placedModel.instancedMesh.setMatrixAt(instanceIndex, matrix);
    placedModel.instancedMesh.instanceMatrix.needsUpdate = true;

    // Update stored matrix
    const matrices = this.instanceMatrices.get(modelType);
    if (matrices) {
      matrices[instanceIndex].copy(matrix);
    }

    return true;
  }

  removeInstancedModel(modelType: string, scene: THREE.Scene): boolean {
    const placedModel = this.placedInstancedModels.get(modelType);
    if (!placedModel) {
      return false;
    }

    scene.remove(placedModel.instancedMesh);
    
    // Clean up geometry and materials
    placedModel.instancedMesh.geometry.dispose();
    placedModel.materials.forEach(material => material.dispose());
    
    this.placedInstancedModels.delete(modelType);
    this.instanceMatrices.delete(modelType);

    return true;
  }

  getInstancedModel(modelType: string): PlacedInstancedModel | undefined {
    return this.placedInstancedModels.get(modelType);
  }

  getAllInstancedModels(): PlacedInstancedModel[] {
    return Array.from(this.placedInstancedModels.values());
  }

  getInstanceStats(): {
    totalGroups: number;
    totalInstances: number;
    groupsByType: Record<string, number>;
  } {
    const totalGroups = this.placedInstancedModels.size;
    let totalInstances = 0;
    const groupsByType: Record<string, number> = {};

    for (const [modelType, placedModel] of this.placedInstancedModels.entries()) {
      const instanceCount = placedModel.instanceData.length;
      totalInstances += instanceCount;
      groupsByType[modelType] = instanceCount;
    }

    return {
      totalGroups,
      totalInstances,
      groupsByType
    };
  }

  // Helper method to create instances from simple position arrays
  static createInstancesFromPositions(
    modelType: string,
    positions: Array<{ x: number; y: number; z: number }>,
    options: {
      rotation?: { x: number; y: number; z: number };
      scale?: { x: number; y: number; z: number };
      randomRotation?: boolean;
      randomScale?: { min: number; max: number };
    } = {}
  ): InstancedModelData[] {
    const defaultRotation = options.rotation || { x: 0, y: 0, z: 0 };
    const defaultScale = options.scale || { x: 1, y: 1, z: 1 };

    return positions.map((pos, index) => {
      const rotation = new THREE.Euler(
        defaultRotation.x,
        defaultRotation.y,
        defaultRotation.z
      );
      
      const scale = new THREE.Vector3(
        defaultScale.x,
        defaultScale.y,
        defaultScale.z
      );

      // Apply random rotation if requested
      if (options.randomRotation) {
        rotation.y = Math.random() * Math.PI * 2;
      }

      // Apply random scale if requested
      if (options.randomScale) {
        const scaleVariation = 
          options.randomScale.min + 
          Math.random() * (options.randomScale.max - options.randomScale.min);
        scale.multiplyScalar(scaleVariation);
      }

      return {
        instanceId: `${modelType}_instance_${index}`,
        modelType,
        position: new THREE.Vector3(pos.x, pos.y, pos.z),
        rotation,
        scale
      };
    });
  }

  dispose(): void {
    // Clean up all instanced models
    for (const [, placedModel] of this.placedInstancedModels.entries()) {
      placedModel.instancedMesh.geometry.dispose();
      placedModel.materials.forEach(material => material.dispose());
    }
    
    this.placedInstancedModels.clear();
    this.instanceMatrices.clear();
  }
}