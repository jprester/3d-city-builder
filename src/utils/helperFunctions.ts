import * as THREE from "three";

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
