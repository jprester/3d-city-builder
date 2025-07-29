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

// Helper function to create canvas-based text texture
const createTextTexture = (
  text: string,
  options?: {
    fontSize?: number;
    fontFamily?: string;
    textColor?: string;
    backgroundColor?: string;
    padding?: number;
  }
) => {
  const {
    fontSize = 64,
    fontFamily = "Arial, sans-serif",
    textColor = "#ffffff",
    backgroundColor = "transparent",
    padding = 20,
  } = options || {};

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  // Set font and measure text
  context.font = `${fontSize}px ${fontFamily}`;
  const textMetrics = context.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;

  // Set canvas size with padding
  canvas.width = textWidth + padding * 2;
  canvas.height = textHeight + padding * 2;

  // Clear and set background
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundColor !== "transparent") {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw text
  context.font = `${fontSize}px ${fontFamily}`;
  context.fillStyle = textColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export const createGroundTiles = (
  scene: THREE.Scene,
  tiles: {
    name: string; // Unique name for the tile
    size?: { width: number; depth: number };
    position?: { x: number; y: number; z: number };
    color?: number;
    emissive?: number;
    emissiveIntensity?: number;
    showLabel?: boolean; // Whether to show text label
    labelOptions?: {
      fontSize?: number;
      textColor?: string;
      backgroundColor?: string;
      height?: number; // Height above ground
    };
  }[],
  isHidden?: boolean
) => {
  const createdMeshes: THREE.Mesh[] = [];
  tiles.forEach((options) => {
    const {
      name,
      size = { width: 250, depth: 250 },
      position = { x: 0, y: 0, z: 0 },
      color = colors.darkGrey,
      emissive = colors.lightBlue,
      emissiveIntensity = 0.3,
      showLabel = true,
      labelOptions = {},
    } = options;

    if (!name) {
      console.warn(
        "A ground tile was created without a name. It will be inaccessible by name."
      );
    }

    const groundGeometry = new THREE.PlaneGeometry(size.width, size.depth);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: new THREE.Color(emissive),
      emissiveIntensity: emissiveIntensity,
      roughness: 0.5,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
    groundMesh.position.set(position.x, position.y, position.z);
    groundMesh.name = name; // Assign the unique name
    groundMesh.userData.isGroundTile = true; // Mark as a ground tile

    // Add text label if requested
    if (showLabel && name) {
      const {
        fontSize = 48,
        textColor = "#ffffff",
        backgroundColor = "rgba(0, 0, 0, 0.7)",
        height = 2,
      } = labelOptions;

      const textTexture = createTextTexture(name, {
        fontSize,
        textColor,
        backgroundColor,
        padding: 16,
      });

      if (textTexture) {
        // Create text plane - made larger to accommodate bigger text
        const textGeometry = new THREE.PlaneGeometry(120, 30); // Increased from 40x10 to 120x30
        const textMaterial = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          alphaTest: 0.1,
          side: THREE.DoubleSide,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position text above the tile
        textMesh.position.set(position.x, position.y + height, position.z);
        textMesh.rotation.x = -Math.PI / 2; // Make it horizontal like the ground
        textMesh.name = `${name}-label`;
        textMesh.userData.isTileLabel = true;

        // If the tile is hidden, hide the label too
        if (isHidden) {
          textMesh.visible = false;
        }

        scene.add(textMesh);
      }
    }

    // hide the tile if specified
    if (isHidden) {
      groundMesh.visible = false;
    }

    scene.add(groundMesh);
    createdMeshes.push(groundMesh);
  });
  return createdMeshes;
};

export const getAllGroundTiles = (scene: THREE.Scene) => {
  return scene.children.filter(
    (obj) => obj.userData.isGroundTile
  ) as THREE.Mesh[];
};

export const getGroundTileByName = (scene: THREE.Scene, name: string) => {
  return scene.getObjectByName(name) as THREE.Mesh | undefined;
};

export const getAllTileLabels = (scene: THREE.Scene) => {
  return scene.children.filter(
    (obj) => obj.userData.isTileLabel
  ) as THREE.Mesh[];
};

export const getTileLabelByName = (scene: THREE.Scene, tileName: string) => {
  return scene.getObjectByName(`${tileName}-label`) as THREE.Mesh | undefined;
};

export const toggleTileLabels = (scene: THREE.Scene, visible: boolean) => {
  const labels = getAllTileLabels(scene);
  labels.forEach((label) => {
    label.visible = visible;
  });
};
