import { useEffect, useRef, useState } from "react";
import { initThreeScene } from "./threeScene";
import { getMemoryInfo } from "./utils/helperFunctions";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [logging, setLogging] = useState(false);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const rendererRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let cleanupFn: (() => void) | null = null;

    // Initialize Three.js scene and get cleanup function and renderer
    const scenePromise = initThreeScene(canvasRef.current);
    scenePromise.then(({ cleanup, renderer }) => {
      rendererRef.current = renderer;
      cleanupFn = cleanup;
    });

    // Clean up Three.js on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cleanupFn) cleanupFn();
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
      <div
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      />
      <button
        style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
        onClick={() => setLogging((v) => !v)}>
        {logging ? "Stop Memory Logging" : "Start Memory Logging"}
      </button>

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
