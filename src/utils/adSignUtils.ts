import * as THREE from "three";
import { colors } from "./constants.js";
import type { AssetManager } from "../models/AssetManager.js";

export interface NeonSignOptions {
  diffusePath: string;
  emissivePath?: string;
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
  addToScene?: THREE.Scene; // if provided, add immediately
  renderer?: THREE.WebGLRenderer; // for max anisotropy
}

/**
 * Creates a textured plane mesh for neon signs/ads with emissive map support.
 * Returns the mesh; if addToScene is passed, also adds it to the scene.
 */
export const createNeonSignPlane = async (
  assetManager: AssetManager,
  options: NeonSignOptions
): Promise<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>> => {
  const {
    diffusePath,
    emissivePath,
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
    addToScene,
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
    (mesh as THREE.Object3D & { excludeFromEffects?: boolean }).excludeFromEffects = true;
  }

  if (addToScene) addToScene.add(mesh);
  return mesh as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
};
