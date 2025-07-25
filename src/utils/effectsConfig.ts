import { colors } from "./colors.js";

export type EffectMode = "none" | "light" | "heavy";

export interface EffectConfiguration {
  mode: EffectMode;
  postProcessing: {
    enabled: boolean;
    bloom: {
      strength: number;
      radius: number;
      threshold: number;
    };
    film: {
      intensity: number;
      grayscale: boolean;
    };
    glitch: {
      enabled: boolean;
      intensity: number;
    };
  };
  lighting: {
    colorfulLights: boolean;
    animatedIntensity: boolean;
    lightCount: number;
    baseIntensity: number;
    animationAmplitude: number;
    ambientIntensity: number;
  };
  renderer: {
    toneMappingExposure: number;
  };
  fog: {
    enabled: boolean;
    color: number;
    near: number;
    far: number;
  };
}

export const EFFECT_CONFIGURATIONS: Record<EffectMode, EffectConfiguration> = {
  none: {
    mode: "none",
    postProcessing: {
      enabled: false,
      bloom: {
        strength: 0,
        radius: 0,
        threshold: 1,
      },
      film: {
        intensity: 0,
        grayscale: false,
      },
      glitch: {
        enabled: false,
        intensity: 0,
      },
    },
    lighting: {
      colorfulLights: true,
      animatedIntensity: false,
      lightCount: 1,
      baseIntensity: 200,
      animationAmplitude: 0,
      ambientIntensity: 0.3,
    },
    renderer: {
      toneMappingExposure: 1.0,
    },
    fog: {
      enabled: false,
      color: colors.almostBlackBlue,
      near: 1,
      far: 1000,
    },
  },
  light: {
    mode: "light",
    postProcessing: {
      enabled: true,
      bloom: {
        strength: 0.4,
        radius: 0.6,
        threshold: 0.2,
      },
      film: {
        intensity: 0.05,
        grayscale: false,
      },
      glitch: {
        enabled: false,
        intensity: 0,
      },
    },
    lighting: {
      colorfulLights: true,
      animatedIntensity: false,
      lightCount: 5,
      baseIntensity: 450, // Reduced from 400
      animationAmplitude: 0,
      ambientIntensity: 0.3, // Reduced from 0.15
    },
    renderer: {
      toneMappingExposure: 1.3,
    },
    fog: {
      enabled: true,
      color: colors.veryDarkBlue,
      near: 40,
      far: 250,
    },
  },
  heavy: {
    mode: "heavy",
    postProcessing: {
      enabled: true,
      bloom: {
        strength: 1.0,
        radius: 0.9,
        threshold: 0.1,
      },
      film: {
        intensity: 0.15,
        grayscale: false,
      },
      glitch: {
        enabled: false,
        intensity: 0.02,
      },
    },
    lighting: {
      colorfulLights: true,
      animatedIntensity: true,
      lightCount: 5,
      baseIntensity: 300, // Reduced from 200
      animationAmplitude: 30, // Reduced from 50
      ambientIntensity: 0.03, // Reduced from 0.1
    },
    renderer: {
      toneMappingExposure: 1.4,
    },
    fog: {
      enabled: true,
      color: colors.almostBlackBlue,
      near: 20,
      far: 200,
    },
  },
};

export const getEffectConfiguration = (
  mode: EffectMode
): EffectConfiguration => {
  return EFFECT_CONFIGURATIONS[mode];
};

export const DEFAULT_EFFECT_MODE: EffectMode = "light";
