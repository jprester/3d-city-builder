import {
  InstancedCollection,
  InstancedModelPlacer,
} from "../InstancedModelPlacer.js";
import { MODEL_TYPES } from "../definitions/ModelDefinitions.js";
import * as THREE from "three";

// Large residential district with many identical houses
export const massResidentialCollection: InstancedCollection = {
  name: "mass-residential",
  groups: [
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_A,
        // Create a 5x4 grid of houses (5 rows, 4 buildings each)
        Array.from({ length: 20 }, (_, i) => ({
          x: (i % 4) * 80 - 120, // 4 columns, spaced 80 units apart
          y: 0,
          z: Math.floor(i / 4) * 80 - 160, // 5 rows, spaced 80 units apart
        })),
        {
          randomRotation: false,
          randomScale: { min: 0.8, max: 1.2 },
        }
      ),
      maxInstances: 20,
    },
    // {
    //   modelType: MODEL_TYPES.RESIDENTIAL_01_B,
    //   instances: InstancedModelPlacer.createInstancesFromPositions(
    //     MODEL_TYPES.RESIDENTIAL_01_B,
    //     // Create another 8x8 grid with different positioning
    //     Array.from({ length: 64 }, (_, i) => ({
    //       x: (i % 8) * 100 + 50, // 8 columns, offset to the right
    //       y: 0,
    //       z: Math.floor(i / 8) * 10 - 32, // 8 rows
    //     })),
    //     {
    //       rotation: { x: 0, y: Math.PI / 4, z: 0 }, // 45-degree rotation
    //       randomScale: { min: 0.7, max: 1.1 },
    //     }
    //   ),
    //   maxInstances: 64,
    // },
  ],
};

// High-rise district with many towers
export const skyscraperDistrictCollection: InstancedCollection = {
  name: "skyscraper-district",
  groups: [
    {
      modelType: MODEL_TYPES.HIGH_RISE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.HIGH_RISE,
        // Create a dense urban grid
        Array.from({ length: 36 }, (_, i) => ({
          x: (i % 6) * 15 - 37.5, // 6 columns, spaced 15 units apart
          y: 0,
          z: Math.floor(i / 6) * 15 - 37.5, // 6 rows
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.5 }, // Vary building heights
        }
      ),
      maxInstances: 36,
    },
    {
      modelType: MODEL_TYPES.GLASS_CUBE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.GLASS_CUBE,
        // Fill gaps with smaller glass buildings
        Array.from({ length: 20 }, () => ({
          x: Math.random() * 80 - 40,
          y: 0,
          z: Math.random() * 80 - 40,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.5, max: 1.0 },
        }
      ),
      maxInstances: 20,
    },
  ],
};

// Massive city with thousands of buildings
export const megaCityCollection: InstancedCollection = {
  name: "mega-city",
  groups: [
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_A,
        // Suburban area - 20x20 grid
        Array.from({ length: 400 }, (_, i) => ({
          x: (i % 20) * 6 - 57, // 20 columns
          y: 0,
          z: Math.floor(i / 20) * 6 - 57, // 20 rows
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.2 },
        }
      ),
      maxInstances: 500, // Allow for growth
    },
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_B,
        // Mid-density housing - 15x15 grid
        Array.from({ length: 225 }, (_, i) => ({
          x: (i % 15) * 8 + 80, // Offset to different area
          y: 0,
          z: Math.floor(i / 15) * 8 - 56,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.7, max: 1.3 },
        }
      ),
      maxInstances: 300,
    },
    {
      modelType: MODEL_TYPES.HIGH_RISE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.HIGH_RISE,
        // Downtown core - 12x12 grid
        Array.from({ length: 144 }, (_, i) => ({
          x: (i % 12) * 12 + 200, // Dense urban core
          y: 0,
          z: Math.floor(i / 12) * 12 - 66,
        })),
        {
          randomRotation: true,
          randomScale: { min: 1.0, max: 2.0 }, // Tall buildings
        }
      ),
      maxInstances: 200,
    },
    {
      modelType: MODEL_TYPES.GLASS_CUBE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.GLASS_CUBE,
        // Commercial district - scattered placement
        Array.from({ length: 100 }, () => ({
          x: Math.random() * 200 - 100,
          y: 0,
          z: Math.random() * 200 + 100, // South of other districts
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.6, max: 1.4 },
        }
      ),
      maxInstances: 150,
    },
  ],
};

// Circular city layout
export const circularCityCollection: InstancedCollection = {
  name: "circular-city",
  groups: [
    {
      modelType: MODEL_TYPES.HIGH_RISE,
      instances: (() => {
        const instances = [];
        const centerRadius = 20;
        const rings = 5;
        const buildingsPerRing = [8, 12, 16, 20, 24];

        for (let ring = 0; ring < rings; ring++) {
          const radius = centerRadius + ring * 15;
          const buildingCount = buildingsPerRing[ring];

          for (let i = 0; i < buildingCount; i++) {
            const angle = (i / buildingCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            instances.push({
              instanceId: `circular_highrise_${ring}_${i}`,
              modelType: MODEL_TYPES.HIGH_RISE,
              position: new THREE.Vector3(x, 0, z),
              rotation: new THREE.Euler(0, angle + Math.PI / 2, 0), // Face center
              scale: new THREE.Vector3(1, 1 + ring * 0.3, 1), // Taller towards outside
            });
          }
        }

        return instances;
      })(),
      maxInstances: 100,
    },
    {
      modelType: MODEL_TYPES.GLASS_CUBE,
      instances: (() => {
        const instances = [];
        // Central plaza with a few special buildings
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const x = Math.cos(angle) * 8;
          const z = Math.sin(angle) * 8;

          instances.push({
            instanceId: `central_glass_${i}`,
            modelType: MODEL_TYPES.GLASS_CUBE,
            position: new THREE.Vector3(x, 0, z),
            rotation: new THREE.Euler(0, angle, 0),
            scale: new THREE.Vector3(1.5, 0.8, 1.5),
          });
        }

        return instances;
      })(),
      maxInstances: 10,
    },
  ],
};

// All instanced collections for easy import
export const allInstancedCollections = [
  massResidentialCollection,
  skyscraperDistrictCollection,
  megaCityCollection,
  circularCityCollection,
];
