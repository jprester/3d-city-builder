import {
  InstancedCollection,
  InstancedModelPlacer,
} from "../InstancedModelPlacer.js";
import { MODEL_TYPES } from "../definitions/ModelDefinitions.js";
import * as THREE from "three";

// COMPREHENSIVE CITY DESIGN WITH PROPER SPACING (10X DISTANCES)
// ============================================================

// 1. DOWNTOWN FINANCIAL DISTRICT - Mega towers and skyscrapers
export const downtownFinancialDistrict: InstancedCollection = {
  name: "downtown-financial-district",
  groups: [
    {
      modelType: MODEL_TYPES.MEGA_TOWER_01,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.MEGA_TOWER_01,
        [
          // Central business cluster
          { x: 0, y: 0, z: 0 },
          { x: 150, y: 0, z: 0 },
          { x: 300, y: 0, z: 0 },
          { x: 75, y: 0, z: 150 },
          { x: 225, y: 0, z: 150 },
        ],
        {
          randomRotation: true,
          randomScale: { min: 1.0, max: 1.4 },
        }
      ),
      maxInstances: 8,
    },
    {
      modelType: MODEL_TYPES.MEGA_TOWER_02,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.MEGA_TOWER_02,
        [
          { x: -150, y: 0, z: 75 },
          { x: 450, y: 0, z: 75 },
          { x: 75, y: 0, z: -150 },
          { x: 225, y: 0, z: -150 },
        ],
        {
          randomRotation: true,
          randomScale: { min: 1.0, max: 1.3 },
        }
      ),
      maxInstances: 6,
    },
    {
      modelType: MODEL_TYPES.MEGA_TOWER_03,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.MEGA_TOWER_03,
        [
          { x: -75, y: 0, z: -75 },
          { x: 375, y: 0, z: -75 },
          { x: 150, y: 0, z: 300 },
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.2 },
        }
      ),
      maxInstances: 4,
    },
  ],
};

// 2. CORPORATE OFFICE DISTRICT - High-rise and commercial buildings
export const corporateOfficeDistrict: InstancedCollection = {
  name: "corporate-office-district",
  groups: [
    {
      modelType: MODEL_TYPES.HIGH_RISE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.HIGH_RISE,
        // Grid pattern for organized corporate look
        Array.from({ length: 15 }, (_, i) => ({
          x: (i % 5) * 200 + 800, // Offset east of downtown
          y: 0,
          z: Math.floor(i / 5) * 200 - 200,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.3 },
        }
      ),
      maxInstances: 20,
    },
    {
      modelType: MODEL_TYPES.COMMERCIAL_03_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.COMMERCIAL_03_A,
        Array.from({ length: 12 }, (_, i) => ({
          x: (i % 4) * 150 + 1000,
          y: 0,
          z: Math.floor(i / 4) * 150 + 500,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.2 },
        }
      ),
      maxInstances: 15,
    },
    {
      modelType: MODEL_TYPES.COMMERCIAL_03_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.COMMERCIAL_03_B,
        Array.from({ length: 10 }, (_, i) => ({
          x: (i % 5) * 180 + 900,
          y: 0,
          z: Math.floor(i / 5) * 180 + 800,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.1 },
        }
      ),
      maxInstances: 12,
    },
  ],
};

// 3. MIXED-USE URBAN DISTRICT - Variety of mid-rise buildings
export const mixedUseUrbanDistrict: InstancedCollection = {
  name: "mixed-use-urban-district",
  groups: [
    {
      modelType: MODEL_TYPES.MIXED_USE_05_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.MIXED_USE_05_A,
        Array.from({ length: 18 }, (_, i) => ({
          x: (i % 6) * 160 - 1200, // West of downtown
          y: 0,
          z: Math.floor(i / 6) * 160 - 400,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.3 },
        }
      ),
      maxInstances: 20,
    },
    {
      modelType: MODEL_TYPES.MIXED_USE_05_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.MIXED_USE_05_B,
        Array.from({ length: 15 }, (_, i) => ({
          x: (i % 5) * 170 - 1100,
          y: 0,
          z: Math.floor(i / 5) * 170 + 200,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.2 },
        }
      ),
      maxInstances: 18,
    },
    {
      modelType: MODEL_TYPES.COMMERCIAL_03_C,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.COMMERCIAL_03_C,
        Array.from({ length: 12 }, (_, i) => ({
          x: (i % 4) * 200 - 1000,
          y: 0,
          z: Math.floor(i / 4) * 200 + 600,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.4 },
        }
      ),
      maxInstances: 15,
    },
  ],
};

// 4. RESIDENTIAL NEIGHBORHOODS - Multiple housing types
export const residentialNeighborhoods: InstancedCollection = {
  name: "residential-neighborhoods",
  groups: [
    // Suburban single-family homes (south area)
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_A,
        Array.from({ length: 24 }, (_, i) => ({
          x: (i % 8) * 120 - 480, // South of downtown
          y: 0,
          z: Math.floor(i / 8) * 120 - 800,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.2 },
        }
      ),
      maxInstances: 30,
    },
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_B,
        Array.from({ length: 20 }, (_, i) => ({
          x: (i % 5) * 140 + 200,
          y: 0,
          z: Math.floor(i / 5) * 140 - 900,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.7, max: 1.1 },
        }
      ),
      maxInstances: 25,
    },
    {
      modelType: MODEL_TYPES.RESIDENTIAL_01_C,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_01_C,
        Array.from({ length: 20 }, (_, i) => ({
          x: (i % 5) * 140 + 200,
          y: 0,
          z: Math.floor(i / 5) * 140 - 900,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.7, max: 1.1 },
        }
      ),
      maxInstances: 15,
    },

    // Mid-density residential (east residential)
    {
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_02_A,
        Array.from({ length: 16 }, (_, i) => ({
          x: (i % 4) * 180 + 1400, // Far east
          y: 0,
          z: Math.floor(i / 4) * 180 - 600,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.3 },
        }
      ),
      maxInstances: 20,
    },
    {
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.RESIDENTIAL_02_B,
        Array.from({ length: 14 }, (_, i) => ({
          x: (i % 7) * 160 + 1500,
          y: 0,
          z: Math.floor(i / 7) * 160 - 200,
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.2 },
        }
      ),
      maxInstances: 18,
    },
  ],
};

// 5. INDUSTRIAL ZONE - Large industrial buildings
export const industrialZone: InstancedCollection = {
  name: "industrial-zone",
  groups: [
    {
      modelType: MODEL_TYPES.INDUSTRIAL_04_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.INDUSTRIAL_04_A,
        [
          // Scattered industrial layout (north area)
          { x: -800, y: 0, z: 600 },
          { x: -400, y: 0, z: 700 },
          { x: 0, y: 0, z: 800 },
          { x: 400, y: 0, z: 750 },
          { x: 800, y: 0, z: 650 },
          { x: -600, y: 0, z: 1000 },
          { x: 200, y: 0, z: 1100 },
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.4 },
        }
      ),
      maxInstances: 10,
    },
    {
      modelType: MODEL_TYPES.INDUSTRIAL_04_B,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.INDUSTRIAL_04_B,
        [
          { x: -1000, y: 0, z: 900 },
          { x: -200, y: 0, z: 1200 },
          { x: 600, y: 0, z: 1000 },
          { x: 1000, y: 0, z: 850 },
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.9, max: 1.3 },
        }
      ),
      maxInstances: 6,
    },
  ],
};

// 6. WATERFRONT DISTRICT - Mixed buildings along imaginary waterfront
export const waterfrontDistrict: InstancedCollection = {
  name: "waterfront-district",
  groups: [
    {
      modelType: MODEL_TYPES.GLASS_CUBE,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.GLASS_CUBE,
        // Linear arrangement along "waterfront" (far north)
        Array.from({ length: 12 }, (_, i) => ({
          x: i * 200 - 1100, // Linear waterfront
          y: 0,
          z: 1400, // Far north edge
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.7, max: 1.2 },
        }
      ),
      maxInstances: 15,
    },
    {
      modelType: MODEL_TYPES.MIXED_USE_05_C,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.MIXED_USE_05_C,
        Array.from({ length: 8 }, (_, i) => ({
          x: i * 250 - 875,
          y: 0,
          z: 1200, // Second row from water
        })),
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.1 },
        }
      ),
      maxInstances: 10,
    },
  ],
};

// 7. ENTERTAINMENT DISTRICT - Unique buildings cluster
export const entertainmentDistrict: InstancedCollection = {
  name: "entertainment-district",
  groups: [
    {
      modelType: MODEL_TYPES.MEGA_TOWER_04,
      instances: [
        {
          instanceId: "entertainment_tower_1",
          modelType: MODEL_TYPES.MEGA_TOWER_04,
          position: new THREE.Vector3(-500, 0, 400),
          rotation: new THREE.Euler(0, Math.PI / 4, 0),
          scale: new THREE.Vector3(1.2, 0.8, 1.2), // Wider, shorter for entertainment
        },
        {
          instanceId: "entertainment_tower_2",
          modelType: MODEL_TYPES.MEGA_TOWER_04,
          position: new THREE.Vector3(-300, 0, 300),
          rotation: new THREE.Euler(0, -Math.PI / 6, 0),
          scale: new THREE.Vector3(1.0, 0.9, 1.0),
        },
      ],
      maxInstances: 4,
    },
    {
      modelType: MODEL_TYPES.MEGA_TOWER_05,
      instances: [
        {
          instanceId: "entertainment_complex_1",
          modelType: MODEL_TYPES.MEGA_TOWER_05,
          position: new THREE.Vector3(-400, 0, 200),
          rotation: new THREE.Euler(0, Math.PI / 3, 0),
          scale: new THREE.Vector3(1.5, 0.6, 1.5), // Wide entertainment complex
        },
      ],
      maxInstances: 2,
    },
    {
      modelType: MODEL_TYPES.COMMERCIAL_03_A,
      instances: InstancedModelPlacer.createInstancesFromPositions(
        MODEL_TYPES.COMMERCIAL_03_A,
        // Surrounding entertainment venues
        [
          { x: -700, y: 0, z: 300 },
          { x: -600, y: 0, z: 500 },
          { x: -200, y: 0, z: 450 },
          { x: -100, y: 0, z: 250 },
        ],
        {
          randomRotation: true,
          randomScale: { min: 0.8, max: 1.1 },
        }
      ),
      maxInstances: 6,
    },
  ],
};

// COMPLETE CITY COLLECTION - Combines all districts
export const completeCityDesign: InstancedCollection = {
  name: "complete-neo-city",
  groups: [
    ...downtownFinancialDistrict.groups,
    ...corporateOfficeDistrict.groups,
    ...mixedUseUrbanDistrict.groups,
    ...residentialNeighborhoods.groups,
    ...industrialZone.groups,
    ...waterfrontDistrict.groups,
    ...entertainmentDistrict.groups,
  ],
};

// Export all city districts for modular use
export const allCityDistricts = [
  downtownFinancialDistrict,
  corporateOfficeDistrict,
  mixedUseUrbanDistrict,
  residentialNeighborhoods,
  industrialZone,
  waterfrontDistrict,
  entertainmentDistrict,
  completeCityDesign,
];
