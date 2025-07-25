import * as THREE from "three";
import { AssetManager } from "../models/AssetManager.js";
import {
  MODEL_DEFINITIONS,
  MODEL_TYPES,
  type EmissiveConfig,
} from "../models/definitions/ModelDefinitions.js";
import { colors } from "./constants.js";
// import { applyEmissiveToObject } from "./windowLightingUtils.js"; // Not needed for ground plane

export const getMemoryInfo = (renderer: THREE.WebGLRenderer) => {
  const info = renderer.info;

  return {
    geometries: info.memory.geometries,
    textures: info.memory.textures,
    programs: info.programs?.length || 0,
    calls: info.render.calls,
    triangles: info.render.triangles,
    points: info.render.points,
    lines: info.render.lines,
  };
};

export const getMemoryUsage = (renderer: THREE.WebGLRenderer) => {
  const memoryInfo = getMemoryInfo(renderer);
  console.log("Memory Usage:", memoryInfo);
  return memoryInfo;
};

export const addHumanReferenceModel = async (
  scene: THREE.Scene,
  options?: { color?: number; emissive?: number; emissiveIntensity?: number }
) => {
  const humanGeometry = new THREE.BoxGeometry(0.4, 1.7, 0.2); // Width: 0.4m, Height: 1.7m, Depth: 0.2m
  const humanMaterial = new THREE.MeshStandardMaterial({
    color: options?.color || colors.red, // Red color for visibility
    emissive: new THREE.Color(options?.emissive || colors.darkRed),
    emissiveIntensity: options?.emissiveIntensity || 10,
  });
  const humanReference = new THREE.Mesh(humanGeometry, humanMaterial);
  humanReference.position.set(0, 0.2, 0); // Position at center, half height above ground
  humanReference.name = "HumanReference";
  scene.add(humanReference);
};

export const createGroundPlane = async (
  scene: THREE.Scene,
  assetManager: AssetManager,
  options?: {
    size?: number;
    position?: { x: number; y: number; z: number };
    textureRepeat?: number;
    fallbackColor?: number;
    emissiveConfig?: EmissiveConfig; // Override emissive configuration
  }
) => {
  const groundDef = MODEL_DEFINITIONS[MODEL_TYPES.GROUND_PLANE];
  const {
    size = 100,
    position = { x: 0, y: -0.5, z: 0 },
    textureRepeat = 10,
    fallbackColor = colors.darkerGrey,
  } = options || {};

  try {
    const textures = groundDef.textures ?? {};
    const groundTextures = await assetManager.loadTextures({
      base: textures.base || "/assets/textures/ground.jpg",
      emissive: textures.emissive || "/assets/textures/ground_em.jpg",
    });

    const groundGeometry = new THREE.PlaneGeometry(size, size);

    const groundMaterial = new THREE.MeshStandardMaterial({
      map: groundTextures.base,
      emissiveMap: groundTextures.emissive,
      emissive: new THREE.Color(colors.lightBlue), // Add some emissive color
      emissiveIntensity: 0.3, // Default emissive intensity
      transparent: false,
      opacity: 1.0,
      roughness: 1.0,
      metalness: 0.0,
    });

    if (groundTextures.base) {
      groundTextures.base.wrapS = THREE.RepeatWrapping;
      groundTextures.base.wrapT = THREE.RepeatWrapping;
      groundTextures.base.repeat.set(textureRepeat, textureRepeat);
    }

    if (groundTextures.emissive) {
      groundTextures.emissive.wrapS = THREE.RepeatWrapping;
      groundTextures.emissive.wrapT = THREE.RepeatWrapping;
      groundTextures.emissive.repeat.set(textureRepeat, textureRepeat);
    }

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.set(position.x, position.y, position.z);
    ground.receiveShadow = true;

    // Use scale from model definition
    const scale = groundDef.defaultScale || { x: 30, y: 30, z: 30 };
    ground.scale.set(scale.x, scale.y, scale.z);
    ground.name = groundDef.name;

    // Set exclusion flag for post-processing effects
    (ground as any).excludeFromEffects = groundDef.excludeFromEffects ?? false;

    scene.add(ground);

    console.log(
      `${groundDef.name} added to scene (excluded from effects: ${groundDef.excludeFromEffects})`
    );
    return ground;
  } catch (error) {
    console.warn("Failed to load ground textures:", error);

    // Fallback ground without textures
    const groundGeometry = new THREE.PlaneGeometry(size, size);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: fallbackColor,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(position.x, position.y, position.z);
    ground.receiveShadow = true;
    ground.name = groundDef.name;

    // Set exclusion flag for post-processing effects
    (ground as any).excludeFromEffects = groundDef.excludeFromEffects ?? false;

    scene.add(ground);

    console.log(
      `Fallback ${groundDef.name} added to scene (excluded from effects: ${groundDef.excludeFromEffects})`
    );
    return ground;
  }
};
