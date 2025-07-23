import { ModelCollection } from "../ModelPlacer.js";
import { MODEL_TYPES } from "../definitions/ModelDefinitions.js";

// Optimized building collection - only placement data!
export const buildingsCollection: ModelCollection = {
  name: "city-buildings",
  models: [
    {
      instanceId: "tower-1",
      modelType: MODEL_TYPES.HIGH_RISE,
      position: { x: -80, y: 0, z: -2 },
      scale: { x: 1.2, y: 2, z: 1.2 },
    },
    {
      instanceId: "residential-1",
      modelType: MODEL_TYPES.RESIDENTIAL_01,
      position: { x: 2, y: 0, z: 1 },
      // Uses default scale from definition
    },
    {
      instanceId: "residential-2",
      modelType: MODEL_TYPES.RESIDENTIAL_02,
      position: { x: 100, y: 0, z: 3 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
  ],
};

// Commercial district with high-rise buildings
export const commercialCollection: ModelCollection = {
  name: "commercial-district",
  models: [
    {
      instanceId: "office-tower-1",
      modelType: MODEL_TYPES.HIGH_RISE,
      position: { x: 8, y: 0, z: 0 },
      scale: { x: 1, y: 1.5, z: 1 },
    },
    {
      instanceId: "office-tower-2",
      modelType: MODEL_TYPES.HIGH_RISE,
      position: { x: 11, y: 0, z: 2 },
      scale: { x: 0.9, y: 1.2, z: 0.9 },
      rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    },
    {
      instanceId: "shopping-center",
      modelType: MODEL_TYPES.GLASS_CUBE,
      position: { x: 8, y: 0, z: -3 },
      scale: { x: 2, y: 0.5, z: 1.5 },
    },
  ],
};

// Mixed residential neighborhood
export const residentialCollection: ModelCollection = {
  name: "residential-neighborhood",
  models: [
    {
      instanceId: "house-1",
      modelType: MODEL_TYPES.RESIDENTIAL_01,
      position: { x: -8, y: 0, z: -8 },
    },
    {
      instanceId: "house-2",
      modelType: MODEL_TYPES.RESIDENTIAL_02,
      position: { x: -5, y: 0, z: -8 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      instanceId: "house-3",
      modelType: MODEL_TYPES.RESIDENTIAL_01,
      position: { x: -8, y: 0, z: -5 },
      scale: { x: 1.1, y: 1.1, z: 1.1 },
    },
    {
      instanceId: "house-4",
      modelType: MODEL_TYPES.RESIDENTIAL_02,
      position: { x: -5, y: 0, z: -5 },
      rotation: { x: 0, y: Math.PI, z: 0 },
    },
  ],
};

// Grid layout with mixed building types
export const gridLayoutCollection: ModelCollection = {
  name: "grid-layout",
  models: Array.from({ length: 16 }, (_, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;

    // Cycle through different building types
    const modelTypes = [
      MODEL_TYPES.GLASS_CUBE,
      MODEL_TYPES.RESIDENTIAL_01,
      MODEL_TYPES.RESIDENTIAL_02,
      MODEL_TYPES.HIGH_RISE,
    ];
    const modelType = modelTypes[i % modelTypes.length];

    return {
      instanceId: `grid-building-${i}`,
      modelType,
      position: {
        x: (col - 1.5) * 4,
        y: 0,
        z: (row - 1.5) * 4,
      },
      scale: {
        x: 0.7 + Math.random() * 0.4,
        y: 0.8 + Math.random() * 0.6,
        z: 0.7 + Math.random() * 0.4,
      },
      rotation: {
        x: 0,
        y: (Math.PI / 2) * Math.floor(Math.random() * 4), // Snap to 90-degree increments
        z: 0,
      },
    };
  }),
};

// All collections for easy import
export const allCollections = [
  buildingsCollection,
  commercialCollection,
  residentialCollection,
  gridLayoutCollection,
];
