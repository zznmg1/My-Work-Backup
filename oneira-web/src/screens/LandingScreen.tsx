import React from 'react';
import { Moon, Sparkles, Ghost, ChevronDown } from 'lucide-react';
import { Screen } from '../types';

interface Props {
    onNavigate: (screen: Screen) => void;
}

export const LandingScreen: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 relative animate-fade-in content-center">
            {/* Icon Trio */}
            <div className="flex items-center justify-center gap-8 md:gap-12 mb-16">
                {/* Moon */}
                <button className="group flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,0,132,0.3)]">
                        <Moon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                    </div>
                </button>

                {/* Center Sparkle (Main Action) */}
                <button
                    onClick={() => onNavigate(Screen.SELECTION)}
                    className="group flex flex-col items-center -mt-6"
                >
                    <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,132,0.25)] backdrop-blur-xl transition-all duration-500 group-hover:bg-primary/20 group-hover:shadow-[0_0_50px_rgba(255,0,132,0.5)] group-hover:scale-110">
                        <Sparkles className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(255,0,132,0.8)]" />
                    </div>
                </button>

                {/* Ghost/Spirit */}
                <button
                    onClick={() => onNavigate(Screen.HISTORY)}
                    className="group flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,0,132,0.3)]">
                        <Ghost className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                    </div>
                </button>
            </div>

            {/* Main Title */}
            <div className="flex flex-col items-center text-center space-y-8">
                <h1 className="font-serif text-5xl md:text-6xl font-normal leading-tight tracking-[0.1em] text-white drop-shadow-xl">
                    2026<br />
                    매일<br />
                    운명
                </h1>

                {/* Decorative Divider */}
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/60 to-transparent" />

                <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase opacity-70">
                    인공지능 운세 파트너
                </p>
            </div>

            {/* Bottom Hint */}
            <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-30 animate-bounce">
                <ChevronDown className="w-8 h-8 text-white" />
            </div>
        </div>
    );
};
