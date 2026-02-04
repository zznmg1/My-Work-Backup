import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  // Hide nav on Result view to focus user on the fortune
  if (currentView === ViewState.RESULT || currentView === ViewState.LOADING) return null;

  return (
    <div className="absolute bottom-6 left-0 w-full px-6 flex justify-center z-50 pointer-events-none">
      <nav className="glass-panel pointer-events-auto rounded-full px-2 py-2 flex items-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        
        {/* Splash / Home Button */}
        <button 
          onClick={() => setView(ViewState.SPLASH)}
          className={`flex items-center justify-center size-12 rounded-full transition-all duration-300 ${currentView === ViewState.SPLASH ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,132,0.4)]' : 'text-accent-pink hover:text-white hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-[24px]">water_drop</span>
        </button>
        
        <div className="w-px h-6 bg-white/10 mx-2"></div>

        {/* Selection / Cards Button */}
        <button 
          onClick={() => setView(ViewState.SELECTION)}
          className={`flex items-center justify-center size-12 rounded-full transition-all duration-300 ${currentView === ViewState.SELECTION || currentView === ViewState.INPUT_DREAM ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,132,0.4)]' : 'text-accent-pink hover:text-white hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>style</span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-2"></div>

        {/* History / Grid Button */}
        <button 
          onClick={() => setView(ViewState.HISTORY)}
          className={`flex items-center justify-center size-12 rounded-full transition-all duration-300 ${currentView === ViewState.HISTORY ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,132,0.4)]' : 'text-accent-pink hover:text-white hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-[24px]">grid_view</span>
        </button>
      </nav>
    </div>
  );
};
