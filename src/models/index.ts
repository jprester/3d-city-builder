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
} from "./definitions/ModelDefinitions.js";
export {
  buildingsCollection,
  commercialCollection,
  residentialCollection,
  gridLayoutCollection,
  allCollections,
} from "./collections/example-collections.js";
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
