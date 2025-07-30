import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { initThreeScene } from "../threeScene";

interface ThreeSceneProps {
  className?: string;
  onSceneReady?: (controls: {
    setCityMapView: () => void;
    resetCameraView: () => void;
    renderer: any;
    cameraRestored?: boolean;
  }) => void;
}

export interface ThreeSceneRef {
  setCityMapView: () => void;
  resetCameraView: () => void;
  renderer: any;
}

const ThreeScene = forwardRef<ThreeSceneRef, ThreeSceneProps>(
  ({ className = "", onSceneReady }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneControlsRef = useRef<{
      cleanup: () => void;
      renderer: any;
      setCityMapView: () => void;
      resetCameraView: () => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      setCityMapView: () => sceneControlsRef.current?.setCityMapView(),
      resetCameraView: () => sceneControlsRef.current?.resetCameraView(),
      renderer: sceneControlsRef.current?.renderer,
    }));

    useEffect(() => {
      if (!mountRef.current) return;

      let isComponentMounted = true;

      // Initialize Three.js scene
      const scenePromise = initThreeScene(mountRef.current);
      scenePromise.then((controls) => {
        if (!isComponentMounted) {
          // Component was unmounted before scene finished loading
          controls.cleanup();
          return;
        }

        sceneControlsRef.current = controls;
        
        // Notify parent component that scene is ready
        if (onSceneReady) {
          onSceneReady({
            setCityMapView: controls.setCityMapView,
            resetCameraView: controls.resetCameraView,
            renderer: controls.renderer,
            cameraRestored: controls.cameraWasRestored,
          });
        }
      }).catch((error) => {
        console.error("Failed to initialize Three.js scene:", error);
      });

      // Cleanup function
      return () => {
        isComponentMounted = false;
        if (sceneControlsRef.current) {
          sceneControlsRef.current.cleanup();
          sceneControlsRef.current = null;
        }
      };
    }, [onSceneReady]);

    return (
      <div
        ref={mountRef}
        className={className}
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      />
    );
  }
);

ThreeScene.displayName = "ThreeScene";

export default ThreeScene;