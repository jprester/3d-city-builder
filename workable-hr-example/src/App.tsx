import React from "react";
import ThreeScene from "./components/ThreeScene";
import Controls from "./components/UI/Controls";
import Stats from "./components/UI/Stats";

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Three.js Scene */}
      <ThreeScene className="absolute inset-0" />

      {/* UI Overlay */}
      <Controls />
      <Stats />

      {/* Bottom Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10"></div>
      </div>
    </div>
  );
}

export default App;
