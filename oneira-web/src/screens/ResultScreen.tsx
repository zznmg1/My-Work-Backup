import React from 'react';
import { NavButton } from '../components/NavButton';
import { Screen, Fortune } from '../types';
import { Loader2, Sparkles, ArrowRight, Zap, Stars } from 'lucide-react';

interface Props {
    onNavigate: (screen: Screen) => void;
    result: Fortune | null;
}

export const ResultScreen: React.FC<Props> = ({ onNavigate, result }) => {
    if (!result) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-dark text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    // Simple parsing of the AI text
    const lines = result.description.split('\n');
    const summaryLine = lines.find(l => l.includes('1. [한줄 요약]'))?.replace('1. [한줄 요약]:', '').trim() || result.description.substring(0, 50) + "...";
    const detailSection = lines.find(l => l.includes('2. [심층 분석]')) ? result.description.split('2. [심층 분석]:')[1]?.split('3. [조언]:')[0]?.trim() : result.description;
    const adviceSection = lines.find(l => l.includes('3. [조언]')) ? result.description.split('3. [조언]:')[1]?.split('4. [금전운]:')[0]?.trim() : "";

    const score = result.luckScore || 77;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark text-white relative overflow-hidden px-4 py-6">
            <div className="z-10 w-full max-w-lg flex flex-col items-center gap-6 h-full max-h-[90vh]">

                {/* Header / Score */}
                <div className="text-center space-y-2 shrink-0">
                    <h2 className="text-primary tracking-widest text-sm font-bold uppercase">Mystic Analysis</h2>
                    <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <span className="relative text-6xl font-serif text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            {score}
                        </span>
                        <span className="absolute -top-2 -right-4 text-xs text-white/60">/100</span>
                    </div>
                </div>

                {/* Visual Card (AI Generated Image) */}
                <div className="w-64 h-80 shrink-0 rounded-xl bg-gradient-to-b from-cosmic-deep to-black border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center relative group overflow-hidden">
                    {result.imageUrl ? (
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={result.imageUrl}
                                alt="Destiny Visualization"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-at from-black via-transparent to-transparent opacity-40" />
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-cosmic-cyan/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 text-center p-4">
                                <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-2 animate-pulse-slow" />
                                <p className="text-xs text-white/50 tracking-widest uppercase">Astral Projection</p>
                            </div>
                        </>
                    )}

                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm py-2 text-center border-t border-white/5 z-20">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                            <Zap className="w-3 h-3" /> AI Talisman
                        </span>
                    </div>
                </div>

                {/* Content Card (Scrollable) */}
                <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex-1 overflow-y-auto min-h-0 shadow-2xl">

                    {/* Summary */}
                    <div className="mb-6 border-b border-white/10 pb-4">
                        <h3 className="text-cosmic-cyan text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Stars className="w-4 h-4" /> Oracle's Summary
                        </h3>
                        <p className="text-lg font-serif italic text-white leading-relaxed">
                            "{summaryLine}"
                        </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 text-sm text-white/80 font-light leading-relaxed">
                        <div>
                            <h4 className="text-white font-bold opacity-90 mb-1">Deep Insight</h4>
                            <p>{detailSection}</p>
                        </div>

                        {adviceSection && (
                            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                                <h4 className="text-primary font-bold opacity-90 mb-1 flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Action Advice
                                </h4>
                                <p className="text-primary/90">{adviceSection}</p>
                            </div>
                        )}
                    </div>

                    {/* Lotto Numbers */}
                    {result.lotto && result.lotto.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <h4 className="text-xs text-white/50 uppercase tracking-widest mb-3 text-center">Lucky Numbers</h4>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {result.lotto.map((num) => (
                                    <span key={num} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                        {num}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="w-full shrink-0 pt-2">
                    <button
                        onClick={() => onNavigate(Screen.LANDING)}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/10 text-white font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 backdrop-blur-sm group"
                    >
                        <span>Return to Void</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
};
