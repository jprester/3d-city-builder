import { InstancedCollection, InstancedModelPlacer } from "../InstancedModelPlacer.js";
import { MODEL_TYPES } from "../definitions/ModelDefinitions.js";
import * as THREE from "three";

// COMPACT CITY DESIGN - Just a few blocks, easy to navigate (~55 buildings total)
// ============================================================================

export const compactCityBlocks: InstancedCollection = {
  name: "compact-city-blocks",
  groups: [
    // 1. CENTRAL BUSINESS BLOCK - 10 tall buildings in center
    {
      modelType: MODEL_TYPES.MEGA_TOWER_01,
      instances: [
        {
          instanceId: "downtown_01",
          modelType: MODEL_TYPES.MEGA_TOWER_01,
          position: new THREE.Vector3(0, 0, 0),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(1.0, 1.2, 1.0)
        },
        {
          instanceId: "downtown_02",
          modelType: MODEL_TYPES.MEGA_TOWER_01,
          position: new THREE.Vector3(80, 0, 0),
          rotation: new THREE.Euler(0, Math.PI / 4, 0),
          scale: new THREE.Vector3(0.9, 1.0, 0.9)
        }
      ],
      maxInstances: 3
    },
    {
      modelType: MODEL_TYPES.MEGA_TOWER_02,
      instances: [
        {
          instanceId: "downtown_03",
          modelType: MODEL_TYPES.MEGA_TOWER_02,
          position: new THREE.Vector3(40, 0, 70),
          rotation: new THREE.Euler(0, Math.PI / 6, 0),
          scale: new THREE.Vector3(1.1, 1.4, 1.1)
        },
        {
          instanceId: "downtown_04",
          modelType: MODEL_TYPES.MEGA_TOWER_02,
          position: new THREE.Vector3(-40, 0, 40),
          rotation: new THREE.Euler(0, -Math.PI / 3, 0),
          scale: new THREE.Vector3(0.8, 1.1, 0.8)
        }
      ],
      maxInstances: 3
    },
    {
      modelType: MODEL_TYPES.HIGH_RISE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.HIGH_RISE,
        [
          { x: -80, y: 0, z: 0 },
          { x: 0, y: 0, z: -80 },
          { x: 80, y: 0, z: 80 },
          { x: -40, y: 0, z: -40 },
          { x: 40, y: 0, z: -40 },
          { x: -80, y: 0, z: 80 }
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.2 }
        }
      ),
      maxInstances: 8
    },

    // 2. RESIDENTIAL BLOCK - 18 houses (north side)
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_A,
        // 3x3 grid of houses
        Array.from({ length: 9 }, (_, i) => ({
          x: (i % 3) * 60 - 60 + 200, // North-east area
          y: 0,
          z: Math.floor(i / 3) * 60 + 120
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.1 }
        }
      ),
      maxInstances: 10
    },
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_B,
        // Another 3x3 grid next to first
        Array.from({ length: 9 }, (_, i) => ({
          x: (i % 3) * 60 - 60 - 200, // North-west area
          y: 0,
          z: Math.floor(i / 3) * 60 + 120
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.7, max: 1.0 }
        }
      ),
      maxInstances: 10
    },

    // 3. COMMERCIAL BLOCK - 15 mid-size buildings (south side)
    {
      modelType: MODEL_TYPES.COMMERCIAL_03_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.COMMERCIAL_03_A,
        [
          { x: -120, y: 0, z: -120 },
          { x: -60, y: 0, z: -140 },
          { x: 0, y: 0, z: -120 },
          { x: 60, y: 0, z: -140 },
          { x: 120, y: 0, z: -120 }
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.2 }
        }
      ),
      maxInstances: 6
    },
    {
      modelType: MODEL_TYPES.COMMERCIAL_03_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.COMMERCIAL_03_B,
        [
          { x: -90, y: 0, z: -180 },
          { x: -30, y: 0, z: -200 },
          { x: 30, y: 0, z: -180 },
          { x: 90, y: 0, z: -200 }
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.1 }
        }
      ),
      maxInstances: 5
    },
    {
      modelType: MODEL_TYPES.MIXED_USE_05_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.MIXED_USE_05_A,
        [
          { x: -150, y: 0, z: -160 },
          { x: -75, y: 0, z: -160 },
          { x: 0, y: 0, z: -160 },
          { x: 75, y: 0, z: -160 },
          { x: 150, y: 0, z: -160 }
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.3 }
        }
      ),
      maxInstances: 6
    },

    // 4. SMALL INDUSTRIAL AREA - 8 buildings (west side)
    {
      modelType: MODEL_TYPES.INDUSTRIAL_04_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.INDUSTRIAL_04_A,
        [
          { x: -250, y: 0, z: -50 },
          { x: -300, y: 0, z: 20 },
          { x: -280, y: 0, z: 80 },
          { x: -220, y: 0, z: 40 }
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.2 }
        }
      ),
      maxInstances: 5
    },
    {
      modelType: MODEL_TYPES.INDUSTRIAL_04_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.INDUSTRIAL_04_B,
        [
          { x: -320, y: 0, z: -20 },
          { x: -260, y: 0, z: -80 },
          { x: -340, y: 0, z: 60 }
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.4 }
        }
      ),
      maxInstances: 4
    },

    // 5. WATERFRONT AREA - 6 glass buildings (east side)
    {
      modelType: MODEL_TYPES.GLASS_CUBE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.GLASS_CUBE,
        [
          { x: 200, y: 0, z: -80 },
          { x: 240, y: 0, z: -40 },
          { x: 220, y: 0, z: 0 },
          { x: 260, y: 0, z: 40 },
          { x: 200, y: 0, z: 80 }
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.7, max: 1.1 }
        }
      ),
      maxInstances: 6
    }
  ]
};

// Summary of compact city:
// - Central business: 10 buildings (2 mega + 2 mega + 6 high-rise)
// - Residential: 18 buildings (9 + 9)
// - Commercial: 15 buildings (5 + 4 + 6)
// - Industrial: 7 buildings (4 + 3)
// - Waterfront: 5 buildings
// TOTAL: ~55 buildings in a compact, navigable area

export const compactCityCollections = [compactCityBlocks];