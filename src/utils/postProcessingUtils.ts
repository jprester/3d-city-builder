import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import type { EffectConfiguration } from "./effectsConfig.js";
import { enhanceWindowMaterials, DEFAULT_WINDOW_CONFIG } from "./windowLightingUtils.js";

export interface CyberpunkEffectOptions {
  bloom?: {
    strength: number;
    radius: number;
    threshold: number;
  };
  film?: {
    intensity: number;
    grayscale: boolean;
  };
  glitch?: {
    enabled: boolean;
    intensity: number;
  };
}

export class PostProcessingManager {
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass | null = null;
  private filmPass: FilmPass | null = null;
  private glitchPass: GlitchPass | null = null;
  private enabled: boolean;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    config: EffectConfiguration
  ) {
    this.enabled = config.postProcessing.enabled;
    // Create effect composer
    this.composer = new EffectComposer(renderer);

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    if (this.enabled) {
      // Add bloom pass
      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        config.postProcessing.bloom.strength,
        config.postProcessing.bloom.radius,
        config.postProcessing.bloom.threshold
      );
      this.composer.addPass(this.bloomPass);

      // Add film grain
      this.filmPass = new FilmPass(
        config.postProcessing.film.intensity,
        config.postProcessing.film.grayscale
      );
      this.composer.addPass(this.filmPass);

      // Add glitch effect if enabled
      if (config.postProcessing.glitch.enabled) {
        this.glitchPass = new GlitchPass();
        this.glitchPass.enabled = true;
        this.composer.addPass(this.glitchPass);
      }
    }

    // Add output pass for proper color space
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ): void {
    if (this.enabled) {
      this.composer.render();
    } else {
      // Fallback to normal rendering when effects are disabled
      renderer.render(scene, camera);
    }
  }

  updateBloom(strength: number, radius: number, threshold: number): void {
    if (this.bloomPass) {
      this.bloomPass.strength = strength;
      this.bloomPass.radius = radius;
      this.bloomPass.threshold = threshold;
    }
  }

  updateFilm(intensity: number, grayscale: boolean): void {
    if (this.filmPass) {
      const uniforms = this.filmPass.uniforms as {
        intensity: { value: number };
        grayscale: { value: boolean };
      };
      uniforms.intensity.value = intensity;
      uniforms.grayscale.value = grayscale;
    }
  }

  toggleGlitch(enabled: boolean): void {
    if (this.glitchPass) {
      this.glitchPass.enabled = enabled;
    }
  }

  onWindowResize(): void {
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose(): void {
    this.composer.dispose();
  }
}

/**
 * Creates and configures post-processing effects based on configuration
 */
export const setupPostProcessing = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  config: EffectConfiguration
): PostProcessingManager => {
  return new PostProcessingManager(renderer, scene, camera, config);
};

// Keep the old function for backward compatibility
export const setupCyberpunkPostProcessing = setupPostProcessing;

/**
 * Enhances materials for better bloom interaction with focus on window lights
 */
export const enhanceMaterialsForBloom = (scene: THREE.Scene): void => {
  // Use the more sophisticated window lighting utility
  enhanceWindowMaterials(scene, DEFAULT_WINDOW_CONFIG);
};
