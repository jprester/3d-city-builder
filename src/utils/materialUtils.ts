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
  anisotropy?: number; // increase texture sampling quality at grazing angles
  crispEmissive?: boolean; // make emissive map avoid mip blurring
}

export const harmonizePBR = (
  root: THREE.Object3D,
  options: HarmonizeOptions = {
    aoMapIntensity: 0.35,
    clearBaseColor: true,
    setSRGB: true,
    anisotropy: 12,
    crispEmissive: false,
  }
): void => {
  const {
    aoMapIntensity = 0.35,
    clearBaseColor = true,
    setSRGB = true,
    anisotropy = 12,
    crispEmissive = false,
  } = options;
  type IndexableMaterial = THREE.Material & { [key: string]: unknown };

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material)
        ? (mesh.material as THREE.Material[])
        : [mesh.material as THREE.Material];

      for (const m of materials) {
        const mat = m as IndexableMaterial;

        if (
          Object.prototype.hasOwnProperty.call(mat, "aoMapIntensity") &&
          typeof (mat as IndexableMaterial)["aoMapIntensity"] === "number"
        ) {
          (mat as IndexableMaterial)["aoMapIntensity"] =
            aoMapIntensity as unknown as number;
        }

        if (clearBaseColor) {
          const colorProp = (mat as IndexableMaterial)["color"];
          if (colorProp instanceof THREE.Color) {
            colorProp.set(0xffffff);
          }
        }

        // Helper to update texture sampling
        const getTex = (prop: string): THREE.Texture | undefined => {
          const val = mat[prop];
          return val instanceof THREE.Texture ? val : undefined;
        };

        const setTex = (prop: string, tex: THREE.Texture) => {
          (mat as IndexableMaterial)[prop] = tex;
        };

        const tuneTexture = (
          prop: string,
          opts?: { srgb?: boolean; crisp?: boolean }
        ) => {
          const tex = getTex(prop);
          if (!tex) return;
          if (opts?.srgb) tex.colorSpace = THREE.SRGBColorSpace;
          if (anisotropy && typeof tex.anisotropy === "number") {
            tex.anisotropy = Math.max(tex.anisotropy || 1, anisotropy);
          }
          if (opts?.crisp) {
            tex.generateMipmaps = false;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
          }
          tex.needsUpdate = true;
          setTex(prop, tex);
        };

        if (setSRGB) {
          tuneTexture("map", { srgb: true });
          tuneTexture("emissiveMap", { srgb: true, crisp: crispEmissive });
        } else {
          tuneTexture("emissiveMap", { crisp: crispEmissive });
        }

        // Improve angle sampling on all relevant maps
        tuneTexture("normalMap");
        tuneTexture("roughnessMap");
        tuneTexture("metalnessMap");
        tuneTexture("aoMap");

        mat.needsUpdate = true;
      }
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
