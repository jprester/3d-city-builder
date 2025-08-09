import * as THREE from "three";

export const setEnvMapIntensity = (
  root: THREE.Object3D,
  intensity: number = 1.2
): void => {
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && mat.envMapIntensity !== undefined) {
        mat.envMapIntensity = intensity;
        mat.needsUpdate = true;
      }
    }
  });
};

export interface HarmonizeOptions {
  aoMapIntensity?: number; // e.g., 0.2–0.5
  clearBaseColor?: boolean; // set base color to white
  setSRGB?: boolean; // enforce sRGB on color/emissive maps
}

export const harmonizePBR = (
  root: THREE.Object3D,
  options: HarmonizeOptions = {
    aoMapIntensity: 0.35,
    clearBaseColor: true,
    setSRGB: true,
  }
): void => {
  const { aoMapIntensity = 0.35, clearBaseColor = true, setSRGB = true } =
    options;
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat.aoMap) {
        mat.aoMapIntensity = aoMapIntensity;
      }
      if (clearBaseColor && mat.color) {
        mat.color.set(0xffffff);
      }
      if (setSRGB) {
        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      }
      mat.needsUpdate = true;
    }
  });
};

export const logMaterialMaps = (root: THREE.Object3D, label?: string): void => {
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
      const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      console.log(
        `Material maps${label ? ` [${label}]` : ""} for ${child.name}`,
        {
          map: !!m.map,
          normalMap: !!m.normalMap,
          metalnessMap: !!m.metalnessMap,
          roughnessMap: !!m.roughnessMap,
          emissiveMap: !!m.emissiveMap,
          aoMap: !!m.aoMap,
          aoMapIntensity: m.aoMapIntensity,
          color: m.color?.getHexString?.(),
          emissive: m.emissive?.getHexString?.(),
        }
      );
    }
  });
};
