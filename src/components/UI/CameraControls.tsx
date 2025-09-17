interface CameraControlsProps {
  onMapView: () => void;
  onResetView: () => void;
  onToggleFPS?: () => void;
  isFPS?: boolean;
}

export default function CameraControls({
  onMapView,
  onResetView,
  onToggleFPS,
  isFPS = false,
}: CameraControlsProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
        display: "flex",
        gap: "10px",
      }}
    >
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: isFPS ? "#2d6cdf" : "#555",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={onToggleFPS}
        title="Press 'F' key or click to toggle first-person mode"
      >
        {isFPS ? "🎮 FPS" : "🧭 Orbit"}
      </button>

      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={onMapView}
        title="Press 'M' key or click to switch to city map view"
      >
        📍
      </button>

      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={onResetView}
        title="Press 'R' key or click to reset to initial camera view"
      >
        🏠
      </button>
    </div>
  );
}
