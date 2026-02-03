import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      {/* Deep Space Base */}
      <div className="absolute inset-0 bg-[#050205]" />
      
      {/* Ambient Orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-50" />
      
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};