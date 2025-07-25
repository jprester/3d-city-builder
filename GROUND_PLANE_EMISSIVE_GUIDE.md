# Ground Plane Emissive Configuration Guide

The ground plane now supports the same emissive configuration system as buildings, allowing you to create glowing ground effects, simulate street lighting, or add atmospheric lighting to your scene.

## 🛠️ **How to Configure Ground Plane Emissive**

### **Method 1: In Model Definition** (Global Default)

Edit the `GROUND_PLANE` definition in `ModelDefinitions.ts:407-412`:

```typescript
GROUND_PLANE: {
  // ... other properties
  emissiveConfig: {
    color: 0x221100,      // Dark orange glow
    intensity: 0.1,       // Very subtle
    opacity: 1.0,         // Fully opaque
    roughness: 0.8,       // Surface roughness
    metalness: 0.0,       // Non-metallic
  },
}
```

### **Method 2: Override in Scene Creation** (Recommended)

Update the `createGroundPlane` call in `threeScene.ts:66-74`:

```typescript
await createGroundPlane(scene, assetManager, {
  emissiveConfig: {
    color: 0x221100,      // Custom color
    intensity: 0.1,       // Custom intensity
    opacity: 1.0,         // Opacity
    roughness: 0.8,       // Surface properties
    metalness: 0.0,       // Surface properties
  }
});
```

## 🎨 **Ground Plane Emissive Examples**

### **Subtle Street Lighting Effect**
```typescript
emissiveConfig: {
  color: 0x442200,      // Warm amber street light
  intensity: 0.05,      // Very subtle
  opacity: 1.0,
}
```

### **Cyberpunk Neon Ground**
```typescript
emissiveConfig: {
  color: 0x00ff88,      // Bright cyan-green
  intensity: 0.3,       // More noticeable
  opacity: 0.9,
  roughness: 0.2,       // Smoother surface
  metalness: 0.1,       // Slightly reflective
}
```

### **Volcanic/Lava Ground**
```typescript
emissiveConfig: {
  color: 0xff2200,      // Hot orange-red
  intensity: 0.4,       // Bright glow
  opacity: 1.0,
  roughness: 0.9,       // Very rough surface
}
```

### **Disable Ground Emissive**
```typescript
emissiveConfig: {
  color: 0x000000,      // No color
  intensity: 0,         // No intensity
}
```

## 🔧 **Technical Details**

### **Color Handling**
- Ground plane uses **first color** from array (if array provided)
- Single colors are used directly: `color: 0xff0000`
- Arrays use first element: `color: [0xff0000, 0x00ff00]` → uses red

### **Intensity Guidelines**
- `0` = No emissive effect
- `0.05-0.1` = Very subtle atmospheric glow
- `0.2-0.3` = Noticeable lighting effect
- `0.4+` = Strong dramatic effect

### **Surface Properties**
- `roughness: 0.0-1.0` (0 = mirror smooth, 1 = very rough)
- `metalness: 0.0-1.0` (0 = non-metallic, 1 = fully metallic)
- `opacity: 0.0-1.0` (0 = transparent, 1 = opaque)

## 📋 **Complete Implementation**

Here's the updated ground plane creation with all options:

```typescript
await createGroundPlane(scene, assetManager, {
  size: 100,                      // Ground plane size
  position: { x: 0, y: -0.5, z: 0 }, // Position
  textureRepeat: 10,              // Texture tiling
  fallbackColor: 0x333333,       // Fallback if textures fail
  emissiveConfig: {
    color: 0x221100,              // Emissive color
    intensity: 0.1,               // Emissive intensity
    opacity: 1.0,                 // Material opacity
    roughness: 0.8,               // Surface roughness
    metalness: 0.0,               // Metallic property
  }
});
```

## 🎯 **Best Practices**

1. **Keep intensity low** (0.05-0.2) for realistic effects
2. **Match scene atmosphere** - warm colors for cozy scenes, cool for futuristic
3. **Use with bloom effects** - emissive ground works great with post-processing
4. **Consider texture interaction** - emissive works with existing ground textures
5. **Test different effect modes** - ground emissive looks different in none/light/heavy modes

## 🔍 **Debugging**

The console will show ground plane creation with emissive values:
```
Ground Plane added to scene with emissive: 221100, intensity: 0.1
```

You can verify the configuration is working by checking this console output.

---

This system allows you to create atmospheric ground lighting that complements your building lighting system for a cohesive scene atmosphere!