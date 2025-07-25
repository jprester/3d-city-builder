# Per-Model Emissive Lighting Configuration Guide

This system allows you to customize the emissive (glowing) properties of individual building models, giving you complete control over window lighting, neon effects, and overall atmosphere.

## 🏗️ **Quick Start**

### 1. **Model Definition Level** (applies to all instances of a model)

```typescript
// In ModelDefinitions.ts
GLASS_CUBE: {
  id: "GLASS_CUBE",
  name: "Glass Cube Building",
  filePath: "/assets/models/glassyCube.glb",
  emissiveConfig: {
    color: [0x88ddff, 0xffdd88, 0x99ccff], // Multiple colors
    intensity: 0.8,
    opacity: 0.9,
    randomizeColors: true,
  },
}
```

### 2. **Instance Level** (overrides model definition)

```typescript
// In collections
{
  instanceId: "my-custom-building",
  modelType: MODEL_TYPES.GLASS_CUBE,
  position: { x: 0, y: 0, z: 0 },
  emissiveConfig: {
    color: 0xff0080, // Single hot pink color
    intensity: 1.5,
    opacity: 0.8,
    randomizeColors: false,
  },
}
```

## 🎨 **EmissiveConfig Properties**

```typescript
interface EmissiveConfig {
  color?: number | number[];     // Single color or array of colors
  intensity?: number;            // Emissive intensity (0-3+)
  opacity?: number;              // Material opacity (0-1)
  roughness?: number;            // Surface roughness (0-1)
  metalness?: number;            // Metallic property (0-1)
  randomizeColors?: boolean;     // Randomize colors across materials
  materialFilter?: string[];     // Only affect specific materials
}
```

### **Color Examples**
```typescript
// Single color
color: 0xff0080  // Hot pink

// Multiple colors (randomly distributed)
color: [0xff0080, 0x00ff80, 0x0080ff]  // Pink, green, cyan

// Warm interior theme
color: [0xffdd88, 0xff9944, 0xffaa66]  // Warm whites and yellows

// Cyberpunk theme  
color: [0x00ffff, 0xff0080, 0x8000ff]  // Cyan, pink, purple
```

### **Intensity Levels**
```typescript
intensity: 0.3   // Subtle glow
intensity: 0.8   // Moderate lighting
intensity: 1.5   // Bright windows
intensity: 2.0+  // Intense neon effect
```

## 🏢 **Pre-configured Model Examples**

The system includes several pre-configured models:

### **GLASS_CUBE**
- Colors: Cool blue, warm white, light blue
- Intensity: 0.8 (moderate)
- Randomized colors

### **SKYSCRAPER_01** 
- Color: Bright cyan (0x00ffff)
- Intensity: 1.2 (bright)
- Low roughness for glass effect

### **SKYSCRAPER_02**
- Colors: Hot pink, purple
- Intensity: 1.5 (very bright)
- Randomized for variety

## 🛠️ **Advanced Usage**

### **Material Filtering**
Target specific materials within a model:

```typescript
emissiveConfig: {
  color: [0xffff88, 0xffcc66],
  intensity: 0.6,
  materialFilter: ["window", "glass", "light"], // Only these materials
}
```

### **Consistent vs Random Colors**
```typescript
// Random colors across materials
randomizeColors: true   // Each window gets different color

// Consistent colors  
randomizeColors: false  // All windows same color (position-based)
```

### **Glass Properties**
```typescript
emissiveConfig: {
  color: 0x88ddff,
  intensity: 1.0,
  opacity: 0.85,        // Slightly transparent
  roughness: 0.05,      // Very smooth (glass-like)
  metalness: 0.2,       // Slightly reflective
}
```

## 📋 **Complete Example Collection**

```typescript
export const myCustomCollection: ModelCollection = {
  name: "custom-lighting-demo",
  models: [
    // Warm residential building
    {
      instanceId: "cozy-home",
      modelType: MODEL_TYPES.RESIDENTIAL_01_A,
      position: { x: 0, y: 0, z: 0 },
      emissiveConfig: {
        color: [0xffdd88, 0xffaa66], // Warm yellows
        intensity: 0.6,
        opacity: 0.95,
        randomizeColors: true,
      },
    },
    
    // Cyberpunk skyscraper
    {
      instanceId: "neon-tower",
      modelType: MODEL_TYPES.SKYSCRAPER_01,
      position: { x: 50, y: 0, z: 0 },
      emissiveConfig: {
        color: [0xff0080, 0x00ff80, 0x0080ff], // Neon trio
        intensity: 2.0,
        opacity: 0.75,
        roughness: 0.02,
        metalness: 0.4,
        randomizeColors: true,
      },
    ),
    
    // Use model defaults (no override)
    {
      instanceId: "default-building",
      modelType: MODEL_TYPES.GLASS_CUBE,
      position: { x: -50, y: 0, z: 0 },
      // Will use GLASS_CUBE's built-in emissiveConfig
    },
  ],
};
```

## 🎯 **Best Practices**

1. **Start with model definitions** for consistent building types
2. **Use instance overrides** for special landmark buildings  
3. **Keep intensity under 2.0** to avoid overwhelming bloom
4. **Use material filters** when you know specific material names
5. **Test different opacity values** for realistic glass effects
6. **Combine with effect modes** (none/light/heavy) for different scenes

## 🔧 **Integration with Effect Modes**

The per-model emissive system works with the existing effect modes:

- **'none' mode**: Emissive still works, just no post-processing bloom
- **'light' mode**: Moderate bloom enhancement 
- **'heavy' mode**: Strong bloom effects amplify the emissive lighting

Change the effect mode in `threeScene.ts:36`:
```typescript
const effectMode: EffectMode = 'light'; // or 'none' or 'heavy'
```

---

This system gives you complete control over individual building lighting while maintaining the overall scene atmosphere through the effect configuration system!