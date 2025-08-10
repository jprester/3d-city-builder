import * as THREE from "three";
import { colors } from "../utils/constants.js";
import type { AssetManager } from "./AssetManager.js";
import {
  AD_DEFINITIONS,
  AdDefinition,
  AdDefinitionRegistry,
} from "./definitions/ModelDefinitions.js";

export interface NeonSignOptions {
  width?: number;
  height?: number;
  position?: { x: number; y: number; z: number };
  rotationY?: number; // radians
  emissiveColor?: number | THREE.Color;
  emissiveIntensity?: number;
  doubleSided?: boolean;
  crispEmissive?: boolean;
  name?: string;
  excludeFromEffects?: boolean; // default true
  renderer?: THREE.WebGLRenderer; // for max anisotropy
}

/**
 * Creates a textured plane mesh for neon signs/ads with emissive map support.
 */
export const createNeonSignPlane = async (
  assetManager: AssetManager,
  diffusePath: string,
  emissivePath: string | undefined,
  options: NeonSignOptions = {}
): Promise<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>> => {
  const {
    width = 32,
    height = 8,
    position,
    rotationY = 0,
    emissiveColor = colors.electricBlue,
    emissiveIntensity = 2.5,
    doubleSided = true,
    crispEmissive = true,
    name = "neon-sign",
    excludeFromEffects = true,
    renderer,
  } = options;

  const baseTex = await assetManager.loadTexture(diffusePath);
  baseTex.colorSpace = THREE.SRGBColorSpace;

  let emissiveTex: THREE.Texture | undefined;
  if (emissivePath) {
    emissiveTex = await assetManager.loadTexture(emissivePath);
    emissiveTex.colorSpace = THREE.SRGBColorSpace;
    if (crispEmissive) {
      emissiveTex.generateMipmaps = false;
      emissiveTex.minFilter = THREE.LinearFilter;
      emissiveTex.magFilter = THREE.LinearFilter;
    }
  }

  const aniso = renderer?.capabilities?.getMaxAnisotropy
    ? renderer.capabilities.getMaxAnisotropy()
    : 8;
  baseTex.anisotropy = Math.max(baseTex.anisotropy || 1, aniso);
  if (emissiveTex) emissiveTex.anisotropy = Math.max(1, aniso);

  const mat = new THREE.MeshStandardMaterial({
    map: baseTex,
    emissiveMap: emissiveTex,
    emissive:
      emissiveColor instanceof THREE.Color
        ? emissiveColor
        : new THREE.Color(emissiveColor),
    emissiveIntensity,
    roughness: 0.8,
    metalness: 0.0,
    side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
  });

  const geo = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  if (position) mesh.position.set(position.x, position.y, position.z);
  if (rotationY) mesh.rotation.y = rotationY;

  if (excludeFromEffects) {
    (
      mesh as THREE.Object3D & { excludeFromEffects?: boolean }
    ).excludeFromEffects = true;
  }

  return mesh as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
};

export class AdSignPlacer {
  private readonly assetManager: AssetManager;
  constructor(assetManager: AssetManager) {
    this.assetManager = assetManager;
  }

  async placeAd(
    definitionIdOrConfig: keyof typeof AD_DEFINITIONS | AdDefinition,
    scene: THREE.Scene,
    overrides: NeonSignOptions & {
      position: { x: number; y: number; z: number };
      name?: string;
    }
  ): Promise<THREE.Mesh> {
    let def: AdDefinition;

    // Check if it's a definition ID or a direct config
    if (typeof definitionIdOrConfig === "string") {
      def = AD_DEFINITIONS[definitionIdOrConfig as string];
      if (!def) {
        throw new Error(
          `Ad definition not found: ${String(definitionIdOrConfig)}`
        );
      }
    } else {
      // Direct AdDefinition object passed
      def = definitionIdOrConfig;
    }

    const mesh = await createNeonSignPlane(
      this.assetManager,
      def.diffusePath,
      def.emissivePath,
      {
        width: overrides.width ?? def.defaultSize?.width,
        height: overrides.height ?? def.defaultSize?.height,
        position: overrides.position,
        rotationY: overrides.rotationY ?? 0,
        emissiveColor:
          overrides.emissiveColor ?? def.emissiveColor ?? colors.electricBlue,
        emissiveIntensity:
          overrides.emissiveIntensity ?? def.emissiveIntensity ?? 2.5,
        doubleSided: overrides.doubleSided ?? def.doubleSided ?? true,
        crispEmissive: overrides.crispEmissive ?? def.crispEmissive ?? true,
        name: overrides.name ?? def.name,
        excludeFromEffects:
          overrides.excludeFromEffects ?? def.excludeFromEffects ?? true,
      }
    );

    scene.add(mesh);
    return mesh;
  }

  /**
   * Convenience method to create an ad sign with minimal configuration
   */
  async createAdSign(
    scene: THREE.Scene,
    config: {
      diffusePath: string;
      emissivePath?: string;
      position: { x: number; y: number; z: number };
      width?: number;
      height?: number;
      name?: string;
      emissiveColor?: number | THREE.Color;
      emissiveIntensity?: number;
      rotationY?: number;
      doubleSided?: boolean;
      crispEmissive?: boolean;
      excludeFromEffects?: boolean;
    }
  ): Promise<THREE.Mesh> {
    const adDefinition: AdDefinition = {
      id: config.name || "custom-ad-sign",
      name: config.name || "Custom Ad Sign",
      diffusePath: config.diffusePath,
      emissivePath: config.emissivePath,
      defaultSize: {
        width: config.width || 32,
        height: config.height || 8,
      },
      emissiveColor: config.emissiveColor || colors.electricBlue,
      emissiveIntensity: config.emissiveIntensity || 2.5,
      doubleSided: config.doubleSided ?? true,
      crispEmissive: config.crispEmissive ?? true,
      excludeFromEffects: config.excludeFromEffects ?? true,
      category: "ad",
      description: "Dynamically created ad sign",
    };

    return this.placeAd(adDefinition, scene, {
      position: config.position,
      rotationY: config.rotationY,
      name: config.name,
    });
  }
}

export const registerAdDefinition = (def: AdDefinition): void => {
  AdDefinitionRegistry.addDefinition(def);
};
