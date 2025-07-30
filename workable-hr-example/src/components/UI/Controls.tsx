import React from 'react';
import { Settings, Zap, Cpu } from 'lucide-react';

const Controls: React.FC = () => {
  return (
    <div className="absolute top-6 left-6 z-10">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          Three.js Scene
        </h2>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <span>Hot Reload Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>WebGL Renderer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;