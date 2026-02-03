import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, ChevronRight, Star, Wand2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---

// 1. Splash Screen
const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(onFinish, 3000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-center"
            >
                <div className="logo-icon">🔮</div>
                <h1 className="title">AI 꿈해몽</h1>
                <p className="subtitle">무의식의 메시지를 해석합니다</p>
            </motion.div>
            <div className="absolute bottom-8 text-xs text-gray-500 opacity-60">
                Premium Fortune Engine © 2026
            </div>
        </div>
    );
};

// 2. Main Home
const Home = ({ onStart }) => (
    <div className="flex flex-col h-full p-6 relative overflow-hidden justify-center max-w-md mx-auto w-full">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full filter blur-[100px] opacity-20 -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-[100px] opacity-20 -z-10"></div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
        >
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                오늘 밤,<br />무엇을 보셨나요?
            </h2>
            <p className="text-gray-300 text-sm">꿈은 당신의 미래를 비추는 거울입니다.</p>
        </motion.div>

        <div className="glass-container flex flex-col items-center justify-center space-y-6">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="magic-button group"
            >
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>무료 해몽 시작하기</span>
            </motion.button>
            <p className="text-xs text-gray-400 mt-4">* 하루 3회 무료 분석 제공</p>
        </div>

        {/* Ad Placeholder */}
        <div className="mt-auto h-14 bg-black/20 rounded-lg flex items-center justify-center text-gray-600 text-xs border border-white/5">
            [AD] Premium Banner Area
        </div>
    </div>
);

// 3. Dream Chat & Analysis
const DreamAnalysis = ({ onBack }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [showAd, setShowAd] = useState(false);

    // Production URL (Direct Render Connection)
    const API_URL = "https://dream-fortune-ai.onrender.com";

    const handleAnalyze = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setResult(null);

        // Simulate Ad Loading / Processing Time
        setTimeout(async () => {
            try {
                const response = await axios.post(`${API_URL}/analyze_dream`, {
                    content: input,
                    user_context: '모바일 앱 사용자'
                });

                setLoading(false);
                setShowAd(true); // Show Ad Modal before result
                setResult(response.data);

            } catch (error) {
                console.error("Analysis failed", error);
                setLoading(false);
                alert("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.\n" + (error.message || ""));
            }
        }, 2000);
    };

    const handleAdClose = () => {
        setShowAd(false);
    };

    if (showAd && result) {
        return (
            <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <Sparkles className="w-16 h-16 text-yellow-400 mb-6 animate-pulse" />
                <h3 className="text-2xl font-bold text-white mb-2">분석 완료</h3>
                <p className="text-gray-400 mb-8 text-sm">운명의 메시지가 도착했습니다.</p>

                <div className="w-full h-48 bg-gray-800 rounded-2xl mb-8 flex items-center justify-center border border-white/10">
                    <span className="text-gray-500 text-xs">[전면 광고: 운세 앱 다운로드]</span>
                </div>

                <button
                    onClick={handleAdClose}
                    className="magic-button w-full"
                >
                    결과 확인하기
                </button>
            </div>
        );
    }

    if (result) {
        return (
            <div className="flex flex-col h-full overflow-y-auto no-scrollbar pt-4 pb-20 px-4 max-w-md mx-auto w-full">
                <button onClick={() => setResult(null)} className="mb-4 text-gray-400 flex items-center text-sm self-start hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> 다시 하기
                </button>

                <div className="result-card">
                    <div className="glass-container border-t-4 border-t-yellow-400">
                        <div className="section-title">
                            <Star className="w-4 h-4 text-yellow-400" /> 한줄 요약
                        </div>
                        <p className="text-xl font-bold text-white leading-relaxed mb-1">
                            {result.interpretation.split('\n')[0].replace('1. [한줄 요약]:', '')}
                        </p>
                    </div>

                    <div className="glass-container">
                        <div className="section-title">🔮 심층 분석</div>
                        <div className="section-content whitespace-pre-wrap">
                            {result.interpretation}
                        </div>
                    </div>

                    <div className="glass-container bg-gradient-to-br from-indigo-900/50 to-purple-900/50">
                        <div className="section-title justify-center">✨ 행운의 숫자</div>
                        <div className="lotto-balls justify-center mt-4">
                            {result.lotto_numbers.map((num) => (
                                <span key={num} className="ball">{num}</span>
                            ))}
                        </div>
                        <div className="text-center mt-4 text-sm text-gray-400">
                            금전운 점수: <span className="text-yellow-400 font-bold">{result.luck_score}점</span>
                        </div>
                    </div>

                    <div className="h-20 bg-black/20 rounded-lg flex items-center justify-center text-gray-600 text-xs border border-white/5 mt-4">
                        [AD] Banner
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-md mx-auto w-full px-4 pt-4">
            <button onClick={onBack} className="self-start text-gray-400 mb-6 flex items-center text-sm hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> 뒤로가기
            </button>

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
            >
                <h2 className="text-2xl font-bold text-white mb-2">꿈의 내용을<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">구체적으로</span> 알려주세요.</h2>
                <p className="text-gray-400 text-xs mb-6">등장인물, 색깔, 감정을 자세히 적을수록 정확도가 올라갑니다.</p>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="예) 푸른 바다에서 거북이를 타고 용궁으로 가는 꿈을 꿨어요. 기분이 너무 상쾌했습니다..."
                    className="dream-input mb-4 focus:ring-2 focus:ring-purple-500"
                />

                <div className="mt-auto pb-6">
                    <button
                        onClick={handleAnalyze}
                        disabled={!input.trim() || loading}
                        className="magic-button disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <span className="loading-text text-white text-sm">운명을 읽는 중...</span>
                            </div>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span>무료 해몽하기</span>
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-500 mt-3">
                        AI 분석 결과는 참고용으로만 활용하세요.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// --- Main App ---
function App() {
    const [screen, setScreen] = useState('splash');

    return (
        <div className="w-full h-screen text-white overflow-hidden relative selection:bg-purple-500 selection:text-white">
            <AnimatePresence mode="wait">
                {screen === 'splash' && (
                    <motion.div key="splash" exit={{ opacity: 0, scale: 1.1 }} className="absolute inset-0 z-50 bg-[#1a0b2e]">
                        <SplashScreen onFinish={() => setScreen('home')} />
                    </motion.div>
                )}

                {screen === 'home' && (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                        className="absolute inset-0"
                    >
                        <Home onStart={() => setScreen('chat')} />
                    </motion.div>
                )}

                {screen === 'chat' && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-0 bg-[#1a0b2e]" // Ensure solid background for slide
                    >
                        <DreamAnalysis onBack={() => setScreen('home')} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
