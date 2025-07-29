import { ModelCollection } from "../ModelPlacer.js";
import { MODEL_TYPES } from "../definitions/ModelDefinitions.js";

// Optimized building collection - only placement data!
export const buildingsCollection: ModelCollection = {
  name: "city-buildings",
  models: [
    // First row of residential buildings --------------------------
    {
      instanceId: "residential-1",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 40, y: 0, z: -50 },
      // Uses default scale from definition
    },
    {
      instanceId: "residential-2",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 100, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-3",
      modelType: MODEL_TYPES.RESIDENTIAL_01_C,
      position: { x: 150, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-2",
      modelType: MODEL_TYPES.RESIDENTIAL_02_C,
      position: { x: 200, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-2",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 260, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    // Second row of residential buildings --------------------------
    {
      instanceId: "residential-4",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 40, y: 0, z: 50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-1",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 100, y: 0, z: 50 },
      // Uses default scale from definition
    },
    {
      instanceId: "residential-5",
      modelType: MODEL_TYPES.RESIDENTIAL_02_C,
      position: { x: 160, y: 0, z: 50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "skyscraper-1",
      modelType: MODEL_TYPES.SKYSCRAPER_01,
      position: { x: 220, y: 0, z: 50 },
      // Uses default scale from definition
    },
  ],
};

export const residentialBlockCollection: ModelCollection = {
  name: "residential-block",
  models: [
    // First row of residential buildings --------------------------
    {
      instanceId: "residential-1",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 50, y: 0, z: -50 },
      // Uses default scale from definition
    },
    {
      instanceId: "residential-2",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 100, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-3",
      modelType: MODEL_TYPES.RESIDENTIAL_01_C,
      position: { x: 150, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-4",
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      position: { x: 200, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-4",
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      position: { x: 250, y: 0, z: -50 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },

    // Second row of residential buildings --------------------------
    {
      instanceId: "residential-5",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 50, y: 0, z: -110 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-1",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 120, y: 0, z: -110 },
      // Uses default scale from definition
    },
    {
      instanceId: "residential-6",
      modelType: MODEL_TYPES.COMMERCIAL_03_A,
      position: { x: 180, y: 0, z: -110 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },
    {
      instanceId: "residential-6",
      modelType: MODEL_TYPES.RESIDENTIAL_02_C,
      position: { x: 240, y: 0, z: -110 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
      // rotation: { x: 0, y: Math.PI / 6, z: 0 },
    },

    // Third row of residential buildings --------------------------
    {
      instanceId: "residential-7",
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      position: { x: 50, y: 0, z: -170 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },
    {
      instanceId: "residential-8",
      modelType: MODEL_TYPES.COMMERCIAL_03_C,
      position: { x: 110, y: 0, z: -170 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },
    {
      instanceId: "residential-9",
      modelType: MODEL_TYPES.RESIDENTIAL_01_C,
      position: { x: 190, y: 0, z: -170 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },
    {
      instanceId: "residential-10",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 250, y: 0, z: -170 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },

    // Fourth row of residential buildings --------------------------
    {
      instanceId: "residential-11",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 50, y: 0, z: -240 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },
    {
      instanceId: "residential-12",
      modelType: MODEL_TYPES.RESIDENTIAL_02_C,
      position: { x: 130, y: 0, z: -240 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },
    {
      instanceId: "residential-13",
      modelType: MODEL_TYPES.COMMERCIAL_03_B,
      position: { x: 190, y: 0, z: -240 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },
    {
      instanceId: "residential-14",
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      position: { x: 250, y: 0, z: -240 },
      scale: { x: 0.8, y: 0.9, z: 0.8 },
    },
  ],
};

export const residentialAndCommercialBlockCollection: ModelCollection = {
  name: "residential-and-commercial-block-on-tile",
  models: [
    // First row of residential buildings --------------------------
    {
      instanceId: "rtile-r1-1",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: -100, y: 0, z: -100 },
    },
    {
      instanceId: "rtile-r1-2",
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      position: { x: -50, y: 0, z: -100 },
    },
    {
      instanceId: "rtile-r1-3",
      modelType: MODEL_TYPES.RESIDENTIAL_01_C,
      position: { x: 0, y: 0, z: -100 },
    },
    {
      instanceId: "rtile-r1-4",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 50, y: 0, z: -100 },
    },
    {
      instanceId: "rtile-r1-5",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 100, y: 0, z: -100 },
    },
    // Second row
    {
      instanceId: "rtile-r2-1",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: -100, y: 0, z: -40 },
    },
    {
      instanceId: "rtile-r2-2",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: -50, y: 0, z: -40 },
    },
    {
      instanceId: "rtile-r2-3",
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      position: { x: 0, y: 0, z: -40 },
    },
    {
      instanceId: "rtile-r2-4",
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      position: { x: 50, y: 0, z: -40 },
    },
    {
      instanceId: "rtile-r2-5",
      modelType: MODEL_TYPES.COMMERCIAL_03_A,
      position: { x: 100, y: 0, z: -40 },
    },

    // Third row
    {
      instanceId: "rtile-r3-1",
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      position: { x: -100, y: 0, z: 30 },
    },
    {
      instanceId: "rtile-r3-2",
      modelType: MODEL_TYPES.RESIDENTIAL_01_B,
      position: { x: -40, y: 0, z: 30 },
    },
    {
      instanceId: "rtile-r3-3",
      modelType: MODEL_TYPES.COMMERCIAL_03_C,
      position: { x: 30, y: 0, z: 30 },
    },
    {
      instanceId: "rtile-r3-4",
      modelType: MODEL_TYPES.RESIDENTIAL_02_C,
      position: { x: 100, y: 0, z: 30 },
    },

    // Fourth row
    {
      instanceId: "rtile-r4-1",
      modelType: MODEL_TYPES.COMMERCIAL_03_B,
      position: { x: -100, y: 0, z: 100 },
    },
    {
      instanceId: "rtile-r4-2",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: -30, y: 0, z: 100 },
    },
    {
      instanceId: "rtile-r4-3",
      modelType: MODEL_TYPES.RESIDENTIAL_01_C,
      position: { x: 40, y: 0, z: 100 },
    },
    {
      instanceId: "rtile-r4-4",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 100, y: 0, z: 100 },
    },
  ],
};

export const industrialBlockCollection: ModelCollection = {
  name: "industrial-block",
  models: [
    // first row of industrial buildings --------------------------

    {
      instanceId: "industrial-2",
      modelType: MODEL_TYPES.RESIDENTIAL_02_C,
      position: { x: 90, y: 0, z: 80 },
      scale: { x: 1.2, y: 1.0, z: 1.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      instanceId: "industrial-3",
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      position: { x: 0, y: 0, z: 80 },
      scale: { x: 1.2, y: 1.0, z: 1.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      instanceId: "industrial-4",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: -80, y: 0, z: 80 },
      scale: { x: 1.2, y: 1.0, z: 1.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },

    // second row of industrial buildings --------------------------

    {
      instanceId: "industrial-2",
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      position: { x: 90, y: 0, z: 0 },
      scale: { x: 1.2, y: 1.0, z: 1.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      instanceId: "industrial-3",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 1.2, y: 1.0, z: 1.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      instanceId: "industrial-4",
      modelType: MODEL_TYPES.RESIDENTIAL_02_C,
      position: { x: -80, y: 0, z: 0 },
      scale: { x: 1.2, y: 1.0, z: 1.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },

    // third row of industrial buildings --------------------------

    {
      instanceId: "industrial-1",
      modelType: MODEL_TYPES.INDUSTRIAL_04_A,
      position: { x: 20, y: 0, z: -80 },
      scale: { x: 1.2, y: 1.0, z: 1.2 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      emissiveConfig: {
        intensity: 3,
      },
    },
  ],
};

export const commercialBlockCollection1: ModelCollection = {
  name: "commercial-block1",
  models: [
    {
      instanceId: "cb1-r1-1",
      modelType: MODEL_TYPES.INDUSTRIAL_04_B,
      position: { x: 0, y: 0, z: -50 },
      emissiveConfig: {
        intensity: 3,
      },
    },

    // Second row
    {
      instanceId: "cb1-r2-1",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: -100, y: 0, z: 80 },
    },
    {
      instanceId: "cb1-r2-2",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: -50, y: 0, z: 80 },
    },
    {
      instanceId: "cb1-r2-3",
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      position: { x: 0, y: 0, z: 80 },
    },
    {
      instanceId: "cb1-r2-4",
      modelType: MODEL_TYPES.COMMERCIAL_03_B,
      position: { x: 90, y: 0, z: 90 },
    },
  ],
};

export const commercialBlockCollection2: ModelCollection = {
  name: "commercial-block1",
  models: [
    // First row of commercial buildings --------------------------
    {
      instanceId: "cb2-r1-1",
      modelType: MODEL_TYPES.INDUSTRIAL_04_C,
      position: { x: 0, y: 0, z: -40 },
      emissiveConfig: {
        intensity: 3,
      },
    },
    // // second row of commercial buildings --------------------------
    {
      instanceId: "cb2-r2-1",
      modelType: MODEL_TYPES.RESIDENTIAL_02_B,
      position: { x: 100, y: 0, z: 60 },
    },
    {
      instanceId: "cb2-r2-2",
      modelType: MODEL_TYPES.COMMERCIAL_03_A,
      position: { x: 0, y: 0, z: 60 },
    },
    {
      instanceId: "cb2-r2-3",
      modelType: MODEL_TYPES.RESIDENTIAL_02_A,
      position: { x: -100, y: 0, z: 60 },
    },
  ],
};

export const mixedUseBlockCollection1: ModelCollection = {
  name: "mixed-use-block1",
  models: [
    // First row of mixed-use buildings --------------------------
    {
      instanceId: "mub1-r1-1",
      modelType: MODEL_TYPES.MIXED_USE_05_A,
      position: { x: 0, y: 0, z: 0 },
    },
    // {
    //   instanceId: "mub1-r1-2",
    //   modelType: MODEL_TYPES.MIXED_USE_05_B,
    //   position: { x: 110, y: 0, z: 0 },
    // },
  ],
};

export const mixedUseBlockCollection2: ModelCollection = {
  name: "mixed-use-block2",
  models: [
    // First row of mixed-use buildings --------------------------
    {
      instanceId: "mub2-r1-1",
      modelType: MODEL_TYPES.MIXED_USE_05_C,
      position: { x: 0, y: 0, z: 0 },
    },
    // {
    //   instanceId: "mub1-r1-2",
    //   modelType: MODEL_TYPES.MIXED_USE_05_B,
    //   position: { x: 110, y: 0, z: 0 },
    // },
  ],
};

// Grid layout with mixed building types
export const gridLayoutCollection: ModelCollection = {
  name: "grid-layout",
  models: Array.from({ length: 4 }, (_, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;

    // Cycle through different building types
    const modelTypes = [
      MODEL_TYPES.GLASS_CUBE,
      MODEL_TYPES.RESIDENTIAL_01_A,
      MODEL_TYPES.RESIDENTIAL_01_B,
      MODEL_TYPES.HIGH_RISE,
    ];
    const modelType = modelTypes[i % modelTypes.length];

    return {
      instanceId: `grid-building-${i}`,
      modelType,
      position: {
        x: (col - 1.5) * 80,
        y: 0,
        z: (row - 1.5) * 80,
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
  residentialBlockCollection,
  buildingsCollection,
  industrialBlockCollection,
  // commercialCollection,
  // residentialCollection,
  gridLayoutCollection,
];
