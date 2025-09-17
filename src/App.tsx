/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import ThreeScene, { ThreeSceneRef } from "./components/ThreeScene";
import Stats from "./components/UI/Stats";
import CameraControls from "./components/UI/CameraControls";
import "./App.css";

function App() {
  const [logging, setLogging] = useState(false);
  const rendererRef = useRef<any>(null);
  const setCityMapViewRef = useRef<(() => void) | null>(null);
  const resetCameraViewRef = useRef<(() => void) | null>(null);
  const toggleFpsRef = useRef<(() => void) | null>(null);
  const isFpsEnabledRef = useRef<(() => boolean) | null>(null);
  const threeSceneRef = useRef<ThreeSceneRef>(null);
  const [isFPS, setIsFPS] = useState(false);

  const handleSceneReady = useCallback(
    ({
      setCityMapView,
      resetCameraView,
      renderer,
      toggleFirstPerson,
      cameraRestored,
    }: {
      setCityMapView: () => void;
      resetCameraView: () => void;
      renderer: any;
      toggleFirstPerson: () => void;
      cameraRestored?: boolean;
    }) => {
      rendererRef.current = renderer;
      setCityMapViewRef.current = setCityMapView;
      resetCameraViewRef.current = resetCameraView;
      toggleFpsRef.current = () => {
        toggleFirstPerson();
        // Update UI state after toggle
        // We'll ask the ThreeScene ref (if present) for current state
        setTimeout(
          () =>
            setIsFPS(threeSceneRef.current?.isFirstPersonEnabled() ?? false),
          0
        );
      };
      isFpsEnabledRef.current = () =>
        threeSceneRef.current?.isFirstPersonEnabled() ?? false;

      if (cameraRestored) {
        console.log("✅ Camera position restored from previous session");
      }
    },
    []
  );

  useEffect(() => {
    // Keyboard shortcut handler
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "m" || event.key === "M") {
        if (setCityMapViewRef.current) {
          setCityMapViewRef.current();
        } else {
          console.log("setCityMapViewRef.current is null!");
        }
      } else if (event.key === "r" || event.key === "R") {
        if (resetCameraViewRef.current) {
          resetCameraViewRef.current();
        } else {
          console.log("resetCameraViewRef.current is null!");
        }
      } else if (event.key === "f" || event.key === "F") {
        toggleFpsRef.current?.();
      }
    };

    // Add keyboard event listener
    window.addEventListener("keydown", handleKeyPress);

    // Clean up on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleMapView = () => {
    if (setCityMapViewRef.current) {
      setCityMapViewRef.current();
    } else {
      console.log("setCityMapViewRef.current is null!");
    }
  };

  const handleResetView = () => {
    if (resetCameraViewRef.current) {
      resetCameraViewRef.current();
    } else {
      console.log("resetCameraViewRef.current is null!");
    }
  };

  const handleToggleFPS = () => {
    toggleFpsRef.current?.();
  };

  return (
    <div>
      <ThreeScene
        ref={threeSceneRef}
        onSceneReady={handleSceneReady}
        className=""
      />

      <Stats
        renderer={rendererRef.current}
        logging={logging}
        onToggleLogging={() => setLogging((v) => !v)}
      />

      <CameraControls
        onMapView={handleMapView}
        onResetView={handleResetView}
        onToggleFPS={handleToggleFPS}
        isFPS={isFPS}
      />
    </div>
  );
}

export default App;
