import React from 'react';
import { Screen, CardType } from '../types';
import { Settings, User, Moon, Eye, Sparkles } from 'lucide-react';

interface Props {
    onNavigate: (screen: Screen) => void;
    onSelectType: (type: CardType) => void;
}

export const SelectionScreen: React.FC<Props> = ({ onNavigate, onSelectType }) => {
    const handleCardClick = (type: CardType) => {
        onSelectType(type);
        onNavigate(Screen.INPUT);
    };

    return (
        <div className="flex flex-col h-screen max-h-[900px] w-full max-w-[600px] mx-auto bg-background-dark/80 backdrop-blur-md shadow-2xl overflow-hidden relative border-x border-white/5">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-background-dark/50 backdrop-blur-md z-30">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(Screen.LANDING)}>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/30">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h2 className="text-white text-xl font-serif font-bold tracking-tight">Oneira</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <Settings className="w-5 h-5 text-white/70" />
                    </button>
                    <div className="w-10 h-10 rounded-full border border-white/10 ring-2 ring-primary/20 overflow-hidden">
                        <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="flex flex-col mb-10 text-center">
                    <h1 className="text-3xl font-serif text-white leading-tight mb-2">
                        Your Destiny <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cosmic-purple">Awaits</span>
                    </h1>
                    <p className="text-white/60 text-sm font-medium">Select a path to reveal your daily fortune.</p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-auto sm:h-[400px]">
                    {/* Dream Card */}
                    <Card
                        color="purple"
                        title="Dream"
                        subtitle="III - THE MOON"
                        icon={<Moon className="w-12 h-12 text-cosmic-purple" strokeWidth={1} />}
                        onClick={() => handleCardClick('DREAM')}
                    />

                    {/* Oracle Card */}
                    <Card
                        color="cyan"
                        title="Oracle"
                        subtitle="I - THE MAGICIAN"
                        icon={<Eye className="w-12 h-12 text-cosmic-cyan" strokeWidth={1} />}
                        onClick={() => handleCardClick('ORACLE')}
                    />

                    {/* Soul Card */}
                    <Card
                        color="pink"
                        title="Soul"
                        subtitle="VI - THE LOVERS"
                        icon={<User className="w-12 h-12 text-cosmic-pink" strokeWidth={1} />}
                        onClick={() => handleCardClick('SOUL')}
                    />
                </div>

                <div className="mt-8 text-center px-8">
                    <p className="text-white/40 text-xs leading-relaxed">
                        Tap a card to reveal the hidden energies of the cosmos.
                    </p>
                </div>
            </div>
        </div>
    );
};

const Card = ({ color, title, subtitle, icon, onClick }: {
    color: 'purple' | 'cyan' | 'pink',
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    onClick: () => void
}) => {
    const colorMap = {
        purple: { border: 'border-cosmic-purple', text: 'text-cosmic-purple', shadow: 'hover:shadow-cosmic-purple/40', bg: 'bg-cosmic-purple/5' },
        cyan: { border: 'border-cosmic-cyan', text: 'text-cosmic-cyan', shadow: 'hover:shadow-cosmic-cyan/40', bg: 'bg-cosmic-cyan/5' },
        pink: { border: 'border-cosmic-pink', text: 'text-cosmic-pink', shadow: 'hover:shadow-cosmic-pink/40', bg: 'bg-cosmic-pink/5' },
    };

    const c = colorMap[color];

    return (
        <div
            onClick={onClick}
            className={`group relative flex-1 cursor-pointer transition-all duration-500 hover:-translate-y-2 h-[200px] sm:h-full`}
        >
            <div className={`relative h-full w-full rounded-2xl border ${c.border}/30 bg-[#0a0510] shadow-lg ${c.shadow} hover:border-${color}-500 transition-all duration-300 overflow-hidden flex flex-col items-center`}>
                {/* Inner Glow */}
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-${color}-500/5 to-${color}-500/10 opacity-50`} />

                {/* Content */}
                <div className="flex-1 w-full flex items-center justify-center relative p-4">
                    <div className={`w-20 h-20 sm:w-24 sm:h-36 rounded-full sm:rounded-none sm:border sm:${c.border}/60 flex items-center justify-center ${c.bg} relative`}>
                        <div className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {icon}
                        </div>
                        {/* Decorative lines for rectangle cards */}
                        <div className="hidden sm:block absolute top-2 w-full h-px bg-white/10" />
                        <div className="hidden sm:block absolute bottom-2 w-full h-px bg-white/10" />
                    </div>
                </div>

                <div className={`w-full pb-6 pt-2 text-center relative z-10 bg-gradient-to-t from-${color}-900/20 to-transparent`}>
                    <div className={`w-8 h-px ${c.bg.replace('5', '50')} mx-auto mb-3`} />
                    <p className={`${c.text} text-sm font-serif tracking-[0.15em] uppercase font-bold group-hover:text-white transition-colors`}>{title}</p>
                    <p className="text-[10px] text-white/30 font-mono mt-1 group-hover:text-white/50">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};
