# Effects Exclusion System Guide

This system allows you to exclude specific models or instances from post-processing effects, ensuring that elements like ground planes, UI elements, or other special objects remain unaffected by emissive lighting and bloom effects.

## 🚫 **How to Exclude Models from Effects**

### **Method 1: Model Definition Level** (All instances excluded)

```typescript
// In ModelDefinitions.ts
GROUND_PLANE: {
  id: "GROUND_PLANE",
  name: "Ground Plane",
  // ... other properties
  excludeFromEffects: true, // Exclude all instances of this model
}
```

### **Method 2: Instance Level** (Specific instance excluded)

```typescript
// In collections
{
  instanceId: "my-special-building",
  modelType: MODEL_TYPES.GLASS_CUBE,
  position: { x: 0, y: 0, z: 0 },
  excludeFromEffects: true, // Exclude only this instance
}
```

## 🏗️ **What Gets Excluded**

When a model is marked with `excludeFromEffects: true`:

1. **Emissive Configuration**: Model won't receive emissive properties
2. **Window Lighting Enhancement**: Automatic window detection is skipped
3. **Bloom Effects**: Materials won't be enhanced for bloom interaction
4. **Material Modifications**: Original materials remain untouched

## 📋 **Current Exclusions**

### **Ground Plane** (Already Configured)
```typescript
GROUND_PLANE: {
  // ... properties
  excludeFromEffects: true, // ✅ Excluded by default
}
```

**Ground plane now has:**
- No emissive properties (`emissive: 0x000000`, `emissiveIntensity: 0`)
- No reflections (`roughness: 1.0`, `metalness: 0.0`)
- Full opacity (`opacity: 1.0`, `transparent: false`)
- Will be skipped by all post-processing enhancement systems

## 🎯 **Use Cases**

### **Environment Elements**
```typescript
// Static environment objects that shouldn't glow
GROUND_PLANE: { excludeFromEffects: true },
WATER_PLANE: { excludeFromEffects: true },
SKYBOX: { excludeFromEffects: true },
```

### **UI Elements** 
```typescript
// If you add 3D UI elements to the scene
{
  instanceId: "ui-panel",
  modelType: MODEL_TYPES.UI_PANEL,
  excludeFromEffects: true, // Keep UI clean and unaffected
}
```

### **Special Buildings**
```typescript
// Buildings that should remain natural/non-futuristic
{
  instanceId: "historic-building",
  modelType: MODEL_TYPES.CATHEDRAL,
  excludeFromEffects: true, // No cyberpunk effects
}
```

### **Performance-Critical Objects**
```typescript
// Objects where you want to skip processing for performance
{
  instanceId: "background-detail",
  modelType: MODEL_TYPES.DISTANT_BUILDING,
  excludeFromEffects: true, // Skip expensive material processing
}
```

## 🔧 **Technical Implementation**

### **How It Works**
1. Flag is stored on the 3D object: `(object as any).excludeFromEffects = true`
2. All enhancement functions check this flag before processing
3. Objects with the flag are completely skipped during:
   - `enhanceWindowMaterials()`
   - `applyEmissiveToObject()`
   - Any future post-processing enhancements

### **Console Output**
You'll see confirmation in the console:
```
Ground Plane added to scene (excluded from effects: true)
Excluded Glass_Cube_special-instance from effects
```

## 🎨 **Ground Plane Specific**

The ground plane now has these fixed properties:
```typescript
{
  emissive: new THREE.Color(0x000000),    // Pure black (no glow)
  emissiveIntensity: 0,                   // Zero intensity
  transparent: false,                     // Fully opaque
  opacity: 1.0,                          // Full opacity
  roughness: 1.0,                        // Completely matte
  metalness: 0.0,                        // Not metallic
}
```

This ensures the ground plane:
- ❌ Won't have any glow or emissive effects
- ❌ Won't have reflections or metallic appearance  
- ❌ Won't be affected by bloom post-processing
- ✅ Will appear as a normal, matte textured surface

## 🔍 **Debugging**

To check if exclusion is working:
1. Look for console messages about exclusion
2. Verify objects don't have bloom/glow effects
3. Check that materials remain at their original values

---

This system gives you precise control over which elements participate in the lighting effects system while keeping others completely natural!