import { ModelCollection } from "../ModelPlacer.js";

/**
 * Dense City Layout with ~80 Buildings
 * Concentrated on Tiles 1-4 for high density
 * Using LOW-POLY CITY BUILDINGS + Premium Buildings
 *
 * Urban Planning Layout:
 * - Tile 1: Financial District (skyscrapers)
 * - Tile 2: Residential District (apartments)
 * - Tile 3: Commercial District (offices, hotels)
 * - Tile 4: Mixed-Use District
 */

// Helper function to create dense grid positions
function createPositions(
  tileCenter: { x: number; z: number },
  rows: number,
  cols: number,
  spacing: number = 40,
  randomOffset: number = 8
): Array<{ x: number; y: number; z: number }> {
  const positions: Array<{ x: number; y: number; z: number }> = [];
  const startX = tileCenter.x - ((cols - 1) * spacing) / 2;
  const startZ = tileCenter.z - ((rows - 1) * spacing) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * spacing + (Math.random() - 0.5) * randomOffset;
      const z = startZ + row * spacing + (Math.random() - 0.5) * randomOffset;
      positions.push({ x, y: 0, z });
    }
  }
  return positions;
}

// Dense tile positions - ~20 buildings per tile
const tile1Pos = createPositions({ x: -150, z: -150 }, 4, 5, 45); // 20 buildings - Financial
const tile2Pos = createPositions({ x: -150, z: 150 }, 4, 5, 45);  // 20 buildings - Residential
const tile3Pos = createPositions({ x: 150, z: 150 }, 4, 5, 45);   // 20 buildings - Commercial
const tile4Pos = createPositions({ x: 150, z: -150 }, 4, 5, 45);  // 20 buildings - Mixed-Use

export const completeCityLayout: ModelCollection = {
  name: "complete-city-layout",
  models: [
    // ==============================================
    // TILE 1 - FINANCIAL DISTRICT (20 buildings)
    // ==============================================
    { instanceId: "curved-sky-t1-0", modelType: "LP_CURVED_SKYSCRAPER", position: tile1Pos[0] },
    { instanceId: "curved-sky-t1-1", modelType: "LP_CURVED_SKYSCRAPER", position: tile1Pos[1] },
    { instanceId: "curved-sky-t1-2", modelType: "LP_CURVED_SKYSCRAPER", position: tile1Pos[2] },
    { instanceId: "multi-sky-t1-0", modelType: "LP_MULTI_LEVEL_SKYSCRAPER", position: tile1Pos[3] },
    { instanceId: "multi-sky-t1-1", modelType: "LP_MULTI_LEVEL_SKYSCRAPER", position: tile1Pos[4] },
    { instanceId: "multi-sky-t1-2", modelType: "LP_MULTI_LEVEL_SKYSCRAPER", position: tile1Pos[5] },
    { instanceId: "rect-sky-t1-0", modelType: "LP_RECTANGULAR_SKYSCRAPER", position: tile1Pos[6] },
    { instanceId: "rect-sky-t1-1", modelType: "LP_RECTANGULAR_SKYSCRAPER", position: tile1Pos[7] },
    { instanceId: "rect-sky-t1-2", modelType: "LP_RECTANGULAR_SKYSCRAPER", position: tile1Pos[8] },
    { instanceId: "ny-sky-t1-0", modelType: "LP_NY_SKYSCRAPER", position: tile1Pos[9], scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { instanceId: "ny-sky-t1-1", modelType: "LP_NY_SKYSCRAPER", position: tile1Pos[10], scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { instanceId: "ny-sky-t1-2", modelType: "LP_NY_SKYSCRAPER", position: tile1Pos[11], scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { instanceId: "modular-sky-t1-0", modelType: "LP_MODULAR_SKYSCRAPER", position: tile1Pos[12], scale: { x: 1.3, y: 1.3, z: 1.3 } },
    { instanceId: "modular-sky-t1-1", modelType: "LP_MODULAR_SKYSCRAPER", position: tile1Pos[13], scale: { x: 1.3, y: 1.3, z: 1.3 } },
    { instanceId: "modular-sky-t1-2", modelType: "LP_MODULAR_SKYSCRAPER", position: tile1Pos[14], scale: { x: 1.3, y: 1.3, z: 1.3 } },
    { instanceId: "premium-ny-t1-0", modelType: "PREMIUM_NY_OFFICE", position: tile1Pos[15] },
    { instanceId: "premium-ny-t1-1", modelType: "PREMIUM_NY_OFFICE", position: tile1Pos[16] },
    { instanceId: "premium-dark-t1-0", modelType: "PREMIUM_DARK_SKYSCRAPER", position: tile1Pos[17], scale: { x: 1.2, y: 1.2, z: 1.2 } },
    { instanceId: "glassy-office-t1-0", modelType: "LP_GLASSY_OFFICE", position: tile1Pos[18] },
    { instanceId: "glassy-office-t1-1", modelType: "LP_GLASSY_OFFICE", position: tile1Pos[19] },

    // ==============================================
    // TILE 2 - RESIDENTIAL DISTRICT (20 buildings)
    // ==============================================
    { instanceId: "res-complex-t2-0", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[0] },
    { instanceId: "res-complex-t2-1", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[1] },
    { instanceId: "res-complex-t2-2", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[2] },
    { instanceId: "res-complex-t2-3", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[3] },
    { instanceId: "res-complex-t2-4", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[4] },
    { instanceId: "res-complex-t2-5", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[5] },
    { instanceId: "res-complex-t2-6", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[6] },
    { instanceId: "res-complex-t2-7", modelType: "LP_RESIDENTIAL_COMPLEX", position: tile2Pos[7] },
    { instanceId: "box-build-t2-0", modelType: "LP_BOX_BUILDING", position: tile2Pos[8] },
    { instanceId: "box-build-t2-1", modelType: "LP_BOX_BUILDING", position: tile2Pos[9] },
    { instanceId: "box-build-t2-2", modelType: "LP_BOX_BUILDING", position: tile2Pos[10] },
    { instanceId: "box-build-t2-3", modelType: "LP_BOX_BUILDING", position: tile2Pos[11] },
    { instanceId: "rounded-t2-0", modelType: "LP_ROUNDED_CORNER", position: tile2Pos[12] },
    { instanceId: "rounded-t2-1", modelType: "LP_ROUNDED_CORNER", position: tile2Pos[13] },
    { instanceId: "rounded-t2-2", modelType: "LP_ROUNDED_CORNER", position: tile2Pos[14] },
    { instanceId: "premium-cyber-t2-0", modelType: "PREMIUM_CYBERPUNK_APARTMENT", position: tile2Pos[15] },
    { instanceId: "premium-cyber-t2-1", modelType: "PREMIUM_CYBERPUNK_APARTMENT", position: tile2Pos[16] },
    { instanceId: "premium-cyber-t2-2", modelType: "PREMIUM_CYBERPUNK_APARTMENT", position: tile2Pos[17] },
    { instanceId: "premium-anime-t2-0", modelType: "PREMIUM_ANIME_RESIDENTIAL", position: tile2Pos[18] },
    { instanceId: "premium-anime-t2-1", modelType: "PREMIUM_ANIME_RESIDENTIAL", position: tile2Pos[19] },

    // ==============================================
    // TILE 3 - COMMERCIAL DISTRICT (20 buildings)
    // ==============================================
    { instanceId: "std-office-t3-0", modelType: "LP_STANDARD_OFFICE", position: tile3Pos[0] },
    { instanceId: "std-office-t3-1", modelType: "LP_STANDARD_OFFICE", position: tile3Pos[1] },
    { instanceId: "std-office-t3-2", modelType: "LP_STANDARD_OFFICE", position: tile3Pos[2] },
    { instanceId: "std-office-t3-3", modelType: "LP_STANDARD_OFFICE", position: tile3Pos[3] },
    { instanceId: "std-office-t3-4", modelType: "LP_STANDARD_OFFICE", position: tile3Pos[4] },
    { instanceId: "glassy-office-t3-0", modelType: "LP_GLASSY_OFFICE", position: tile3Pos[5] },
    { instanceId: "glassy-office-t3-1", modelType: "LP_GLASSY_OFFICE", position: tile3Pos[6] },
    { instanceId: "glassy-office-t3-2", modelType: "LP_GLASSY_OFFICE", position: tile3Pos[7] },
    { instanceId: "glassy-office-t3-3", modelType: "LP_GLASSY_OFFICE", position: tile3Pos[8] },
    { instanceId: "hotel-t3-0", modelType: "LP_HOTEL_BUILDING", position: tile3Pos[9] },
    { instanceId: "hotel-t3-1", modelType: "LP_HOTEL_BUILDING", position: tile3Pos[10] },
    { instanceId: "hotel-t3-2", modelType: "LP_HOTEL_BUILDING", position: tile3Pos[11] },
    { instanceId: "brutalist-t3-0", modelType: "LP_BRUTALIST_OFFICE", position: tile3Pos[12] },
    { instanceId: "brutalist-t3-1", modelType: "LP_BRUTALIST_OFFICE", position: tile3Pos[13] },
    { instanceId: "brutalist-t3-2", modelType: "LP_BRUTALIST_OFFICE", position: tile3Pos[14] },
    { instanceId: "premium-ad-t3-0", modelType: "PREMIUM_AD_BUILDING", position: tile3Pos[15] },
    { instanceId: "premium-ad-t3-1", modelType: "PREMIUM_AD_BUILDING", position: tile3Pos[16] },
    { instanceId: "premium-ad-t3-2", modelType: "PREMIUM_AD_BUILDING", position: tile3Pos[17] },
    { instanceId: "multi-sky-t3-0", modelType: "LP_MULTI_LEVEL_SKYSCRAPER", position: tile3Pos[18] },
    { instanceId: "multi-sky-t3-1", modelType: "LP_MULTI_LEVEL_SKYSCRAPER", position: tile3Pos[19] },

    // ==============================================
    // TILE 4 - MIXED-USE DISTRICT (20 buildings)
    // ==============================================
    { instanceId: "blocky-t4-0", modelType: "LP_BLOCKY_BUILDING", position: tile4Pos[0] },
    { instanceId: "blocky-t4-1", modelType: "LP_BLOCKY_BUILDING", position: tile4Pos[1] },
    { instanceId: "blocky-t4-2", modelType: "LP_BLOCKY_BUILDING", position: tile4Pos[2] },
    { instanceId: "blocky-logo-t4-0", modelType: "LP_BLOCKY_BUILDING_LOGO", position: tile4Pos[3] },
    { instanceId: "blocky-logo-t4-1", modelType: "LP_BLOCKY_BUILDING_LOGO", position: tile4Pos[4] },
    { instanceId: "blocky-logo-t4-2", modelType: "LP_BLOCKY_BUILDING_LOGO", position: tile4Pos[5] },
    { instanceId: "public-t4-0", modelType: "LP_PUBLIC_BUILDING", position: tile4Pos[6] },
    { instanceId: "public-t4-1", modelType: "LP_PUBLIC_BUILDING", position: tile4Pos[7] },
    { instanceId: "public-t4-2", modelType: "LP_PUBLIC_BUILDING", position: tile4Pos[8] },
    { instanceId: "std-office-t4-0", modelType: "LP_STANDARD_OFFICE", position: tile4Pos[9] },
    { instanceId: "std-office-t4-1", modelType: "LP_STANDARD_OFFICE", position: tile4Pos[10] },
    { instanceId: "std-office-t4-2", modelType: "LP_STANDARD_OFFICE", position: tile4Pos[11] },
    { instanceId: "rounded-t4-0", modelType: "LP_ROUNDED_CORNER", position: tile4Pos[12] },
    { instanceId: "rounded-t4-1", modelType: "LP_ROUNDED_CORNER", position: tile4Pos[13] },
    { instanceId: "curved-sky-t4-0", modelType: "LP_CURVED_SKYSCRAPER", position: tile4Pos[14] },
    { instanceId: "curved-sky-t4-1", modelType: "LP_CURVED_SKYSCRAPER", position: tile4Pos[15] },
    { instanceId: "rect-sky-t4-0", modelType: "LP_RECTANGULAR_SKYSCRAPER", position: tile4Pos[16] },
    { instanceId: "rect-sky-t4-1", modelType: "LP_RECTANGULAR_SKYSCRAPER", position: tile4Pos[17] },
    { instanceId: "hotel-t4-0", modelType: "LP_HOTEL_BUILDING", position: tile4Pos[18] },
    { instanceId: "hotel-t4-1", modelType: "LP_HOTEL_BUILDING", position: tile4Pos[19] },
  ],
};

/**
 * Total: 80 buildings concentrated on 4 tiles
 * ~20 buildings per tile for dense urban feel
 *
 * Distribution:
 * - Tile 1 (Financial): 20 buildings (skyscrapers)
 * - Tile 2 (Residential): 20 buildings (apartments, houses)
 * - Tile 3 (Commercial): 20 buildings (offices, hotels)
 * - Tile 4 (Mixed-Use): 20 buildings (variety)
 *
 * Building Types:
 * - Low-Poly: ~70 buildings (87.5%)
 * - Premium: ~10 buildings (12.5%)
 */
