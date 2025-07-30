import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface CameraState {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  timestamp: number;
}

const CAMERA_STATE_KEY = "three-city-builder-camera-state";
const STATE_EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours

export const saveCameraState = (camera: THREE.Camera, controls: OrbitControls): void => {
  try {
    const state: CameraState = {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      target: {
        x: controls.target.x,
        y: controls.target.y,
        z: controls.target.z,
      },
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CAMERA_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save camera state:", error);
  }
};

export const loadCameraState = (): CameraState | null => {
  try {
    const savedState = localStorage.getItem(CAMERA_STATE_KEY);
    if (!savedState) return null;
    
    const state: CameraState = JSON.parse(savedState);
    
    // Check if state is expired
    if (Date.now() - state.timestamp > STATE_EXPIRY_MS) {
      localStorage.removeItem(CAMERA_STATE_KEY);
      return null;
    }
    
    return state;
  } catch (error) {
    console.warn("Failed to load camera state:", error);
    localStorage.removeItem(CAMERA_STATE_KEY);
    return null;
  }
};

export const applyCameraState = (
  camera: THREE.Camera, 
  controls: OrbitControls, 
  state: CameraState
): void => {
  camera.position.set(state.position.x, state.position.y, state.position.z);
  controls.target.set(state.target.x, state.target.y, state.target.z);
  controls.update();
};

export const clearCameraState = (): void => {
  try {
    localStorage.removeItem(CAMERA_STATE_KEY);
  } catch (error) {
    console.warn("Failed to clear camera state:", error);
  }
};