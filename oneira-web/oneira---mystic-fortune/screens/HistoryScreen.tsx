import React from 'react';
import { Screen, Fortune } from '../types';
import { Search, Sparkles, Heart, Sun, Moon, Eye, Award, Scale, Wind, Droplets, LayoutGrid, Settings } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const mockFortunes: Fortune[] = [
  { id: '1', date: 'Nov 12, 2026', title: 'Clarity', description: 'The fog lifts, revealing a path you previously ignored.', type: 'Clarity', icon: 'Sun' },
  { id: '2', date: 'Nov 11, 2026', title: 'Mystery', description: 'Shadows whisper secrets only the brave can hear.', type: 'Mystery', icon: 'Moon' },
  { id: '3', date: 'Nov 10, 2026', title: 'Vigilance', description: 'Keep your eyes open; opportunity is fleeting.', type: 'Vigilance', icon: 'Eye' },
  { id: '4', date: 'Nov 09, 2026', title: 'Hope', description: 'A star shines brightest in the deepest dark.', type: 'Hope', icon: 'Award' },
  { id: '5', date: 'Nov 08, 2026', title: 'Balance', description: 'Equilibrium must be restored within.', type: 'Balance', icon: 'Scale' },
  { id: '6', date: 'Nov 07, 2026', title: 'Flux', description: 'Change is the only constant in the void.', type: 'Flux', icon: 'Wind' },
];

export const HistoryScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-screen max-w-[600px] mx-auto bg-background-dark shadow-2xl border-x border-white/5 relative">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[#4b2036] bg-[#2e1423]/70 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-serif text-white tracking-wide">Oneira</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-accent hover:text-white transition-colors">
            <Search className="w-6 h-6" />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#4b2036]">
             <img src="https://picsum.photos/200/200" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <div className="px-6 pt-8 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-[32px] font-serif font-bold leading-tight">Your Path</h2>
            <p className="text-accent text-sm font-normal">Your collection of saved daily fortunes.</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-6 pb-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 min-w-max">
            <Chip active label="All" />
            <Chip label="Love" />
            <Chip label="Career" />
            <Chip label="Health" />
          </div>
        </div>

        {/* Grid */}
        <div className="px-6 grid grid-cols-2 gap-4 pb-8">
          {mockFortunes.map((fortune) => (
            <FortuneCard key={fortune.id} fortune={fortune} />
          ))}
        </div>
      </main>

      {/* Bottom Nav */}
      <div className="absolute bottom-6 left-0 w-full px-6 flex justify-center z-50">
        <nav className="bg-[#2e1423]/80 backdrop-blur-lg w-full max-w-[320px] rounded-full px-2 py-2 flex justify-between items-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/5">
          <NavBtn icon={<Droplets className="w-6 h-6" />} />
          <NavBtn icon={<LayoutGrid className="w-6 h-6" />} active onClick={() => onNavigate(Screen.LANDING)} />
          <NavBtn icon={<Settings className="w-6 h-6" />} />
        </nav>
      </div>
    </div>
  );
};

const Chip: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button className={`flex h-9 items-center justify-center rounded-full px-5 text-sm font-medium transition-all ${
    active 
    ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,132,0.4)]' 
    : 'bg-[#4b2036]/50 hover:bg-[#4b2036] border border-[#4b2036] text-accent'
  }`}>
    {label}
  </button>
);

const FortuneCard: React.FC<{ fortune: Fortune }> = ({ fortune }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sun': return <Sun className="w-8 h-8" />;
      case 'Moon': return <Moon className="w-8 h-8" />;
      case 'Eye': return <Eye className="w-8 h-8" />;
      case 'Award': return <Award className="w-8 h-8" />;
      case 'Scale': return <Scale className="w-8 h-8" />;
      case 'Wind': return <Wind className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  return (
    <div className="group relative flex flex-col bg-background-card rounded-[2rem] p-5 border border-[#4b2036]/50 cursor-pointer overflow-hidden hover:-translate-y-1 transition-transform duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart className="w-4 h-4 text-primary fill-primary" />
      </div>
      
      <div className="flex items-center justify-center aspect-square rounded-full bg-[#230f19] mb-4 border border-[#4b2036] group-hover:border-primary/50 transition-colors text-white group-hover:text-primary">
        {getIcon(fortune.icon)}
      </div>
      
      <div>
        <p className="text-accent text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{fortune.date}</p>
        <h3 className="text-white text-lg font-serif font-bold leading-tight mb-2 group-hover:text-primary transition-colors">{fortune.title}</h3>
        <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">{fortune.description}</p>
      </div>
    </div>
  );
};

const NavBtn: React.FC<{ icon: React.ReactNode; active?: boolean; onClick?: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
      active 
      ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,132,0.4)]' 
      : 'text-accent hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
  </button>
);