import * as THREE from "three";
import { AssetManager } from "../models/AssetManager.js";
import {
  MODEL_DEFINITIONS,
  MODEL_TYPES,
} from "../models/definitions/ModelDefinitions.js";

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
    color: options?.color || 0xff4444, // Red color for visibility
    emissive: new THREE.Color(options?.emissive || 0x220000),
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
  }
) => {
  const groundDef = MODEL_DEFINITIONS[MODEL_TYPES.GROUND_PLANE];
  const {
    size = 100,
    position = { x: 0, y: -0.5, z: 0 },
    textureRepeat = 10,
    fallbackColor = 0x333333,
  } = options || {};

  try {
    const groundTextures = await assetManager.loadTextures({
      base: groundDef.textures?.base || "/assets/textures/ground.jpg",
      emissive:
        groundDef.textures?.emissive || "/assets/textures/ground_em.jpg",
    });

    const groundGeometry = new THREE.PlaneGeometry(size, size);
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: groundTextures.base,
      emissiveMap: groundTextures.emissive,
      emissive: new THREE.Color(0x202020),
      emissiveIntensity: 1.1,
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
    scene.add(ground);

    console.log(`${groundDef.name} added to scene`);
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
    scene.add(ground);

    console.log(`Fallback ${groundDef.name} added to scene`);
    return ground;
  }
};
