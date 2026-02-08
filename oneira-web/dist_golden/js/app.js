// VERSION: v3.0 (Premium Design + Fix)
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const { motion, AnimatePresence } = window.Motion ? window.Motion : { motion: { div: 'div', span: 'span' }, AnimatePresence: ({ children }) => children };

// --- ICONS (Lucide) ---
const Icon = ({ name, ...props }) => {
    // Basic SVG fallback if Lucide is missing, but we will try to use the global object if available
    // For safety, we inline the critical ones used in the premium design
    const icons = {
        Moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
        Sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 5H3" /></>,
        Ghost: <path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />,
        ChevronDown: <path d="m6 9 6 6 6-6" />,
        Eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
        User: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
        ArrowLeft: <><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>,
        ArrowRight: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
        Loader2: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
        Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
        Stars: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></>
    };
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
        >
            {icons[name] || <circle cx="12" cy="12" r="10" />}
        </svg>
    );
};

// --- RESTORED COMPONENTS (Premium Design) ---

const Background = () => (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-[#050205]">
        <div className="absolute inset-0 bg-[#050205]" />
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-pink-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px] opacity-50" />
        {/* Noise Filter SVG */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
);

const SplashScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const i = setInterval(() => setProgress(p => (p >= 100 ? 100 : p + 4)), 50);
        const t = setTimeout(onComplete, 2500);
        return () => { clearInterval(i); clearTimeout(t); };
    }, []);
    return (
        <div className="fixed inset-0 z-[999] bg-[#030303] flex flex-col items-center justify-center text-[#D4AF37]">
            <h1 className="text-5xl font-serif tracking-[0.2em] mb-4 animate-float">DESTINY</h1>
            <div className="w-32 h-0.5 bg-[#222] rounded overflow-hidden">
                <div className="h-full bg-[#D4AF37] transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-[10px] tracking-[0.3em] opacity-50">REVEAL YOUR FATE</p>
        </div>
    );
};

const LandingScreen = ({ onNavigate }) => (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 relative animate-fade-in content-center">
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-16">
            <button className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,0,132,0.3)]">
                    <Icon name="Moon" className="w-6 h-6 text-white/80 group-hover:text-white" />
                </div>
            </button>
            <button onClick={() => onNavigate('SELECTION')} className="flex flex-col items-center -mt-6 group">
                <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,132,0.25)] backdrop-blur-xl transition-all duration-500 group-hover:bg-primary/20 group-hover:shadow-[0_0_50px_rgba(255,0,132,0.5)] group-hover:scale-110">
                    <Icon name="Sparkles" className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(255,0,132,0.8)]" />
                </div>
            </button>
            <button className="flex flex-col items-center group">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,0,132,0.3)]">
                    <Icon name="Ghost" className="w-6 h-6 text-white/80 group-hover:text-white" />
                </div>
            </button>
        </div>
        <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="font-serif text-5xl md:text-6xl font-normal leading-tight tracking-[0.1em] text-white drop-shadow-xl">
                2026<br />DAILY<br />FORTUNE
            </h1>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
            <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase opacity-70 animate-pulse-slow">Mystic Fortune AI</p>
        </div>
    </div>
);

const SelectionScreen = ({ onNavigate, onSelectType }) => {
    const cards = [
        { id: 'DREAM', color: 'cosmic-purple', icon: 'Moon', title: '꿈 해몽', sub: 'III - The Moon' },
        { id: 'FORTUNE', color: 'cosmic-cyan', icon: 'Eye', title: '운세', sub: 'I - The Magician' },
        { id: 'SOUL', color: 'cosmic-pink', icon: 'User', title: '심리', sub: 'VI - The Lovers' }
    ];
    return (
        <div className="flex flex-col h-screen max-w-[600px] mx-auto bg-background-dark/80 backdrop-blur-md px-6 py-8">
            <header className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => onNavigate('LANDING')}>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30"><Icon name="Sparkles" className="w-4 h-4 text-primary" /></div>
                <h2 className="text-xl font-serif font-bold tracking-tight">Oneira</h2>
            </header>
            <h1 className="text-3xl font-serif text-white mb-8">당신의 운명을<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cosmic-purple">확인하세요</span></h1>

            <div className="grid grid-cols-1 gap-4">
                {cards.map(c => (
                    <div key={c.id} onClick={() => { onSelectType(c.id); onNavigate('INPUT'); }} className={`group relative h-32 rounded-2xl border border-white/10 bg-[#0a0510] hover:border-${c.color} overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] flex items-center px-6`}>
                        <div className={`w-16 h-16 rounded-full bg-${c.color}/10 flex items-center justify-center mr-6 group-hover:bg-${c.color}/20 transition-colors`}>
                            <Icon name={c.icon} className={`w-8 h-8 text-${c.color}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-primary transition-colors">{c.title}</h3>
                            <p className="text-xs text-white/40 font-mono">{c.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InputScreen = ({ onNavigate, onSubmit, isAnalyzing, selectedCard }) => {
    const [text, setText] = useState('');
    return (
        <div className="flex flex-col h-screen max-w-[600px] mx-auto bg-background-dark/80 backdrop-blur-md px-6 py-6 border-x border-white/5 relative">
            <button onClick={() => onNavigate('SELECTION')} className="self-start flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-bold text-white/80 transition-all mb-6">
                <Icon name="ArrowLeft" className="w-4 h-4" /> 돌아가기
            </button>
            <h2 className="text-3xl font-serif text-white mb-2 leading-tight">
                {selectedCard === 'DREAM' ? "어떤 꿈을 꾸셨나요?" : "무엇이 궁금하신가요?"}
            </h2>
            <p className="text-white/40 text-sm mb-8">구체적으로 적을수록 더 정확한 운명이 보입니다.</p>

            <div className="flex-1 relative group">
                <textarea
                    autoFocus
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full h-[50vh] bg-transparent border-none text-xl md:text-2xl text-white font-serif placeholder:text-white/10 leading-relaxed resize-none focus:ring-0 p-0"
                    placeholder="이곳에 내용을 적어주세요..."
                />
            </div>

            <div className="py-6">
                <button
                    onClick={() => onSubmit(text)}
                    disabled={!text.trim() || isAnalyzing}
                    className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,0,132,0.3)] hover:shadow-[0_0_50px_rgba(255,0,132,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? <Icon name="Loader2" className="w-6 h-6 animate-spin" /> : <Icon name="Sparkles" className="w-6 h-6 animate-pulse" />}
                    {isAnalyzing ? "운명 해석 중..." : "결과 보기"}
                </button>
            </div>
        </div>
    );
};

// *** FIXED RESULT SCREEN (Safe Image Implementation) ***
const ResultScreen = ({ onNavigate, result }) => {
    if (!result) return <div className="flex h-screen items-center justify-center bg-background-dark text-white"><Icon name="Loader2" className="w-10 h-10 animate-spin text-primary" /></div>;

    const lines = result.description.split('\n');
    const summary = lines.find(l => l.includes('1.'))?.split(':')[1]?.trim() || "운명의 메시지";
    const detail = lines.find(l => l.includes('2.'))?.split(':')[1]?.trim() || result.description;

    // Robust Prompt Parsing
    const promptMatch = result.description.match(/4\.\s*\[이미지 프롬프트\]:?\s*(.*)/i);
    const imagePrompt = promptMatch ? promptMatch[1].trim() : "Mystic tarot card, magical, cosmic";
    // Add Seed to force new image
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=400&height=600&seed=${Math.random()}&nologo=true`;

    return (
        <div className="flex flex-col h-screen max-w-[600px] mx-auto bg-background-dark text-white relative overflow-y-auto px-4 py-8">
            <div className="flex flex-col items-center gap-6 pb-20">
                <div className="text-center">
                    <h2 className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-2">Destiny Analysis</h2>
                    <div className="relative inline-block">
                        <span className="text-7xl font-serif text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{result.luckScore}</span>
                        <span className="absolute -top-2 -right-6 text-sm text-white/40">/100</span>
                    </div>
                </div>

                {/* CARD CONTAINER (CSS ONLY - NO useState) */}
                <div className="relative w-64 h-96 rounded-2xl bg-black border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.2)] overflow-hidden group">
                    {/* Image */}
                    <img
                        src={imageUrl}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Destiny"
                        onError={(e) => {
                            // Fallback UI (Inject HTML directly on error)
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.innerHTML = `
                                <div class="w-full h-full flex flex-col items-center justify-center bg-[#1a0b1c] text-center p-6 border border-white/10">
                                    <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-2xl animate-pulse">✨</div>
                                    <h3 class="text-white font-serif text-lg tracking-widest uppercase mb-2">Mystic Card</h3>
                                    <p class="text-white/40 text-[10px] leading-relaxed">${imagePrompt}</p>
                                </div>
                            `;
                        }}
                    />
                </div>

                <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-serif italic text-white mb-4 border-b border-white/10 pb-4">"{summary}"</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="flex items-center gap-2 text-primary text-xs font-bold uppercase mb-2"><Icon name="Stars" className="w-3 h-3" /> 심층 분석</h4>
                            <p className="text-sm font-sans text-white/80 leading-relaxed text-justify opacity-90">{detail}</p>
                        </div>
                    </div>
                </div>

                <button onClick={() => onNavigate('LANDING')} className="w-full py-4 rounded-xl border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group">
                    <span>처음으로 돌아가기</span> <Icon name="ArrowRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

// --- APP ---
const App = () => {
    const [screen, setScreen] = useState('SPLASH');
    const [selectedCard, setSelectedCard] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async (text) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/analyze_dream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: selectedCard, user_context: text })
            });

            if (res.ok) {
                const data = await res.json();
                setResult({ luckScore: data.luck_score, description: data.interpretation });
            } else {
                throw new Error("Offline");
            }
        } catch {
            // FALLBACK (Offline Simulation)
            setTimeout(() => {
                setResult({
                    luckScore: 88,
                    description: `1. [한줄 요약]: 당신의 내면에 숨겨진 빛이 발현될 시기입니다.\n\n2. [심층 분석]: (오프라인) 현재 서버 연결이 원활하지 않아 예시 분석을 보여드립니다. 꿈에서 본 상징은 당신의 잠재력을 의미합니다.\n\n4. [이미지 프롬프트]: Magical crystals glowing in a dark cave, purple and blue light, fantasy art`
                });
            }, 1500);
        } finally {
            setIsAnalyzing(false);
            setScreen('RESULT');
        }
    };

    return (
        <div className="antialiased min-h-screen">
            <Background />
            {screen === 'SPLASH' && <SplashScreen onComplete={() => setScreen('LANDING')} />}
            {screen === 'LANDING' && <LandingScreen onNavigate={setScreen} />}
            {screen === 'SELECTION' && <SelectionScreen onNavigate={setScreen} onSelectType={setSelectedCard} />}
            {screen === 'INPUT' && <InputScreen onNavigate={setScreen} onSubmit={handleAnalyze} isAnalyzing={isAnalyzing} selectedCard={selectedCard} />}
            {screen === 'RESULT' && <ResultScreen onNavigate={setScreen} result={result} />}
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
