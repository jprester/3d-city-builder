import * as THREE from "three";
import { InstancedCollection } from "../InstancedModelPlacer.js";

/**
 * Comprehensive City Layout with ~80 Buildings
 * Using LOW-POLY CITY BUILDINGS + Premium Buildings
 * Optimized with instancing for performance
 *
 * Urban Planning Layout:
 * - Tiles 1, 4, 5: Financial District (skyscrapers, tall buildings)
 * - Tiles 2, 8: Residential District (apartments, residential complexes)
 * - Tiles 3, 6, 11: Commercial District (offices, hotels)
 * - Tiles 7, 9, 10, 12: Mixed-Use District
 * - Tile 13: Landmark District
 */

// Helper function to create grid positions within a tile
function createGridPositions(
  tileCenter: { x: number; z: number },
  rows: number,
  cols: number,
  spacing: number = 50,
  randomOffset: number = 5
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const startX = tileCenter.x - ((cols - 1) * spacing) / 2;
  const startZ = tileCenter.z - ((rows - 1) * spacing) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * spacing + (Math.random() - 0.5) * randomOffset;
      const z = startZ + row * spacing + (Math.random() - 0.5) * randomOffset;
      positions.push(new THREE.Vector3(x, 0, z));
    }
  }
  return positions;
}

// RESIDENTIAL DISTRICT (Tiles 2, 8) - 20 buildings
const tile2Positions = createGridPositions({ x: -150, z: 150 }, 3, 3, 60); // 9 buildings
const tile8Positions = createGridPositions({ x: -450, z: 150 }, 3, 4, 55); // 12 buildings

// COMMERCIAL DISTRICT (Tiles 3, 6, 11) - 20 buildings
const tile3Positions = createGridPositions({ x: 150, z: 150 }, 3, 3, 60); // 9 buildings
const tile6Positions = createGridPositions({ x: -150, z: -450 }, 2, 3, 65); // 6 buildings
const tile11Positions = createGridPositions({ x: 450, z: -150 }, 2, 3, 65); // 6 buildings

// MIXED-USE DISTRICT (Tiles 7, 9, 10, 12) - 16 buildings
const tile7Positions = createGridPositions({ x: -450, z: -150 }, 2, 2, 70); // 4 buildings
const tile9Positions = createGridPositions({ x: -450, z: -450 }, 2, 2, 70); // 4 buildings
const tile10Positions = createGridPositions({ x: 450, z: 150 }, 2, 2, 70); // 4 buildings
const tile12Positions = createGridPositions({ x: 450, z: -450 }, 2, 2, 70); // 4 buildings

// FINANCIAL DISTRICT (Tiles 1, 4, 5) - 19 buildings
const tile1Positions = createGridPositions({ x: -150, z: -150 }, 2, 3, 70); // 6 buildings
const tile4Positions = createGridPositions({ x: 150, z: -150 }, 3, 3, 60); // 9 buildings
const tile5Positions = createGridPositions({ x: 150, z: -450 }, 2, 2, 80); // 4 buildings

// LANDMARK DISTRICT (Tile 13) - 5 buildings
const tile13Positions = createGridPositions({ x: 0, z: -950 }, 1, 5, 80); // 5 buildings

export const completeCityLayout: InstancedCollection = {
  name: "complete-city-layout",
  groups: [
    // ==============================================
    // RESIDENTIAL DISTRICT (~20 buildings)
    // ==============================================
    {
      modelType: "LP_RESIDENTIAL_COMPLEX",
      instances: [
        ...tile2Positions.slice(0, 5).map((pos, idx) => ({
          instanceId: `lp-residential-tile2-${idx}`,
          modelType: "LP_RESIDENTIAL_COMPLEX",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile8Positions.slice(0, 6).map((pos, idx) => ({
          instanceId: `lp-residential-tile8-${idx}`,
          modelType: "LP_RESIDENTIAL_COMPLEX",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "PREMIUM_CYBERPUNK_APARTMENT",
      instances: [
        ...tile2Positions.slice(5, 7).map((pos, idx) => ({
          instanceId: `premium-apartment-tile2-${idx}`,
          modelType: "PREMIUM_CYBERPUNK_APARTMENT",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "PREMIUM_ANIME_RESIDENTIAL",
      instances: [
        ...tile2Positions.slice(7, 9).map((pos, idx) => ({
          instanceId: `premium-anime-tile2-${idx}`,
          modelType: "PREMIUM_ANIME_RESIDENTIAL",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_BOX_BUILDING",
      instances: [
        ...tile8Positions.slice(6, 12).map((pos, idx) => ({
          instanceId: `lp-box-tile8-${idx}`,
          modelType: "LP_BOX_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },

    // ==============================================
    // COMMERCIAL DISTRICT (~20 buildings)
    // ==============================================
    {
      modelType: "LP_STANDARD_OFFICE",
      instances: [
        ...tile3Positions.slice(0, 4).map((pos, idx) => ({
          instanceId: `lp-office-tile3-${idx}`,
          modelType: "LP_STANDARD_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile6Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-office-tile6-${idx}`,
          modelType: "LP_STANDARD_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_GLASSY_OFFICE",
      instances: [
        ...tile3Positions.slice(4, 7).map((pos, idx) => ({
          instanceId: `lp-glassy-tile3-${idx}`,
          modelType: "LP_GLASSY_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile11Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-glassy-tile11-${idx}`,
          modelType: "LP_GLASSY_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_HOTEL_BUILDING",
      instances: [
        ...tile3Positions.slice(7, 9).map((pos, idx) => ({
          instanceId: `lp-hotel-tile3-${idx}`,
          modelType: "LP_HOTEL_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile6Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `lp-hotel-tile6-${idx}`,
          modelType: "LP_HOTEL_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_BRUTALIST_OFFICE",
      instances: [
        ...tile6Positions.slice(4, 6).map((pos, idx) => ({
          instanceId: `lp-brutalist-tile6-${idx}`,
          modelType: "LP_BRUTALIST_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "PREMIUM_AD_BUILDING",
      instances: [
        ...tile11Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `premium-ad-tile11-${idx}`,
          modelType: "PREMIUM_AD_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_ROUNDED_CORNER",
      instances: [
        ...tile11Positions.slice(4, 6).map((pos, idx) => ({
          instanceId: `lp-rounded-tile11-${idx}`,
          modelType: "LP_ROUNDED_CORNER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },

    // ==============================================
    // MIXED-USE DISTRICT (~16 buildings)
    // ==============================================
    {
      modelType: "LP_BLOCKY_BUILDING",
      instances: [
        ...tile7Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-blocky-tile7-${idx}`,
          modelType: "LP_BLOCKY_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile10Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-blocky-tile10-${idx}`,
          modelType: "LP_BLOCKY_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_BLOCKY_BUILDING_LOGO",
      instances: [
        ...tile7Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `lp-blocky-logo-tile7-${idx}`,
          modelType: "LP_BLOCKY_BUILDING_LOGO",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_PUBLIC_BUILDING",
      instances: [
        ...tile9Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-public-tile9-${idx}`,
          modelType: "LP_PUBLIC_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile12Positions.slice(0, 1).map((pos, idx) => ({
          instanceId: `lp-public-tile12-${idx}`,
          modelType: "LP_PUBLIC_BUILDING",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_STANDARD_OFFICE",
      instances: [
        ...tile9Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `lp-office-tile9-${idx}`,
          modelType: "LP_STANDARD_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile10Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `lp-office-tile10-${idx}`,
          modelType: "LP_STANDARD_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile12Positions.slice(1, 4).map((pos, idx) => ({
          instanceId: `lp-office-tile12-${idx}`,
          modelType: "LP_STANDARD_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },

    // ==============================================
    // FINANCIAL DISTRICT - SKYSCRAPERS (~19 buildings)
    // ==============================================
    {
      modelType: "LP_CURVED_SKYSCRAPER",
      instances: [
        ...tile1Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-curved-tile1-${idx}`,
          modelType: "LP_CURVED_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile4Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-curved-tile4-${idx}`,
          modelType: "LP_CURVED_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_MULTI_LEVEL_SKYSCRAPER",
      instances: [
        ...tile1Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `lp-multilevel-tile1-${idx}`,
          modelType: "LP_MULTI_LEVEL_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile4Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `lp-multilevel-tile4-${idx}`,
          modelType: "LP_MULTI_LEVEL_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_RECTANGULAR_SKYSCRAPER",
      instances: [
        ...tile1Positions.slice(4, 6).map((pos, idx) => ({
          instanceId: `lp-rectangular-tile1-${idx}`,
          modelType: "LP_RECTANGULAR_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
        ...tile4Positions.slice(4, 6).map((pos, idx) => ({
          instanceId: `lp-rectangular-tile4-${idx}`,
          modelType: "LP_RECTANGULAR_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "LP_NY_SKYSCRAPER",
      instances: [
        ...tile4Positions.slice(6, 9).map((pos, idx) => ({
          instanceId: `lp-ny-sky-tile4-${idx}`,
          modelType: "LP_NY_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1.2, 1.2, 1.2),
        })),
      ],
    },
    {
      modelType: "LP_MODULAR_SKYSCRAPER",
      instances: [
        ...tile5Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `lp-modular-tile5-${idx}`,
          modelType: "LP_MODULAR_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1.3, 1.3, 1.3),
        })),
      ],
    },
    {
      modelType: "PREMIUM_NY_OFFICE",
      instances: [
        ...tile5Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `premium-ny-office-tile5-${idx}`,
          modelType: "PREMIUM_NY_OFFICE",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        })),
      ],
    },
    {
      modelType: "PREMIUM_DARK_SKYSCRAPER",
      instances: [
        {
          instanceId: "premium-dark-sky-tile4-1",
          modelType: "PREMIUM_DARK_SKYSCRAPER",
          position: new THREE.Vector3(120, 0, -280),
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1, 1, 1),
        },
      ],
    },

    // ==============================================
    // LANDMARK DISTRICT (Tile 13) - 5 buildings
    // ==============================================
    {
      modelType: "LP_CURVED_SKYSCRAPER",
      instances: [
        ...tile13Positions.slice(0, 2).map((pos, idx) => ({
          instanceId: `landmark-curved-${idx}`,
          modelType: "LP_CURVED_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
          scale: new THREE.Vector3(1.5, 1.5, 1.5),
        })),
      ],
    },
    {
      modelType: "LP_MULTI_LEVEL_SKYSCRAPER",
      instances: [
        ...tile13Positions.slice(2, 4).map((pos, idx) => ({
          instanceId: `landmark-multilevel-${idx}`,
          modelType: "LP_MULTI_LEVEL_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.PI / 4, 0),
          scale: new THREE.Vector3(1.4, 1.4, 1.4),
        })),
      ],
    },
    {
      modelType: "PREMIUM_DARK_SKYSCRAPER",
      instances: [
        ...tile13Positions.slice(4, 5).map((pos, idx) => ({
          instanceId: `landmark-dark-sky-${idx}`,
          modelType: "PREMIUM_DARK_SKYSCRAPER",
          position: pos,
          rotation: new THREE.Euler(0, Math.PI / 2, 0),
          scale: new THREE.Vector3(1.3, 1.3, 1.3),
        })),
      ],
    },
  ],
};

/**
 * Total Building Count Summary:
 * - Residential: 20 buildings (LP_RESIDENTIAL_COMPLEX + Premium apartments)
 * - Commercial: 20 buildings (LP offices, hotels, brutalist, ad buildings)
 * - Mixed-Use: 16 buildings (LP blocky, public, office buildings)
 * - Financial: 19 buildings (LP skyscrapers, Premium NY Office, Dark Skyscraper)
 * - Landmark: 5 buildings (Scaled-up skyscrapers)
 *
 * TOTAL: 80 buildings
 *
 * Building Types Used:
 * - Low-Poly Buildings: ~65 buildings (81%)
 * - Premium Buildings: ~15 buildings (19%)
 *
 * Performance Optimizations:
 * - All buildings use InstancedMesh for GPU instancing
 * - Low-poly buildings share texture atlas (minimal draw calls)
 * - Buildings grouped by type for optimal rendering
 * - Strategic positioning to avoid overlap
 * - Randomized rotations for visual variety
 */
