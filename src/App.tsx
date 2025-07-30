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
  const threeSceneRef = useRef<ThreeSceneRef>(null);

  const handleSceneReady = useCallback(({
    setCityMapView,
    resetCameraView,
    renderer,
    cameraRestored,
  }: {
    setCityMapView: () => void;
    resetCameraView: () => void;
    renderer: any;
    cameraRestored?: boolean;
  }) => {
    rendererRef.current = renderer;
    setCityMapViewRef.current = setCityMapView;
    resetCameraViewRef.current = resetCameraView;
    
    if (cameraRestored) {
      console.log("✅ Camera position restored from previous session");
    }
  }, []);

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
      />
    </div>
  );
}

export default App;
