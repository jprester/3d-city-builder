import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export interface ModelTextures {
  base?: string;
  specular?: string;
  roughness?: string;
  emissive?: string;
}

export interface LoadedModel {
  model: THREE.Object3D;
  materials?: THREE.Material[];
}

export interface SkyboxOptions {
  opacity?: number;        // 0.0 to 1.0, controls transparency
  darkness?: number;       // 0.0 to 1.0, multiplies color to darken (0 = black, 1 = original)
  transparent?: boolean;   // Enable transparency blending
}

export class AssetManager {
  private loadingManager: THREE.LoadingManager;
  private textureLoader: THREE.TextureLoader;
  private gltfLoader: GLTFLoader;
  private objLoader: OBJLoader;
  private loadedTextures: Map<string, THREE.Texture> = new Map();
  private loadedModels: Map<string, LoadedModel> = new Map();

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.objLoader = new OBJLoader(this.loadingManager);
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
  }> {
    const loadedTextures: {
      base?: THREE.Texture;
      specular?: THREE.Texture;
      roughness?: THREE.Texture;
      emissive?: THREE.Texture;
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

          if (textures) {
            const loadedTextures = await this.loadTextures(textures);

            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                const material = child.material as THREE.MeshStandardMaterial;
                if (material) {
                  const newMaterial = material.clone();

                  if (loadedTextures.base) {
                    newMaterial.map = loadedTextures.base;
                  }
                  if (loadedTextures.specular) {
                    newMaterial.metalnessMap = loadedTextures.specular;
                  }
                  if (loadedTextures.roughness) {
                    newMaterial.roughnessMap = loadedTextures.roughness;
                  }
                  if (loadedTextures.emissive) {
                    newMaterial.emissiveMap = loadedTextures.emissive;
                    newMaterial.emissive = new THREE.Color(0x404040);
                  }

                  newMaterial.needsUpdate = true;
                  child.material = newMaterial;
                  materials.push(newMaterial);
                }
              }
            });
          }

          const loadedModel = { model, materials };
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
                const material = new THREE.MeshStandardMaterial();

                if (loadedTextures.base) {
                  material.map = loadedTextures.base;
                }
                if (loadedTextures.specular) {
                  material.metalnessMap = loadedTextures.specular;
                }
                if (loadedTextures.roughness) {
                  material.roughnessMap = loadedTextures.roughness;
                }
                if (loadedTextures.emissive) {
                  material.emissiveMap = loadedTextures.emissive;
                  material.emissive = new THREE.Color(0x404040);
                }

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
                    color: 0x888888,
                  });
                  child.material = material;
                  materials.push(material);
                }
              }
            });
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

  onProgress(
    callback: (progress: { loaded: number; total: number }) => void
  ): void {
    this.loadingManager.onProgress = (_, loaded, total) => {
      this.loadedItems = loaded;
      this.totalItems = total;
      callback({ loaded, total });
    };
  }

  onLoad(callback: () => void): void {
    this.loadingManager.onLoad = callback;
  }

  onError(callback: (url: string) => void): void {
    this.loadingManager.onError = callback;
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

    // Configure texture for skybox usage
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
  }

  async createSkybox(skyTexturePath: string, options: SkyboxOptions = {}): Promise<THREE.Mesh> {
    try {
      const skyTexture = await this.loadSkyTexture(skyTexturePath);

      // Apply darkness filter if specified
      if (options.darkness !== undefined && options.darkness < 1.0) {
        const darkenValue = Math.max(0, Math.min(1, options.darkness));
        skyTexture.offset.set(0, 0);
        skyTexture.repeat.set(1, 1);
        // Create a darker version by modifying the texture's color
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx && skyTexture.image) {
          canvas.width = skyTexture.image.width || 512;
          canvas.height = skyTexture.image.height || 512;
          
          // Draw the original image
          ctx.drawImage(skyTexture.image, 0, 0);
          
          // Apply darkness overlay
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = `rgb(${Math.floor(darkenValue * 255)}, ${Math.floor(darkenValue * 255)}, ${Math.floor(darkenValue * 255)})`;
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

      // Create a large sphere geometry for the skybox
      const skyGeometry = new THREE.SphereGeometry(500, 32, 32);

      // Create material with the sky texture and options
      const materialOptions: THREE.MeshBasicMaterialParameters = {
        map: skyTexture,
        side: THREE.BackSide, // Render on the inside of the sphere
      };

      // Apply opacity and transparency settings
      if (options.opacity !== undefined) {
        materialOptions.opacity = Math.max(0, Math.min(1, options.opacity));
        materialOptions.transparent = true;
      }

      if (options.transparent) {
        materialOptions.transparent = true;
      }

      const skyMaterial = new THREE.MeshBasicMaterial(materialOptions);

      const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
      skybox.name = "skybox";

      return skybox;
    } catch (error) {
      console.error(
        `Failed to create skybox with texture: ${skyTexturePath}`,
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
