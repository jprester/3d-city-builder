import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export type FpsControls = {
  enable: () => void;
  disable: () => void;
  isEnabled: () => boolean;
  update: () => void;
  dispose: () => void;
  controls: PointerLockControls;
};

type FpsOptions = {
  moveSpeed?: number; // units per second
  sprintMultiplier?: number;
  lookSensitivity?: number; // not used directly; pointer lock uses mouse movement
  gravity?: number; // units per second^2
  jumpVelocity?: number; // units per second
  minY?: number; // ground height (simple ground collision)
};

export function createFpsControls(
  camera: THREE.Camera,
  rendererDom: HTMLElement,
  options: FpsOptions = {}
): FpsControls {
  const {
    moveSpeed = 6, // ~walking speed in m/s (scene units ~ meters)
    sprintMultiplier = 1.8,
    gravity = 30, // stronger than 9.8 for snappier game feel
    jumpVelocity = 7,
    minY = 1.65, // eye height above ground (~1.65m)
  } = options;

  const controls = new PointerLockControls(
    camera as THREE.PerspectiveCamera,
    rendererDom
  );

  // movement state
  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jumpRequested: false,
  };

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  let onGround = true;

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        move.forward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        move.left = true;
        break;
      case "ArrowDown":
      case "KeyS":
        move.backward = true;
        break;
      case "ArrowRight":
      case "KeyD":
        move.right = true;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        move.sprint = true;
        break;
      case "Space":
        move.jumpRequested = true;
        break;
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        move.forward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        move.left = false;
        break;
      case "ArrowDown":
      case "KeyS":
        move.backward = false;
        break;
      case "ArrowRight":
      case "KeyD":
        move.right = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        move.sprint = false;
        break;
    }
  };

  const onClickToLock = () => {
    if (!controls.isLocked) controls.lock();
  };

  const addListeners = () => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    rendererDom.addEventListener("click", onClickToLock);
  };
  const removeListeners = () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    rendererDom.removeEventListener("click", onClickToLock);
  };

  let lastTime = performance.now();
  const api: FpsControls = {
    enable: () => {
      addListeners();
      // Snap to eye height when entering FPS mode
      const obj = controls.getObject();
      obj.position.y = minY;
      velocity.set(0, 0, 0);
      onGround = true;
    },
    disable: () => {
      removeListeners();
      if (controls.isLocked) controls.unlock();
      // reset velocity to prevent drift when re-enabling
      velocity.set(0, 0, 0);
    },
    isEnabled: () => controls.isLocked,
    update: () => {
      // compute an approximate delta using a simple timer
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      // apply gravity
      if (!onGround) {
        velocity.y -= gravity * delta;
      }

      // Desired input direction (positive values mean forward/right)
      direction.z = Number(move.forward) - Number(move.backward);
      direction.x = Number(move.right) - Number(move.left);
      direction.normalize();

      const speed = move.sprint ? moveSpeed * sprintMultiplier : moveSpeed;

      // Smooth horizontal velocities; no inversion: pressing left moves left, right moves right
      if (move.forward || move.backward) {
        velocity.z = THREE.MathUtils.lerp(
          velocity.z,
          direction.z * speed,
          0.15
        );
      } else {
        velocity.z = THREE.MathUtils.damp(velocity.z, 0, 10, delta);
      }
      if (move.left || move.right) {
        velocity.x = THREE.MathUtils.lerp(
          velocity.x,
          direction.x * speed,
          0.15
        );
      } else {
        velocity.x = THREE.MathUtils.damp(velocity.x, 0, 10, delta);
      }

      // jump
      const object = controls.getObject();
      if (move.jumpRequested && onGround) {
        velocity.y = jumpVelocity;
        onGround = false;
      }
      move.jumpRequested = false;

      // Move horizontally with PointerLockControls helpers (ignore camera pitch)
      controls.moveRight(velocity.x * delta);
      controls.moveForward(velocity.z * delta);
      object.position.y += velocity.y * delta;

      // simple ground collision
      if (object.position.y < minY) {
        velocity.y = 0;
        object.position.y = minY;
        onGround = true;
      }
    },
    dispose: () => {
      removeListeners();
    },
    controls,
  };

  return api;
}
