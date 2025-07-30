import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const Stats: React.FC = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;

    const updateFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(updateFPS);
    };

    updateFPS();
  }, []);

  return (
    <div className="absolute top-6 right-6 z-10">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          Performance
        </h3>
        <div className="text-2xl font-mono text-emerald-400">
          {fps} <span className="text-sm text-gray-400">FPS</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;