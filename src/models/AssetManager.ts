import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { colors } from "../utils/constants.js";
import { harmonizePBR } from "../utils/materialUtils.js";

export interface ModelTextures {
  base?: string;
  specular?: string;
  roughness?: string;
  emissive?: string;
  normal?: string;
}

export interface LoadedModel {
  model: THREE.Object3D;
  materials?: THREE.Material[];
}

export interface SkyTextureOptions {
  opacity?: number; // 0.0 to 1.0, controls transparency
  darkness?: number; // 0.0 to 1.0, multiplies color to darken (0 = black, 1 = original)
  transparent?: boolean; // Enable transparency blending
}

export class AssetManager {
  private loadingManager: THREE.LoadingManager;
  private textureLoader: THREE.TextureLoader;
  private gltfLoader: GLTFLoader;
  private objLoader: OBJLoader;
  private loadedTextures: Map<string, THREE.Texture> = new Map();
  private loadedModels: Map<string, LoadedModel> = new Map();

  // Material quality knobs (can be driven by effect config)
  private materialQuality: { anisotropy: number; crispEmissive: boolean } = {
    anisotropy: 8,
    crispEmissive: true,
  };

  constructor(config?: {
    materials?: { anisotropy: number; crispEmissive: boolean };
  }) {
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.objLoader = new OBJLoader(this.loadingManager);

    if (config?.materials) {
      this.materialQuality = {
        anisotropy: config.materials.anisotropy,
        crispEmissive: config.materials.crispEmissive,
      };
    }
  }

  async loadTexture(path: string): Promise<THREE.Texture> {
    if (this.loadedTextures.has(path)) {
      return this.loadedTextures.get(path)!;
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          this.loadedTextures.set(path, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Failed to load texture: ${path}`, error);
          reject(error);
        }
      );
    });
  }

  async loadTextures(textures: ModelTextures): Promise<{
    base?: THREE.Texture;
    specular?: THREE.Texture;
    roughness?: THREE.Texture;
    emissive?: THREE.Texture;
    normal?: THREE.Texture;
  }> {
    const loadedTextures: {
      base?: THREE.Texture;
      specular?: THREE.Texture;
      roughness?: THREE.Texture;
      emissive?: THREE.Texture;
      normal?: THREE.Texture;
    } = {};

    const promises = Object.entries(textures).map(async ([key, path]) => {
      if (path) {
        try {
          const texture = await this.loadTexture(path);
          loadedTextures[key as keyof ModelTextures] = texture;
        } catch (error) {
          console.warn(`Failed to load ${key} texture: ${path}`, error);
        }
      }
    });

    await Promise.all(promises);
    return loadedTextures;
  }

  async loadGLTFModel(
    path: string,
    textures?: ModelTextures
  ): Promise<LoadedModel> {
    const cacheKey = `${path}_${JSON.stringify(textures || {})}`;

    if (this.loadedModels.has(cacheKey)) {
      const cached = this.loadedModels.get(cacheKey)!;
      return {
        model: cached.model.clone(),
        materials: cached.materials,
      };
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        async (gltf) => {
          const model = gltf.scene;
          const materials: THREE.Material[] = [];

          console.log("Loaded GLTF model:", model);

          console.log("textures:", textures);

          if (textures) {
            const loadedTextures = await this.loadTextures(textures);
            // Helper: invert a grayscale texture (used for alpha maps if needed)
            const invertAlphaTexture = (
              src: THREE.Texture
            ): THREE.Texture => {
              const img = src.image as unknown;
              const hasWH = (o: unknown): o is { width: number; height: number } =>
                typeof (o as { width: unknown }).width === "number" &&
                typeof (o as { height: unknown }).height === "number";
              if (!img || !hasWH(img)) return src;
              const { width, height } = img;
              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (!ctx) return src;
              // Draw source
              (ctx as CanvasRenderingContext2D).drawImage(
                img as unknown as CanvasImageSource,
                0,
                0,
                width,
                height
              );
              const imageData = ctx.getImageData(0, 0, width, height);
              const data = imageData.data;
              // Invert luminance
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Perceived luminance
                const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                const inv = 255 - y;
                data[i] = inv;
                data[i + 1] = inv;
                data[i + 2] = inv;
                data[i + 3] = 255;
              }
              ctx.putImageData(imageData, 0, 0);
              const tex = new THREE.CanvasTexture(canvas);
              tex.flipY = false;
              tex.generateMipmaps = false;
              tex.minFilter = THREE.LinearFilter;
              tex.magFilter = THREE.LinearFilter;
              return tex;
            };

            // Default fallback textures for logo materials (optional)
            let defaultLogosAlpha: THREE.Texture | undefined;
            let defaultLogosBase: THREE.Texture | undefined;
            try {
              defaultLogosAlpha = await this.loadTexture(
                "/assets/textures/low-poly-city-buildings/logosalpha.png"
              );
            } catch {
              // optional fallback missing; ignore
            }
            try {
              defaultLogosBase = await this.loadTexture(
                "/assets/textures/low-poly-city-buildings/logos.jpeg"
              );
            } catch {
              // optional fallback missing; ignore
            }

            const shouldSkipOverride = (name: string) => {
              const n = (name || "").toLowerCase();
              return (
                // logos handled separately to enforce transparency
                n.includes("light") ||
                n.includes("roof") ||
                n.includes("led") ||
                n.includes("neon") ||
                n.includes("screen") ||
                n.includes("sign") ||
                n.includes("emissive")
              );
            };

            const isLogo = (name: string) => {
              const n = (name || "").toLowerCase();
              return n.includes("logo") || n.includes("logos");
            };

            const applyBaseMaps = (
              src: THREE.MeshStandardMaterial
            ): THREE.MeshStandardMaterial => {
              const newMat = src.clone();
              const pickTex = (
                shared: THREE.Texture,
                srcTex?: THREE.Texture | null
              ): THREE.Texture => {
                if (!srcTex) return shared;
                const sameTransform =
                  srcTex.offset.equals(new THREE.Vector2(0, 0)) &&
                  srcTex.repeat.equals(new THREE.Vector2(1, 1)) &&
                  srcTex.rotation === 0 &&
                  srcTex.wrapS === shared.wrapS &&
                  srcTex.wrapT === shared.wrapT;
                if (sameTransform) {
                  return shared; // reuse cached texture instance
                }
                const clone = shared.clone();
                clone.offset.copy(srcTex.offset);
                clone.repeat.copy(srcTex.repeat);
                const c1 = (clone as unknown as { center?: THREE.Vector2 }).center;
                const c2 = (srcTex as unknown as { center?: THREE.Vector2 }).center;
                if (c1 && c2) c1.copy(c2);
                clone.rotation = srcTex.rotation;
                clone.wrapS = srcTex.wrapS;
                clone.wrapT = srcTex.wrapT;
                clone.needsUpdate = true;
                return clone;
              };
              if (loadedTextures.base) {
                const tex = loadedTextures.base;
                tex.flipY = false;
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = this.materialQuality.anisotropy;
                newMat.map = pickTex(tex, src.map as THREE.Texture | null);
              }
              if (loadedTextures.specular) {
                const tex = loadedTextures.specular;
                tex.flipY = false;
                tex.anisotropy = this.materialQuality.anisotropy;
                newMat.metalnessMap = pickTex(
                  tex,
                  src.metalnessMap as THREE.Texture | null
                );
              }
              if (loadedTextures.roughness) {
                const tex = loadedTextures.roughness;
                tex.flipY = false;
                tex.anisotropy = this.materialQuality.anisotropy;
                newMat.roughnessMap = pickTex(
                  tex,
                  src.roughnessMap as THREE.Texture | null
                );
              }
              if (loadedTextures.normal) {
                const tex = loadedTextures.normal;
                tex.flipY = false;
                newMat.normalMap = pickTex(
                  tex,
                  src.normalMap as THREE.Texture | null
                ); // linear space
              }
              if (loadedTextures.emissive) {
                const tex = loadedTextures.emissive;
                tex.flipY = false;
                tex.colorSpace = THREE.SRGBColorSpace;
                newMat.emissiveMap = pickTex(
                  tex,
                  src.emissiveMap as THREE.Texture | null
                );
                newMat.emissive = new THREE.Color(colors.darkGrey);
              }
              newMat.needsUpdate = true;
              return newMat;
            };

            const prepareLogoMaterial = (
              src: THREE.MeshStandardMaterial
            ): THREE.MeshStandardMaterial => {
              const m = src.clone();
              // Use embedded texture but ensure alpha is respected
              const map = m.map as THREE.Texture | undefined;
              if (map) {
                map.flipY = false;
                map.colorSpace = THREE.SRGBColorSpace;
                map.generateMipmaps = false;
                map.minFilter = THREE.LinearFilter;
                map.magFilter = THREE.LinearFilter;
                map.needsUpdate = true;
              }
              // If no map present, fall back to default logos base
              if (!map && defaultLogosBase) {
                defaultLogosBase.flipY = false;
                defaultLogosBase.colorSpace = THREE.SRGBColorSpace;
                defaultLogosBase.generateMipmaps = false;
                defaultLogosBase.minFilter = THREE.LinearFilter;
                defaultLogosBase.magFilter = THREE.LinearFilter;
                m.map = defaultLogosBase;
              }
              if (m.alphaMap) {
                m.alphaMap.flipY = false;
                m.alphaMap.generateMipmaps = false;
                m.alphaMap.minFilter = THREE.LinearFilter;
                m.alphaMap.magFilter = THREE.LinearFilter;
                m.alphaMap.needsUpdate = true;
              }
              // If exporter didn't include alpha map, try default
              if (!m.alphaMap && defaultLogosAlpha) {
                // In many atlases the provided alpha is inverted (white background)
                // Create an inverted copy to ensure background is transparent.
                const inverted = invertAlphaTexture(defaultLogosAlpha);
                m.alphaMap = inverted;
                console.info("Applied inverted alpha for logo material:", src.name);
              }
              // If still no alpha (no default available or not yet loaded), fall back to additive blending
              if (!m.alphaMap) {
                m.blending = THREE.AdditiveBlending;
                m.transparent = true;
                m.depthWrite = false;
                m.alphaTest = 0.0;
                // Ensure base color doesn't dim the map
                m.color = new THREE.Color(0xffffff);
              }
              m.transparent = true;
              m.depthWrite = false;
              m.alphaTest = 0.02;
              m.side = THREE.DoubleSide;
              // Reduce z-fighting if logo is near facade
              m.polygonOffset = true;
              m.polygonOffsetFactor = -1;
              m.polygonOffsetUnits = -1;
              m.needsUpdate = true;
              return m;
            };

            model.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                if (Array.isArray(child.material)) {
                  const updated = child.material.map((m) => {
                    const srcMat = m as THREE.MeshStandardMaterial;
                    const name = srcMat?.name || "";
                    if (isLogo(name)) {
                      return prepareLogoMaterial(srcMat);
                    }
                    if (shouldSkipOverride(name)) {
                      return srcMat; // keep embedded special material
                    }
                    return applyBaseMaps(srcMat);
                  });
                  child.material = updated as unknown as THREE.Material[];
                  materials.push(...(updated as THREE.Material[]));
                } else {
                  const srcMat = child.material as THREE.MeshStandardMaterial;
                  const name = srcMat?.name || "";
                  if (isLogo(name)) {
                    const newM = prepareLogoMaterial(srcMat);
                    child.material = newM;
                    materials.push(newM);
                    return;
                  }
                  if (shouldSkipOverride(name)) {
                    // Leave as-is
                    return;
                  }
                  const newMat = applyBaseMaps(srcMat);
                  child.material = newMat;
                  materials.push(newMat);
                }
              }
            });
          }

          const loadedModel = { model, materials };
          // Harmonize GLB materials to improve sharpness and color-space consistency
          try {
            harmonizePBR(model, {
              aoMapIntensity: 0.35,
              clearBaseColor: true,
              setSRGB: true,
              anisotropy: this.materialQuality.anisotropy,
              crispEmissive: this.materialQuality.crispEmissive,
            });
          } catch (e) {
            console.warn("harmonizePBR failed on GLB model", path, e);
          }
          this.loadedModels.set(cacheKey, loadedModel);

          resolve({
            model: model.clone(),
            materials,
          });
        },
        undefined,
        (error) => {
          console.error(`Failed to load GLTF model: ${path}`, error);
          reject(error);
        }
      );
    });
  }

  async loadOBJModel(
    path: string,
    textures?: ModelTextures
  ): Promise<LoadedModel> {
    const cacheKey = `${path}_${JSON.stringify(textures || {})}`;

    if (this.loadedModels.has(cacheKey)) {
      const cached = this.loadedModels.get(cacheKey)!;
      return {
        model: cached.model.clone(),
        materials: cached.materials,
      };
    }

    return new Promise((resolve, reject) => {
      this.objLoader.load(
        path,
        async (object) => {
          const materials: THREE.Material[] = [];

          if (textures) {
            const loadedTextures = await this.loadTextures(textures);

            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                const material = new THREE.MeshPhongMaterial();

                if (loadedTextures.base) {
                  material.map = loadedTextures.base;
                  material.map.wrapS = THREE.RepeatWrapping;
                  material.map.wrapT = THREE.RepeatWrapping;
                  material.map.anisotropy = 8; // Improve texture quality
                }

                if (loadedTextures.specular) {
                  material.specular = new THREE.Color(colors.white); // Default specular color
                  material.specularMap = loadedTextures.specular;
                  material.specularMap.wrapS = THREE.RepeatWrapping;
                  material.specularMap.wrapT = THREE.RepeatWrapping;
                  material.specularMap.anisotropy = 8; // Improve texture quality
                }

                if (
                  loadedTextures.roughness &&
                  material instanceof THREE.MeshStandardMaterial
                ) {
                  material.roughnessMap = loadedTextures.roughness;
                  material.roughnessMap.wrapS = THREE.RepeatWrapping;
                  material.roughnessMap.wrapT = THREE.RepeatWrapping;
                  material.roughnessMap.anisotropy = 8; // Improve texture quality
                }

                if (loadedTextures.emissive) {
                  material.emissive = new THREE.Color(
                    "hsl(" + Math.random() * 360 + ", 100%, 95%)"
                  );
                  material.emissiveMap = loadedTextures.emissive;
                  material.emissiveMap.wrapS = THREE.RepeatWrapping;
                  material.emissiveMap.wrapT = THREE.RepeatWrapping;
                  material.emissiveMap.anisotropy = 8; // Improve texture quality
                  material.emissiveIntensity = 1.5; // Adjust as needed
                }

                material.bumpMap = loadedTextures.base ?? null; // Use base texture as bump map
                material.bumpScale = 5; // Adjust bump scale as needed

                material.needsUpdate = true;
                child.material = material;
                materials.push(material);
              }
            });
          } else {
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (!child.material) {
                  const material = new THREE.MeshStandardMaterial({
                    color: colors.grey,
                  });
                  child.material = material;
                  materials.push(material);
                }
              }
            });
          }

          // Harmonize PBR-related settings for all OBJ models so they render consistently
          try {
            harmonizePBR(object, {
              aoMapIntensity: 0.0,
              clearBaseColor: false,
              setSRGB: true,
              anisotropy: this.materialQuality.anisotropy,
              crispEmissive: this.materialQuality.crispEmissive,
            });
          } catch (e) {
            console.warn("harmonizePBR failed on OBJ model", path, e);
          }

          const loadedModel = { model: object, materials };
          this.loadedModels.set(cacheKey, loadedModel);

          resolve({
            model: object.clone(),
            materials,
          });
        },
        undefined,
        (error) => {
          console.error(`Failed to load OBJ model: ${path}`, error);
          reject(error);
        }
      );
    });
  }

  async loadModel(
    path: string,
    textures?: ModelTextures
  ): Promise<LoadedModel> {
    const extension = path.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "glb":
      case "gltf":
        return this.loadGLTFModel(path, textures);
      case "obj":
        return this.loadOBJModel(path, textures);
      default:
        throw new Error(`Unsupported model format: ${extension}`);
    }
  }

  dispose(): void {
    this.loadedTextures.forEach((texture) => {
      texture.dispose();
    });
    this.loadedTextures.clear();

    this.loadedModels.forEach(({ model, materials }) => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
        }
      });
      materials?.forEach((material) => {
        material.dispose();
      });
    });
    this.loadedModels.clear();
  }

  private loadedItems = 0;
  private totalItems = 0;

  getLoadingProgress(): { loaded: number; total: number } {
    return {
      loaded: this.loadedItems,
      total: this.totalItems,
    };
  }

  onProgress(callback: () => void): void {
    this.loadingManager.onProgress = (_, loaded, total) => {
      this.loadedItems = loaded;
      this.totalItems = total;
      callback();
    };
  }

  onLoad(callback: () => void): void {
    this.loadingManager.onLoad = callback;
  }

  onError(callback: () => void): void {
    this.loadingManager.onError = () => callback();
  }

  async preloadModels(modelPaths: string[]): Promise<void> {
    const loadPromises = modelPaths.map(async (path) => {
      try {
        await this.loadModel(path);
        console.log(`Preloaded model: ${path}`);
      } catch (error) {
        console.warn(`Failed to preload model: ${path}`, error);
      }
    });

    await Promise.allSettled(loadPromises);
  }

  async preloadTextures(texturePaths: string[]): Promise<void> {
    const loadPromises = texturePaths.map(async (path) => {
      try {
        await this.loadTexture(path);
        console.log(`Preloaded texture: ${path}`);
      } catch (error) {
        console.warn(`Failed to preload texture: ${path}`, error);
      }
    });

    await Promise.allSettled(loadPromises);
  }

  async loadSkyTexture(path: string): Promise<THREE.Texture> {
    const texture = await this.loadTexture(path);

    // Configure texture for skyTexture usage
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
  }

  async createSkyBackground(
    skyTexturePath: string,
    options: SkyTextureOptions = {}
  ): Promise<THREE.Texture> {
    try {
      const skyTexture = await this.loadSkyTexture(skyTexturePath);

      // Apply darkness filter if specified
      if (options.darkness !== undefined && options.darkness < 1.0) {
        const darkenValue = Math.max(0, Math.min(1, options.darkness));
        skyTexture.offset.set(0, 0);
        skyTexture.repeat.set(1, 1);
        // Create a darker version by modifying the texture's color
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx && skyTexture.image) {
          canvas.width = skyTexture.image.width || 512;
          canvas.height = skyTexture.image.height || 512;

          // Draw the original image
          ctx.drawImage(skyTexture.image, 0, 0);

          // Apply darkness overlay
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = `rgb(${Math.floor(darkenValue * 255)}, ${Math.floor(
            darkenValue * 255
          )}, ${Math.floor(darkenValue * 255)})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Update texture with darkened image
          const newTexture = new THREE.CanvasTexture(canvas);
          newTexture.mapping = skyTexture.mapping;
          newTexture.wrapS = skyTexture.wrapS;
          newTexture.wrapT = skyTexture.wrapT;
          skyTexture.image = canvas;
          skyTexture.needsUpdate = true;
        }
      }

      // Return the processed texture to be used as scene.background
      return skyTexture;
    } catch (error) {
      console.error(
        `Failed to create sky background with texture: ${skyTexturePath}`,
        error
      );
      throw error;
    }
  }

  getCacheStats(): { models: number; textures: number } {
    return {
      models: this.loadedModels.size,
      textures: this.loadedTextures.size,
    };
  }
}
