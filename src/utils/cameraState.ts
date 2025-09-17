import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface CameraState {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  timestamp: number;
}

const CAMERA_STATE_KEY = "three-city-builder-camera-state";
const STATE_EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours

export const saveCameraState = (
  camera: THREE.Camera,
  controls: OrbitControls
): void => {
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

// Save state when we don't have OrbitControls (e.g., FPS mode) by supplying a target vector directly
export const saveCameraStateWithTarget = (
  camera: THREE.Camera,
  target: THREE.Vector3
): void => {
  try {
    const state: CameraState = {
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      target: { x: target.x, y: target.y, z: target.z },
      timestamp: Date.now(),
    };
    localStorage.setItem(CAMERA_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save camera state (with target):", error);
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

// Apply camera state without OrbitControls (e.g., FPS mode)
export const applyCameraStateToCamera = (
  camera: THREE.Camera,
  state: CameraState
): void => {
  camera.position.set(state.position.x, state.position.y, state.position.z);
  // Also orient the camera to look at the saved target
  const lookTarget = new THREE.Vector3(
    state.target.x,
    state.target.y,
    state.target.z
  );
  camera.lookAt(lookTarget);
};

export const clearCameraState = (): void => {
  try {
    localStorage.removeItem(CAMERA_STATE_KEY);
  } catch (error) {
    console.warn("Failed to clear camera state:", error);
  }
};
