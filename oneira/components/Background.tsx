import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Top Left Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      
      {/* Bottom Right Glow */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cosmic-purple/10 rounded-full blur-[120px]" />
      
      {/* Center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-40" />

      {/* Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
    </div>
  );
};
