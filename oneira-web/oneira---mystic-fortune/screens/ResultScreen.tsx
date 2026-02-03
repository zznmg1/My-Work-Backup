import React from 'react';
import { Screen } from '../types';
import { Eye } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export const ResultScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-dark text-white animate-fade-in">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 mix-blend-overlay" 
        style={{backgroundImage: "url('https://picsum.photos/1080/1920?grayscale&blur=2')"}} 
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a0b12] via-[#230f19]/90 to-black" />

      {/* Content Container */}
      <div className="relative z-10 flex w-full max-w-[600px] flex-col items-center justify-center p-6 text-center">
        
        {/* Mystical Icon */}
        <div className="group relative mb-12 flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary blur-[80px] opacity-40 duration-3000" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,132,0.2)]">
            <Eye className="w-16 h-16 text-primary/90 drop-shadow-[0_0_10px_rgba(255,0,132,0.8)]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="mb-10 flex flex-col items-center gap-2">
          <h2 className="text-sm font-bold tracking-[0.2em] text-white/60 uppercase">The Stars Align</h2>
          <h1 className="font-serif text-5xl font-normal tracking-wider text-white drop-shadow-xl sm:text-6xl">
            LEGENDARY
          </h1>
        </div>

        {/* Interpretation Body */}
        <div className="mb-14 px-4">
          <p className="text-lg font-light leading-relaxed text-white/80 antialiased max-w-md mx-auto">
            Your path today is illuminated by rare cosmic fortune. Embrace the unexpected changes coming your way, for they carry the seeds of profound transformation. Use your energy wisely.
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onNavigate(Screen.HISTORY)}
          className="group relative flex min-w-[200px] items-center justify-center overflow-hidden rounded-full border border-white/30 bg-transparent px-8 py-4 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(255,0,132,0.4)] active:scale-95"
        >
          <span className="font-bold tracking-[0.15em] text-white">ACCEPT</span>
        </button>
      </div>
    </div>
  );
};