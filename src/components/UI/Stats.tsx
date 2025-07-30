import { useEffect, useRef, useState } from "react";
import { getMemoryInfo } from "../../utils/helperFunctions";

interface StatsProps {
  renderer: any;
  logging: boolean;
  onToggleLogging: () => void;
}

export default function Stats({
  renderer,
  logging,
  onToggleLogging,
}: StatsProps) {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!logging || !renderer) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setMemoryInfo(getMemoryInfo(renderer));
    intervalRef.current = window.setInterval(() => {
      setMemoryInfo(getMemoryInfo(renderer));
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [logging, renderer]);

  return (
    <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#eee",
          color: "#333",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={onToggleLogging}>
        {logging ? "Stop Memory Logging" : "Start Memory Logging"}
      </button>

      {logging && (
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
      )}
    </div>
  );
}
