import React, { useState, useEffect } from 'react';
import { ViewState, FortuneType, FortuneResult, HistoryItem } from './types';
import { Background } from './components/Background';
import { Navigation } from './components/Navigation';
import { generateFortune } from './services/geminiService';

// --- Sub-components placed here for file limit constraints, normally would be separate ---

const Header = ({ title, showBack, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => (
  <header className="flex items-center justify-between px-6 py-6 sticky top-0 z-30 shrink-0">
    <div className="flex items-center gap-3">
      {showBack ? (
         <button onClick={onBack} className="group flex items-center justify-center rounded-full h-10 pr-4 pl-3 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300">
           <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
           <span className="truncate">RETURN</span>
         </button>
      ) : (
        <>
          <div className="size-8 flex items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/30">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <h2 className="text-white text-xl font-serif font-bold tracking-tight">{title}</h2>
        </>
      )}
    </div>
    <div className="flex items-center gap-4">
      <button className="flex items-center justify-center size-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
        <span className="material-symbols-outlined text-white/70 text-[20px]">search</span>
      </button>
      <div className="size-10 rounded-full bg-cover bg-center border border-white/10 ring-2 ring-primary/20" style={{ backgroundImage: "url('https://picsum.photos/200')" }}></div>
    </div>
  </header>
);

const SplashView = ({ onEnter }: { onEnter: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full w-full space-y-16 animate-fade-in px-6">
    <div className="flex items-center justify-center gap-8 md:gap-12">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
        <span className="material-symbols-outlined text-3xl text-white/90">dark_mode</span>
      </div>
      <div 
        onClick={onEnter}
        className="cursor-pointer group relative w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:shadow-[0_0_50px_rgba(255,0,132,0.5)]"
      >
        <span className="material-symbols-outlined text-5xl text-primary drop-shadow-[0_0_8px_rgba(255,0,132,0.8)] group-hover:rotate-12 transition-transform duration-500">auto_awesome</span>
        <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-slow"></div>
      </div>
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
        <span className="material-symbols-outlined text-3xl text-white/90">blur_on</span>
      </div>
    </div>
    
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="font-serif text-5xl font-normal leading-tight tracking-[0.2em] text-white drop-shadow-xl">
        2026<br/>DAILY<br/>FORTUNE
      </h1>
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
    </div>

    <button onClick={onEnter} className="mt-8 text-accent-pink text-xs font-bold tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-opacity">
      Tap the spark to begin
    </button>
  </div>
);

const SelectionView = ({ onSelect }: { onSelect: (type: FortuneType) => void }) => (
  <div className="flex flex-col h-full w-full animate-fade-in pb-24">
    <Header title="Oneira" />
    <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 custom-scrollbar">
      <div className="flex flex-col mb-8 text-center">
        <h1 className="text-3xl font-serif text-white leading-tight mb-2">
          Your Destiny <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cosmic-purple">Awaits</span>
        </h1>
        <p className="text-white/60 text-sm font-medium">Select a path to reveal your daily fortune.</p>
      </div>

      <div className="flex flex-row justify-center items-stretch gap-3 h-[420px] w-full">
        {/* Dream Card */}
        <div onClick={() => onSelect(FortuneType.DREAM)} className="group relative flex-1 cursor-pointer transition-all duration-500 hover:flex-[1.2] hover:-translate-y-2">
          <div className="relative h-full w-full rounded-[1.5rem] border border-cosmic-purple/50 bg-[#0a0510] shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] group-hover:border-cosmic-purple transition-all duration-300 overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-cosmic-purple/10 opacity-50"></div>
            <div className="flex-1 w-full flex items-center justify-center relative p-2">
              <div className="w-20 h-20 rounded-full border-2 border-cosmic-purple/80 shadow-[0_0_15px_rgba(139,92,246,0.5)] flex items-center justify-center bg-cosmic-purple/5">
                <span className="material-symbols-outlined text-cosmic-purple text-4xl">mode_night</span>
              </div>
            </div>
            <div className="w-full pb-6 pt-2 text-center relative z-10">
              <div className="w-8 h-px bg-cosmic-purple/50 mx-auto mb-3"></div>
              <p className="text-cosmic-purple text-xs font-display tracking-[0.15em] uppercase font-bold group-hover:text-white transition-colors">Dream</p>
              <p className="text-[9px] text-white/30 font-mono mt-1">THE MOON</p>
            </div>
          </div>
        </div>

        {/* Oracle Card */}
        <div onClick={() => onSelect(FortuneType.ORACLE)} className="group relative flex-1 cursor-pointer transition-all duration-500 hover:flex-[1.2] hover:-translate-y-2">
          <div className="relative h-full w-full rounded-[1.5rem] border border-cosmic-cyan/50 bg-[#050a10] shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:border-cosmic-cyan transition-all duration-300 overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-cyan/5 to-cosmic-cyan/10 opacity-50"></div>
            <div className="flex-1 w-full flex items-center justify-center relative p-2">
              <div className="w-20 h-32 border border-cosmic-cyan/60 flex items-center justify-center bg-cosmic-cyan/5">
                <span className="material-symbols-outlined text-cosmic-cyan text-5xl">visibility</span>
              </div>
            </div>
            <div className="w-full pb-6 pt-2 text-center relative z-10">
              <div className="w-8 h-px bg-cosmic-cyan/50 mx-auto mb-3"></div>
              <p className="text-cosmic-cyan text-xs font-display tracking-[0.15em] uppercase font-bold group-hover:text-white transition-colors">Oracle</p>
              <p className="text-[9px] text-white/30 font-mono mt-1">THE MAGICIAN</p>
            </div>
          </div>
        </div>

        {/* Soul Card */}
        <div onClick={() => onSelect(FortuneType.SOUL)} className="group relative flex-1 cursor-pointer transition-all duration-500 hover:flex-[1.2] hover:-translate-y-2">
          <div className="relative h-full w-full rounded-[1.5rem] border border-primary/50 bg-[#10050a] shadow-[0_0_15px_rgba(255,0,132,0.1)] group-hover:shadow-[0_0_30px_rgba(255,0,132,0.4)] group-hover:border-primary transition-all duration-300 overflow-hidden flex flex-col items-center">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 opacity-50"></div>
            <div className="flex-1 w-full flex items-center justify-center relative p-2">
              <span className="material-symbols-outlined text-primary text-5xl drop-shadow-[0_0_8px_rgba(255,0,132,0.8)]">favorite</span>
            </div>
            <div className="w-full pb-6 pt-2 text-center relative z-10">
              <div className="w-8 h-px bg-primary/50 mx-auto mb-3"></div>
              <p className="text-primary text-xs font-display tracking-[0.15em] uppercase font-bold group-hover:text-white transition-colors">Soul</p>
              <p className="text-[9px] text-white/30 font-mono mt-1">THE LOVERS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InputDreamView = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (text: string) => void }) => {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-full w-full animate-fade-in relative z-20">
      <Header title="" showBack onBack={onBack} />
      
      <div className="flex-1 flex flex-col px-8 overflow-y-auto">
        <div className="pt-4 pb-6">
          <h2 className="font-serif text-white tracking-wide text-3xl font-normal leading-tight text-left">
            Tell us your dream...
          </h2>
        </div>
        <div className="flex-1 flex flex-col pb-[120px]">
          <label className="flex flex-col flex-1 h-full relative group">
            <textarea 
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-textarea flex w-full h-full min-h-[300px] bg-transparent border-none focus:ring-0 focus:border-none p-0 text-[22px] text-white/90 font-serif placeholder:text-accent-pink/40 leading-relaxed tracking-wide selection:bg-primary/30 selection:text-white resize-none"
              placeholder="Whisper your thoughts into the void... What seeks to be known?"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-focus-within:via-primary/50 transition-all duration-500"></div>
          </label>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background to-transparent z-20">
        <button 
          onClick={() => onSubmit(text)}
          disabled={!text.trim()}
          className="relative w-full overflow-hidden rounded-full h-14 px-6 bg-primary hover:bg-primary-dark disabled:bg-white/10 disabled:text-white/30 text-white text-base font-bold leading-normal tracking-[0.05em] shadow-[0_0_25px_rgba(255,0,132,0.25)] hover:shadow-[0_0_35px_rgba(255,0,132,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 group"
        >
          <span className="material-symbols-outlined text-[20px] animate-pulse-slow">auto_awesome</span>
          <span className="truncate">INTERPRET</span>
        </button>
      </div>
    </div>
  );
};

const LoadingView = () => (
  <div className="flex flex-col items-center justify-center h-full w-full z-50 bg-background/80 backdrop-blur-xl">
    <div className="relative size-24 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
      <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
      <span className="material-symbols-outlined text-4xl text-primary animate-pulse">auto_awesome</span>
    </div>
    <p className="mt-8 text-white/60 font-serif tracking-widest text-sm animate-pulse">CONSULTING THE STARS...</p>
  </div>
);

const ResultView = ({ result, onAccept }: { result: FortuneResult | null, onAccept: () => void }) => {
  if (!result) return null;
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full z-40 bg-background relative overflow-hidden animate-fade-in px-6 text-center">
       {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://picsum.photos/800/1200')" }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-background/90 to-black"></div>

      <div className="relative z-10 flex flex-col items-center max-w-lg">
        <div className="group relative mb-12 flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary blur-[80px] opacity-40 duration-1000"></div>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,132,0.2)]">
            <span className="material-symbols-outlined text-[64px] text-primary/90 drop-shadow-[0_0_10px_rgba(255,0,132,0.8)]">
              {result.icon}
            </span>
          </div>
        </div>

        <div className="mb-10 flex flex-col items-center gap-2">
          <h2 className="text-sm font-bold tracking-[0.2em] text-white/60 uppercase">{result.subtitle}</h2>
          <h1 className="font-serif text-5xl font-normal tracking-wider text-white drop-shadow-xl uppercase">
            {result.title}
          </h1>
        </div>

        <div className="mb-14 px-4">
          <p className="text-lg font-light leading-relaxed text-white/80 antialiased font-serif">
            {result.description}
          </p>
        </div>

        <button 
          onClick={onAccept}
          className="group relative flex min-w-[200px] items-center justify-center overflow-hidden rounded-full border border-white/30 bg-transparent px-8 py-4 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(255,0,132,0.4)] active:scale-95"
        >
          <span className="font-bold tracking-[0.15em] text-white">ACCEPT</span>
        </button>
      </div>
    </div>
  );
};

const HistoryView = ({ history }: { history: HistoryItem[] }) => (
  <div className="flex flex-col h-full w-full animate-fade-in pb-24">
    <Header title="Oneira" />
    <div className="px-6 pt-4 pb-4">
      <h2 className="text-white text-[32px] font-serif font-bold leading-tight">Your Path</h2>
      <p className="text-accent-pink text-sm font-normal">Your collection of saved daily fortunes.</p>
    </div>

    {/* Filter Chips */}
    <div className="px-6 pb-6 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 min-w-max">
        <button className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-primary px-5 shadow-[0_0_15px_rgba(255,0,132,0.4)]">
          <span className="text-white text-sm font-medium">All</span>
        </button>
        {['Love', 'Career', 'Dreams'].map(f => (
           <button key={f} className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-surface hover:bg-surface/80 border border-white/10 px-5 transition-all">
             <span className="text-accent-pink text-sm font-medium">{f}</span>
           </button>
        ))}
      </div>
    </div>

    <div className="px-6 grid grid-cols-2 gap-4 pb-20 overflow-y-auto custom-scrollbar">
      {history.map((item) => (
        <div key={item.id} className="group relative flex flex-col bg-[#2e1423] rounded-[2rem] p-5 border border-white/5 cursor-pointer overflow-hidden hover:-translate-y-1 transition-transform duration-300">
           <div className="flex items-center justify-center aspect-square rounded-full bg-[#230f19] mb-4 border border-white/10 group-hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-4xl text-white group-hover:text-primary transition-colors">{item.icon}</span>
          </div>
          <div>
            <p className="text-accent-pink text-[10px] font-medium uppercase tracking-wider mb-1">{item.date}</p>
            <h3 className="text-white text-lg font-serif font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-white/60 text-xs mt-2 line-clamp-2">{item.description}</p>
          </div>
        </div>
      ))}
      
      {/* Mock Items for visual fullness if history is short */}
      {history.length < 4 && (
        <>
           <div className="group relative flex flex-col bg-[#2e1423] rounded-[2rem] p-5 border border-white/5 opacity-50 grayscale">
            <div className="flex items-center justify-center aspect-square rounded-full bg-[#230f19] mb-4 border border-white/10">
              <span className="material-symbols-outlined text-4xl text-white">lock</span>
            </div>
             <div>
               <p className="text-accent-pink text-[10px] font-medium uppercase tracking-wider mb-1">Future</p>
               <h3 className="text-white text-lg font-serif font-bold leading-tight">Locked</h3>
             </div>
           </div>
        </>
      )}
    </div>
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.SPLASH);
  const [selectedPath, setSelectedPath] = useState<FortuneType | null>(null);
  const [result, setResult] = useState<FortuneResult | null>(null);
  
  // Mock History
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      title: 'VIGILANCE',
      subtitle: 'Keep your eyes open',
      description: 'The fog lifts, revealing a path you previously ignored. Opportunity is fleeting.',
      type: FortuneType.ORACLE,
      date: 'Nov 10, 2026',
      icon: 'visibility'
    },
    {
      id: '2',
      title: 'BALANCE',
      subtitle: 'Equilibrium restored',
      description: 'A star shines brightest in the deepest dark. Find your center.',
      type: FortuneType.SOUL,
      date: 'Nov 09, 2026',
      icon: 'balance'
    }
  ]);

  const handlePathSelect = async (type: FortuneType) => {
    setSelectedPath(type);
    if (type === FortuneType.DREAM) {
      setView(ViewState.INPUT_DREAM);
    } else {
      // Direct fortune generation
      await processFortune(type);
    }
  };

  const handleDreamSubmit = async (text: string) => {
    await processFortune(FortuneType.DREAM, text);
  };

  const processFortune = async (type: FortuneType, context?: string) => {
    setView(ViewState.LOADING);
    const newFortune = await generateFortune(type, context);
    
    // Artificial delay for dramatic effect if API is too fast
    if (Date.now() % 2 !== 0) await new Promise(r => setTimeout(r, 1500)); 

    setResult(newFortune);
    setHistory(prev => [{...newFortune, id: Date.now().toString()}, ...prev]);
    setView(ViewState.RESULT);
  };

  return (
    <div className="relative w-full h-screen bg-background text-white flex justify-center overflow-hidden">
      <Background />
      
      {/* Mobile-first constrained container */}
      <div className="relative w-full max-w-[600px] h-full bg-background/50 backdrop-blur-sm shadow-2xl border-x border-white/5 overflow-hidden flex flex-col">
        
        {view === ViewState.SPLASH && <SplashView onEnter={() => setView(ViewState.SELECTION)} />}
        
        {view === ViewState.SELECTION && <SelectionView onSelect={handlePathSelect} />}
        
        {view === ViewState.INPUT_DREAM && <InputDreamView onBack={() => setView(ViewState.SELECTION)} onSubmit={handleDreamSubmit} />}
        
        {view === ViewState.LOADING && <LoadingView />}
        
        {view === ViewState.RESULT && <ResultView result={result} onAccept={() => setView(ViewState.HISTORY)} />}
        
        {view === ViewState.HISTORY && <HistoryView history={history} />}

        <Navigation currentView={view} setView={setView} />
        
      </div>
    </div>
  );
};

export default App;
