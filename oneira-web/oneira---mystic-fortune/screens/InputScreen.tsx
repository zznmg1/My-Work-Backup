import React, { useState } from 'react';
import { Screen } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export const InputScreen: React.FC<Props> = ({ onNavigate }) => {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col h-screen max-w-[600px] mx-auto bg-background-dark/80 backdrop-blur-sm border-x border-white/5 shadow-2xl relative">
      {/* Header */}
      <header className="flex px-6 py-6 justify-start shrink-0">
        <button 
          onClick={() => onNavigate(Screen.SELECTION)}
          className="group flex items-center justify-center rounded-full h-10 pr-4 pl-3 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white gap-2 text-sm font-bold tracking-wide transition-all"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>RETURN</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-8 overflow-y-auto">
        <div className="pt-4 pb-6">
          <h2 className="font-serif text-white tracking-wide text-3xl md:text-[32px] font-normal leading-tight text-left text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
            Tell us your dream...
          </h2>
        </div>

        <div className="flex-1 flex flex-col pb-[120px]">
          <label className="flex flex-col flex-1 h-full relative group">
            <textarea 
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-textarea flex w-full h-full min-h-[300px] bg-transparent border-none focus:ring-0 p-0 text-xl md:text-[22px] text-white/90 font-serif placeholder:text-accent/40 leading-relaxed tracking-wide resize-none"
              placeholder="Whisper your thoughts into the void... What seeks to be known?"
            />
            {/* Glow Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-focus-within:via-primary/50 transition-all duration-500" />
          </label>
        </div>
      </div>

      {/* Footer Action */}
      <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20">
        <button 
          onClick={() => onNavigate(Screen.RESULT)}
          disabled={!text.trim()}
          className="relative w-full overflow-hidden rounded-full h-14 px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-bold tracking-[0.05em] shadow-[0_0_25px_rgba(255,0,132,0.25)] hover:shadow-[0_0_35px_rgba(255,0,132,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>INTERPRET</span>
        </button>
      </div>
    </div>
  );
};