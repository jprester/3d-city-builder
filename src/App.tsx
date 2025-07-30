import { useEffect, useRef, useState } from "react";
import ThreeScene, { ThreeSceneRef } from "./components/ThreeScene";
import { getMemoryInfo } from "./utils/helperFunctions";
import "./App.css";

function App() {
  const [logging, setLogging] = useState(false);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const rendererRef = useRef<any>(null);
  const setCityMapViewRef = useRef<(() => void) | null>(null);
  const resetCameraViewRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<number | null>(null);
  const threeSceneRef = useRef<ThreeSceneRef>(null);

  const handleSceneReady = ({
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
  };

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
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Effect to handle memory logging interval
  useEffect(() => {
    if (!logging || !rendererRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    // Log immediately
    setMemoryInfo(getMemoryInfo(rendererRef.current));
    // Set up interval
    intervalRef.current = window.setInterval(() => {
      setMemoryInfo(getMemoryInfo(rendererRef.current));
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [logging]);

  return (
    <div>
      <ThreeScene
        ref={threeSceneRef}
        onSceneReady={handleSceneReady}
        className=""
      />
      <button
        style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
        onClick={() => setLogging((v) => !v)}>
        {logging ? "Stop Memory Logging" : "Start Memory Logging"}
      </button>

      {/* Camera control buttons in top right corner */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          display: "flex",
          gap: "10px",
        }}>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onClick={() => {
            if (setCityMapViewRef.current) {
              setCityMapViewRef.current();
            } else {
              console.log("setCityMapViewRef.current is null!");
            }
          }}
          title="Press 'M' key or click to switch to city map view">
          📍 Map View
        </button>

        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onClick={() => {
            if (resetCameraViewRef.current) {
              resetCameraViewRef.current();
            } else {
              console.log("resetCameraViewRef.current is null!");
            }
          }}
          title="Press 'R' key or click to reset to initial camera view">
          🏠 Reset View
        </button>
      </div>

      {logging ? (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 20,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            zIndex: 10,
            minWidth: 200,
          }}>
          <strong>Memory Info:</strong>

          <pre style={{ margin: 0, fontSize: 12 }}>
            {JSON.stringify(memoryInfo, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

export default App;
