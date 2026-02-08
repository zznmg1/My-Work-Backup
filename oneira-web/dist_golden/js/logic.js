/**
 * VERSION: v2.0
 * TYPE: DEV CODE (LOGIC)
 * DESCRIPTION: React Application Logic (UMD Architecture - Safe Mode)
 */

// Global React/ReactDOM from UMD
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

// --- ICONS (SVG Components for portability) ---
const Icon = ({ d, className, color = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color }}>
        <path d={d} />
    </svg>
);
const Icons = {
    Sparkles: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 5H3" /></svg>,
    Moon: (p) => <Icon {...p} d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    Ghost: (p) => <Icon {...p} d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />,
    ArrowLeft: (p) => <Icon {...p} d="m12 19-7-7 7-7M19 12H5" />,
    Loader2: (p) => <Icon {...p} d="M21 12a9 9 0 1 1-6.219-8.56" />,
    Eye: (p) => <Icon {...p} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
};

// --- SCREENS ---

// 1. Splash Screen (Restored)
const SplashScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return p + 2;
            });
        }, 30);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050510] text-white">
            <h1 className="splash-text mb-4 animate-float font-serif">DESTINY</h1>
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-100 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mt-4 text-xs tracking-[0.3em] opacity-50 uppercase">Reveal Your Fate</p>
        </div>
    );
};

// 2. Landing Screen
const LandingScreen = ({ onNavigate }) => (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 animate-fade-in relative z-10 w-full max-w-lg mx-auto">
        <div className="flex justify-center gap-8 mb-12">
            <div className="p-5 glass-panel rounded-full"><Icons.Moon className="w-6 h-6 text-white/50" /></div>
            <div onClick={() => onNavigate('SELECTION')} className="p-8 glass-btn rounded-full cursor-pointer hover:scale-110 transition-transform">
                <Icons.Sparkles className="w-12 h-12 text-primary animate-pulse-slow" />
            </div>
            <div className="p-5 glass-panel rounded-full"><Icons.Ghost className="w-6 h-6 text-white/50" /></div>
        </div>
        <h1 className="text-6xl font-serif text-center font-thin leading-none mb-6">2026<br /><span className="text-4xl font-light opacity-80">Oracle</span></h1>
        <p className="text-accent text-xs tracking-[0.4em] uppercase opacity-60">Daily AI Fortune</p>
    </div>
);

// 3. Selection Screen
const SelectionScreen = ({ onNavigate, onSelectType }) => {
    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto glass-panel border-x border-white/5 px-6 py-8 animate-fade-in">
            <header className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-primary/20 rounded-lg"><Icons.Sparkles className="w-5 h-5 text-primary" /></div>
                <h2 className="text-xl font-serif font-bold tracking-wide">Oneira</h2>
            </header>

            <h1 className="text-3xl font-serif leading-tight mb-8">
                What do you seek<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cosmic-purple">today?</span>
            </h1>

            <div className="grid gap-4">
                <button
                    onClick={() => { onSelectType('DREAM'); onNavigate('INPUT'); }}
                    className="card-selection glass-panel p-6 rounded-2xl flex items-center gap-4 text-left group"
                >
                    <div className="p-4 bg-cosmic-purple/10 rounded-full text-cosmic-purple group-hover:bg-cosmic-purple group-hover:text-white transition-colors">
                        <Icons.Moon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-widest text-white/90">Dream</h3>
                        <p className="text-xs text-white/50">Uncover hidden meanings</p>
                    </div>
                </button>

                <button
                    onClick={() => { onSelectType('FORTUNE'); onNavigate('INPUT'); }}
                    className="card-selection glass-panel p-6 rounded-2xl flex items-center gap-4 text-left group"
                >
                    <div className="p-4 bg-cosmic-cyan/10 rounded-full text-cosmic-cyan group-hover:bg-cosmic-cyan group-hover:text-white transition-colors">
                        <Icons.Eye className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-widest text-white/90">Oracle</h3>
                        <p className="text-xs text-white/50">Daily guidance & fate</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

// 4. Input Screen
const InputScreen = ({ onNavigate, onSubmit, isAnalyzing, selectedCard }) => {
    const [text, setText] = useState('');
    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto glass-panel border-x border-white/5 px-6 py-6 animate-fade-in relative">
            <button onClick={() => onNavigate('SELECTION')} className="self-start flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
                <Icons.ArrowLeft className="w-5 h-5" /> Back
            </button>

            <h2 className="text-3xl font-serif mb-2 text-white/90">
                {selectedCard === 'DREAM' ? "Describe your dream" : "Focus on your question"}
            </h2>
            <p className="text-xs text-white/40 mb-6 uppercase tracking-wider">The oracle is listening...</p>

            <textarea
                className="w-full h-[40%] bg-white/5 rounded-xl border border-white/10 p-5 text-lg font-serif text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Type here..."
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
            />

            <div className="mt-auto py-6">
                <button
                    onClick={() => onSubmit(text)}
                    disabled={!text.trim() || isAnalyzing}
                    className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-cosmic-purple text-white font-bold text-lg tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(255,0,132,0.4)] transition-all transform hover:scale-[1.02]"
                >
                    {isAnalyzing ? <Icons.Loader2 className="w-6 h-6 animate-spin" /> : <Icons.Sparkles className="w-6 h-6 animate-pulse" />}
                    {isAnalyzing ? "Divining..." : "Reveal Fate"}
                </button>
            </div>
        </div>
    )
};

// 5. Result Screen (With Image Fix)
const ResultScreen = ({ onNavigate, result }) => {
    if (!result) return <div className="flex h-screen items-center justify-center text-white"><Icons.Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

    // Use default prompt if missing
    let imagePrompt = "Mystic tarot card, cosmic atmosphere, high quality digital art";
    // Try to extract prompt from description line 4
    const lines = result.description.split('\n');
    const promptLine = lines.find(line => line.includes('4. [이미지 프롬프트]'));
    if (promptLine) {
        imagePrompt = promptLine.split(':')[1]?.trim() || imagePrompt;
    }

    // Image Generation Logic (Pollinations)
    const seed = Math.floor(Math.random() * 1000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=400&height=600&seed=${seed}&nologo=true&model=flux`;

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto bg-background-dark text-white px-5 py-6 animate-fade-in overflow-y-auto">
            <div className="flex flex-col items-center gap-6 pb-20">
                <div className="text-center pt-4">
                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Destiny Analysis</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-5xl font-serif text-white">{result.luckScore}</span>
                        <span className="text-sm text-white/30 uppercase tracking-widest">/ 100</span>
                    </div>
                </div>

                {/* Image Card  */}
                <div className="image-container w-64 h-80 rounded-2xl bg-black border border-white/10 relative group">
                    <img
                        src={imageUrl}
                        className="w-full h-full object-cover transition-opacity duration-700 hover:scale-110"
                        alt="Destiny Card"
                        onLoad={() => console.log("Image Loaded Success")}
                        onError={(e) => {
                            console.error("Image Failed", e);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.classList.add('img-placeholder');
                            e.currentTarget.parentElement.innerHTML = `
                                <div class="flex flex-col items-center justify-center text-center p-6">
                                    <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-2xl">🔮</div>
                                    <h3 class="font-serif text-lg text-white mb-1">Mystic Card</h3>
                                    <p class="text-[10px] text-white/40 uppercase tracking-widest">${imagePrompt.substring(0, 30)}...</p>
                                </div>
                            `;
                        }}
                    />
                </div>

                {/* Analysis Card */}
                <div className="w-full glass-panel rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent" />
                    <h3 className="font-serif text-xl italic text-white leading-relaxed mb-6">
                        "{lines.find(l => l.includes('1.'))?.split(':')[1]?.trim() || "Destiny awaits..."}"
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="text-primary text-xs font-bold uppercase mb-2">Deep Analysis</h4>
                            <p className="text-sm font-sans text-white/70 leading-relaxed text-justify">
                                {lines.find(l => l.includes('2.'))?.split(':')[1]?.trim() || result.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full pt-4">
                    <button onClick={() => onNavigate('LANDING')} className="w-full py-4 glass-btn rounded-xl text-white font-bold tracking-[0.2em] uppercase text-xs">
                        Return to Start
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- APP CONTROLLER ---
const App = () => {
    const [screen, setScreen] = useState('SPLASH'); // Start with Splash
    const [selectedCard, setSelectedCard] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async (text) => {
        setIsAnalyzing(true);
        try {
            // Real Fetch
            const res = await fetch('http://127.0.0.1:8000/analyze_dream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: selectedCard, user_context: text })
            });

            let data;
            if (res.ok) {
                data = await res.json();
            } else {
                // Fallback Mock if server 500
                throw new Error("Server Error");
            }

            setResult({ luckScore: data.luck_score, description: data.interpretation });

        } catch (e) {
            console.warn("Using offline fallback");
            // Offline Fallback
            setTimeout(() => {
                setResult({
                    luckScore: 88,
                    description: `1. [한줄 요약]: A light shines in the darkness.\n\n2. [심층 분석]: The current path is unclear, but your inner strength is guiding you. Trust your intuition.\n\n3. [조언]: Take a step back and breathe.\n\n4. [이미지 프롬프트]: Glowing lantern in a misty forest, magical, fantasy art`
                });
            }, 1000);
        } finally {
            setIsAnalyzing(false);
            setScreen('RESULT');
        }
    };

    return (
        <div className="h-full w-full">
            {screen === 'SPLASH' && <SplashScreen onComplete={() => setScreen('LANDING')} />}
            {screen === 'LANDING' && <LandingScreen onNavigate={setScreen} />}
            {screen === 'SELECTION' && <SelectionScreen onNavigate={setScreen} onSelectType={setSelectedCard} />}
            {screen === 'INPUT' && <InputScreen onNavigate={setScreen} onSubmit={handleAnalyze} isAnalyzing={isAnalyzing} selectedCard={selectedCard} />}
            {screen === 'RESULT' && <ResultScreen onNavigate={setScreen} result={result} />}
        </div>
    );
};

// Mount
const root = createRoot(document.getElementById('root'));
root.render(<App />);
