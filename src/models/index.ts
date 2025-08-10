// Central export file for the models system
export { AssetManager, type SkyTextureOptions } from "./AssetManager.js";
export { ModelPlacer } from "./ModelPlacer.js";
export {
  InstancedModelPlacer,
  type InstancedCollection,
  type InstancedModelGroup,
  type PlacedInstancedModel,
} from "./InstancedModelPlacer.js";
export {
  ModelDefinitionRegistry,
  MODEL_TYPES,
  MODEL_DEFINITIONS,
  type ModelDefinition,
  type ModelType,
  // Ad definitions
  AdDefinitionRegistry,
  AD_TYPES,
  AD_DEFINITIONS,
  type AdDefinition,
  type AdType,
} from "./definitions/ModelDefinitions.js";
export {
  residentialBlockCollection,
  cityBuildingsCollection,
  // commercialCollection,
  // residentialCollection,
  gridLayoutCollection,
  allCollections,
  residentialAndCommercialBlockCollection,
} from "./collections/building-collections.js";
export {
  massResidentialCollection,
  skyscraperDistrictCollection,
  megaCityCollection,
  circularCityCollection,
  allInstancedCollections,
} from "./collections/instanced-collections.js";
export {
  downtownFinancialDistrict,
  corporateOfficeDistrict,
  mixedUseUrbanDistrict,
  residentialNeighborhoods,
  industrialZone,
  waterfrontDistrict,
  entertainmentDistrict,
  completeCityDesign,
  allCityDistricts,
} from "./collections/city-design.js";
export {
  compactCityBlocks,
  compactCityCollections,
} from "./collections/compact-city.js";
export {
  type ModelPosition,
  type ModelScale,
  type ModelRotation,
  type ModelInstance,
  type ModelCollection,
  type PlacedModel,
} from "./ModelPlacer.js";

// Ads/Neon signs
export {
  AdSignPlacer,
  createNeonSignPlane,
  registerAdDefinition,
} from "./adSigns.js";
