
import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameBoard, { GameBoardHandle } from './components/GameBoard';
import Controller from './components/Controller';
// Firebase Imports
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "to-do-list-fcee4",
  appId: "1:735043072340:web:c6b7eada2ce5569dff58c1",
  storageBucket: "to-do-list-fcee4.firebasestorage.app",
  apiKey: "AIzaSyBhE_DQCvbK5591icOZS_2GlxbuvbRWUfk",
  authDomain: "to-do-list-fcee4.firebaseapp.com",
  messagingSenderId: "735043072340",
  measurementId: "G-ZZE861SVQY",
  projectNumber: "735043072340"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rankingRef = doc(db, "tetris", "rankings");

// 랭킹 타입 정의
interface RankItem {
  name: string;
  score: number;
}

const BuriburiPig = () => (
  <div className="absolute -bottom-2 -left-6 opacity-80 select-none pointer-events-none scale-75 transform -rotate-12">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="60" r="35" fill="#E8B0D5" stroke="black" strokeWidth="4" />
      <circle cx="40" cy="55" r="4" fill="black" />
      <circle cx="60" cy="55" r="4" fill="black" />
      <ellipse cx="50" cy="70" rx="12" ry="8" fill="#F1948A" stroke="black" strokeWidth="3" />
      <circle cx="45" cy="70" r="2" fill="black" />
      <circle cx="55" cy="70" r="2" fill="black" />
      <path d="M30,35 Q20,20 40,30" fill="#E8B0D5" stroke="black" strokeWidth="4" />
      <path d="M70,35 Q80,20 60,30" fill="#E8B0D5" stroke="black" strokeWidth="4" />
    </svg>
  </div>
);

const AdBanner = ({ position, className }: { position: 'top' | 'bottom' | 'inline' | 'vertical', className?: string }) => (
  <div className={`w-full overflow-hidden flex flex-col items-center justify-center py-4 ${className}`}>
    <span className="text-[10px] text-zinc-400 font-sans mb-2 uppercase tracking-widest opacity-60">ADVERTISEMENT</span>
    <div className={`w-full bg-zinc-50 border-[1px] border-dashed border-zinc-200 flex items-center justify-center text-zinc-300 text-[10px] rounded-md relative transition-all hover:bg-zinc-100 ${position === 'vertical' ? 'h-full min-h-[600px] w-[160px]' : 'min-h-[100px] sm:min-h-[120px]'}`}>
      {/* Google AdSense Unit */}
      <ins className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-9625149267611159"
        data-ad-slot="7783921045"
        data-ad-format={position === 'vertical' ? 'vertical' : 'auto'}
        data-full-width-responsive={position === 'vertical' ? 'false' : 'true'}></ins>
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </script>
      <div className="absolute flex flex-col items-center gap-1 pointer-events-none">
        <span className="font-bold">AD SLOT ({position})</span>
        <span className="text-[8px] opacity-70">광고 승인 후 여기에 표시됩니다</span>
      </div>
    </div>
  </div>
);

const SEOFooter = () => (
  <footer className="w-full bg-white border-t-[3px] border-black p-8 mt-16 font-sans">
    <div className="max-w-4xl mx-auto space-y-12">
      {/* 1. 소개 섹션 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-2xl font-black mb-5 flex items-center gap-2 text-[#3498DB]">🕹️ 테뚜리뚜 (Te-ttu-ri-ttu) 프로젝트 안내</h3>
          <p className="text-[15px] text-zinc-600 leading-relaxed mb-4">
            <strong>테뚜리뚜</strong>는 정통 퍼즐 게임의 형식을 빌려 현대적인 웹 환경에서 누구나 무료로 즐길 수 있도록 제작된 오픈 소스 기반 게임 엔진 프로젝트입니다.
            단순한 오락을 넘어 실시간 데이터 통신 기술인 Firebase를 활용하여 전 세계 사용자들과 자신의 점수를 공유하고 경쟁할 수 있는 커뮤니티형 게임 플랫폼을 지향합니다.
          </p>
          <p className="text-[14px] text-zinc-500 leading-relaxed">
            저희의 개발 철학은 "장벽 없는 즐거움"입니다. 저사양 기기나 모바일 브라우저에서도 끊김 없는 60FPS의 부드러운 게임 플레이를 보장하기 위해
            경량화된 렌더링 알고리즘을 적용하였으며, 복잡한 설치 과정 없이 URL 접속만으로 즉시 게임을 시작할 수 있습니다.
          </p>
        </div>
        <div className="bg-zinc-50 p-6 rounded-2xl border-2 border-zinc-100">
          <h3 className="text-lg font-bold mb-4 text-black">💎 웹 기술 스택 및 특징</h3>
          <ul className="text-sm text-zinc-600 space-y-3">
            <li className="flex gap-2"><span>✅</span> <strong>Real-time Ranking:</strong> Google Firestore NoSQL DB를 통한 초저지연 스코어 서버 구축</li>
            <li className="flex gap-2"><span>✅</span> <strong>React Hooks Architecture:</strong> 유지보수가 용이한 함수형 컴포넌트 기반 게임 로직 설계</li>
            <li className="flex gap-2"><span>✅</span> <strong>PWA Readiness:</strong> 오프라인에서도 실행 가능한 프로그레시브 웹 앱 기술 적용 예정</li>
            <li className="flex gap-2"><span>✅</span> <strong>AdSense Optimized:</strong> 엄격한 Google Ads 정책을 준수하는 청정한 광고 레이아웃</li>
          </ul>
        </div>
      </section>

      {/* 2. 전문적인 게임 가이드 섹션 */}
      <section className="border-y-2 border-zinc-100 py-10">
        <h3 className="text-xl font-bold mb-6 text-black flex items-center gap-2">🚀 테트리스 고득점을 위한 5가지 심화 전략 가이드</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="font-bold text-[#FF4B4B]">1. 무결점 수평 유지 (Flawless Stacks)</h4>
            <p className="text-sm text-zinc-600 leading-relaxed">
              가장 높은 점수를 얻기 위해서는 게임판의 표면을 최대한 평평하게 유지해야 합니다.
              높이 차이가 2칸 이상 발생하면 특정 블록(I-piece 등)에만 의존하게 되어 위험 상황이 발생할 확률이 급격히 높아집니다.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-[#2ECC71]">2. 콤보 가속도 시스템 활용</h4>
            <p className="text-sm text-zinc-600 leading-relaxed">
              테뚜리뚜는 연속으로 라인을 클리어할 때마다 기하급수적으로 점수가 상승하는 콤보 시스템을 탑재하고 있습니다.
              한 줄씩 지우기보다는 3~4줄을 모았다가 짧은 시간 안에 연속으로 터뜨리는 것이 랭킹 진입의 지름길입니다.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-[#3498DB]">3. NEXT & HOLD 전략의 조화</h4>
            <p className="text-sm text-zinc-600 leading-relaxed">
              블록이 내려오는 속도가 빨라질수록 시선은 현재 블록이 아닌 NEXT 창에 고정되어야 합니다.
              다음에 올 블록 3개를 미리 인지하고 현재 블록의 위치를 결정하는 '사전 배치' 능력이 고수의 척도입니다.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-[#9B59B6]">4. T-스핀 기술 습득</h4>
            <p className="text-sm text-zinc-600 leading-relaxed">
              일반적인 클리어보다 훨씬 높은 점수를 주는 T-스핀(T-Spin) 기술을 익히세요.
              블록이 구석에 끼었을 때 회전 기능을 활용해 틈새로 밀어 넣는 테크닉은 고득점 전략의 핵심입니다.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-[#F1C40F]">5. 벽 타기 및 소프트 드랍</h4>
            <p className="text-sm text-zinc-600 leading-relaxed">
              블록이 바닥에 닿기 직전까지 미세하게 위치를 조정하는 능력이 필요합니다.
              벽 쪽으로 블록을 밀착시키는 기술을 통해 불필요한 빈 공간을 최소화할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 테트리스의 유래와 효과 */}
      <section className="bg-[#FFF9E1]/50 p-8 rounded-2xl space-y-4">
        <h3 className="text-xl font-bold text-black border-l-4 border-[#3498DB] pl-3">📘 테트리스의 유래와 교육적 효과</h3>
        <p className="text-[15px] text-zinc-600 leading-relaxed">
          1984년 알렉세이 파지노프에 의해 탄생한 테트리스는 단순한 오락 이상의 가치를 지닙니다.
          다수의 심리학 연구에 따르면, 테트리스 플레이는 '공간 지각 능력' 향상과 '단기 기억력' 강화에 긍정적인 영향을 미칩니다.
          특히 복잡한 상황에서 신속하게 최선의 결정을 내려야 하는 게임의 특성은 문제 해결 능력 발달에 도움을 줍니다.
        </p>
        <p className="text-[14px] text-zinc-500 leading-relaxed italic">
          *테뚜리뚜는 이러한 고전 게임의 가치를 계승하며, 과도한 유료 결제 유도 없이 순수하게 게임의 재미와 두뇌 발달을 위한 환경을 제공할 것을 약속드립니다.
        </p>
      </section>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 text-xs text-zinc-400 border-t border-zinc-100">
        <div className="flex gap-6">
          <a href="/privacy.html" className="hover:text-black transition-colors font-medium">📄 개인정보처리방침 (Privacy Policy)</a>
          <a href="/terms.html" className="hover:text-black transition-colors font-medium">⚖️ 이용약관 (Terms of Service)</a>
        </div>
        <div className="text-right">
          <p className="mb-1 font-medium">공식 문의: support@te-ttu-ri-ttu.site</p>
          <p>© 2026-2027 Te-ttu-ri-ttu Global Project. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

const Modal = ({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-[3px] border-black rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-[12px_12px_0px_black]">
        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
          <h2 className="text-xl font-black">{title}</h2>
          <button onClick={onClose} className="font-black text-2xl leading-none hover:text-[#FF4B4B] transition-colors">×</button>
        </div>
        <div className="text-[13px] leading-relaxed text-zinc-700 font-sans space-y-6">
          {children}
        </div>
        <button onClick={onClose} className="w-full mt-8 bg-[#3498DB] text-white border-[3px] border-black py-4 rounded-xl font-black text-lg hover:bg-[#2980B9] transition-all active:translate-y-1">내용을 확인했습니다</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameOver'>('lobby');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<RankItem[]>([]);
  const [nextPiece, setNextPiece] = useState<{ shape: number[][], color: string } | null>(null);
  const [activeMeme, setActiveMeme] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const [isTop3Entry, setIsTop3Entry] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const scoreRef = useRef(0);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const gameRef = useRef<GameBoardHandle>(null);
  const memeTimeoutRef = useRef<number | null>(null);

  // Firestore High Score Ranking Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(rankingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHighScores(data.list || []);
      } else {
        // 초기 데이터가 없는 경우
        setDoc(rankingRef, { list: [] });
      }
    });
    return () => unsubscribe();
  }, [rankingRef]);

  // Footer event listeners for policy modals
  useEffect(() => {
    const openPrivacy = () => setShowPrivacy(true);
    const openTerms = () => setShowTerms(true);
    window.addEventListener('open-privacy', openPrivacy);
    window.addEventListener('open-terms', openTerms);
    return () => {
      window.removeEventListener('open-privacy', openPrivacy);
      window.removeEventListener('open-terms', openTerms);
    };
  }, []);

  const handleStart = useCallback(() => {
    setScore(0);
    scoreRef.current = 0;
    setLevel(1);
    setGameState('playing');
    setIsTop3Entry(false);
    setPlayerName('');
  }, []);

  const handleGameOver = useCallback(async () => {
    const finalScore = scoreRef.current;

    // Top 3 진입 확인
    const sortedScores = [...highScores].sort((a, b) => b.score - a.score);
    const isTop3 = sortedScores.length < 3 || finalScore > sortedScores[2]?.score;

    if (isTop3 && finalScore > 0) {
      setIsTop3Entry(true);
      setGameState('gameOver');
    } else {
      setGameState('gameOver'); // 모든 경우에 게임오버 화면은 보여줌 (광고 노출을 위해)
      setIsTop3Entry(false);
    }
  }, [highScores]);

  const submitScore = async () => {
    if (!playerName.trim()) return;

    const finalScore = scoreRef.current;
    const newRankings = [...highScores, { name: playerName, score: finalScore }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    await setDoc(rankingRef, { list: newRankings });
    setGameState('lobby');
    setIsTop3Entry(false);
    setShowRankings(true); // 저장 후 랭킹 보여주기
  };

  // 점수 기반 레벨 계산 함수
  // 레벨 N까지 필요한 총 점수 = 750 * (N-1) * (N+2)
  // 레벨업 난이도 3배 상향 조정
  const calculateLevelFromScore = useCallback((totalScore: number): number => {
    // 공식: 750 * (N-1) * (N+2) <= totalScore 를 만족하는 최대 N
    // 최대 레벨은 10으로 제한
    for (let n = 10; n >= 2; n--) {
      const requiredScore = 750 * (n - 1) * (n + 2);
      if (totalScore >= requiredScore) return n;
    }
    return 1;
  }, []);

  const handleScoreUpdate = useCallback((s: number) => {
    setScore(prev => {
      const newScore = prev + s;
      const newLevel = calculateLevelFromScore(newScore);
      if (newLevel > level) {
        setLevel(newLevel);
      }
      return newScore;
    });
  }, [calculateLevelFromScore, level]);

  const handleNextUpdate = useCallback((shape: number[][], color: string) => {
    setNextPiece({ shape, color });
  }, []);

  // handleLevelUp은 더 이상 GameBoard에서 호출되지 않지만 호환성을 위해 유지
  const handleLevelUp = useCallback((newLevel: number) => {
    // 점수 기반으로 레벨이 관리되므로 이 콜백은 무시됨
  }, []);

  const handleMemeShow = useCallback((text: string) => {
    if (memeTimeoutRef.current) window.clearTimeout(memeTimeoutRef.current);
    setActiveMeme(text);
    memeTimeoutRef.current = window.setTimeout(() => {
      setActiveMeme(null);
    }, 1500);
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#FFF9E1] min-h-screen">
      <header className="h-[50px] sm:h-[60px] px-2 sm:px-4 flex justify-between items-center bg-[#3498DB] border-b-[3px] border-black z-30 shadow-sm sticky top-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <svg width="40" height="35" viewBox="0 0 100 80" className="sm:w-[50px] sm:h-[44px]">
            <path d="M15,45 Q10,25 30,15 Q50,5 85,20 Q95,35 85,60 Q75,80 45,80 Q20,75 15,45" fill="#FFDBAC" stroke="black" strokeWidth="6" />
            <path d="M15,45 Q12,30 25,20 Q40,10 60,12 Q80,15 88,25 L85,20 Q50,5 30,15 Q10,25 15,45" fill="black" stroke="black" strokeWidth="2" />
            <circle cx="38" cy="45" r="7" fill="black" />
            <circle cx="73" cy="48" r="7" fill="black" />
            <path d="M45,65 Q55,72 65,65" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="hidden sm:flex bg-white px-2 py-0.5 border-[2px] border-black rounded-full items-center shadow-[2px_2px_0px_black]" id="version-badge">
            <span className="text-xs font-normal text-[#3498DB]">v1.4.2</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FFDD00] hover:bg-[#FFEB3B] text-black border-[2px] border-black px-2 py-0.5 rounded-lg text-xs font-normal flex items-center gap-1 transition-all shadow-[2px_2px_0px_black] active:translate-y-0.5 active:shadow-none whitespace-nowrap"
            title="최신 버전으로 강제 업데이트"
          >
            🔄 <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <div className="bg-[#FFDD00] px-2 py-0.5 border-[2px] border-black rounded-lg shadow-[2px_2px_0px_black] text-center min-w-[50px] sm:min-w-[70px]">
            <p className="text-[8px] sm:text-[10px] font-normal leading-none">SCORE</p>
            <p className="text-sm sm:text-lg font-medium leading-tight">{score}</p>
          </div>
          <button
            onClick={() => setShowRankings(true)}
            className="bg-white px-2 py-0.5 border-[2px] border-black rounded-lg shadow-[2px_2px_0px_black] text-center min-w-[50px] sm:min-w-[70px] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <p className="text-[8px] sm:text-[10px] font-normal leading-none">BEST</p>
            <p className="text-sm sm:text-lg font-medium leading-tight">{highScores[0]?.score || 0}</p>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden justify-center relative">
        {/* Left Side Banner (Desktop Only) */}
        <div className="hidden 2xl:flex items-center justify-end px-4 h-full absolute left-0 top-0 bottom-0 select-none">
          <AdBanner position="vertical" className="!w-[160px] !h-[600px] !py-0 !border-0 !bg-transparent" />
        </div>

        <div className="flex-1 flex flex-col w-full max-w-[1600px] relative z-10">
          {gameState !== 'playing' && <AdBanner position="top" className="max-w-4xl mx-auto" />}

          <main className="flex-1 w-full flex flex-col items-center p-1 overflow-hidden min-h-0">
            {gameState === 'lobby' ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="z-20 bg-[#FFDD00] border-[4px] border-black p-10 rounded-3xl shadow-[8px_8px_0px_black] flex flex-col items-center gap-6 w-[480px] max-w-[90vw] animate-in fade-in zoom-in duration-300">
                  <h1 className="text-3xl font-medium text-black text-center flex items-center gap-3" id="main-logo">🎮 테뚜리뚜</h1>
                  <p className="text-zinc-700 text-sm font-medium text-center leading-relaxed">
                    블록을 쌓고 전 세계인과 경쟁하세요!<br />지금 바로 고득점에 도전해보세요.
                  </p>
                  <button
                    onClick={handleStart}
                    className="w-full bg-[#FF4B4B] text-white border-[3px] border-black py-5 rounded-2xl font-medium text-2xl shadow-[5px_5px_0px_black] active:translate-y-1 active:shadow-none transition-all"
                  >
                    게임 시작
                  </button>
                  <div
                    onClick={() => setShowRankings(true)}
                    className="cursor-pointer hover:bg-black/5 p-2 rounded-xl transition-all flex flex-col items-center"
                  >
                    <p className="text-lg font-normal text-zinc-600">🏆 최고 점수: {highScores[0]?.score || 0}</p>
                    {highScores[0] && <p className="text-sm font-normal text-zinc-400">({highScores[0].name})</p>}
                  </div>
                </div>
              </div>
            ) : gameState === 'gameOver' ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="z-20 bg-white border-[4px] border-black p-8 rounded-3xl shadow-[8px_8px_0px_black] flex flex-col items-center gap-6 w-[400px] max-w-[90vw] animate-in slide-in-from-bottom duration-500">
                  <div className="text-center">
                    <h2 className="text-3xl font-black mb-2 text-[#FF4B4B]">{isTop3Entry ? 'NEW RECORD!' : 'GAME OVER'}</h2>
                    <p className="text-xl font-medium">최종 점수: {score}</p>
                  </div>

                  {isTop3Entry ? (
                    <div className="w-full flex flex-col gap-2">
                      <label className="text-sm font-bold ml-1">명예의 전당 등록 (이름 입력)</label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value.slice(0, 10))}
                        placeholder="닉네임 (최대 10자)"
                        className="w-full border-[3px] border-black p-3 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 ring-[#3498DB]/50"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && submitScore()}
                      />
                      <button
                        onClick={submitScore}
                        className="w-full mt-2 bg-[#3498DB] text-white border-[3px] border-black py-4 rounded-xl font-bold text-xl shadow-[4px_4px_0px_black] active:translate-y-1 active:shadow-none transition-all"
                      >
                        기록 남기기
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setGameState('lobby')}
                      className="w-full bg-[#3498DB] text-white border-[3px] border-black py-4 rounded-xl font-bold text-xl shadow-[4px_4px_0px_black] active:translate-y-1 active:shadow-none transition-all"
                    >
                      메인으로 돌아가기
                    </button>
                  )}



                  <button
                    onClick={handleStart}
                    className="text-zinc-400 text-sm font-medium underline hover:text-black transition-colors"
                  >
                    한 판 더 해보기
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-between h-full w-full max-w-[450px] py-1 sm:py-2">
                <div className="flex items-start gap-2 sm:gap-3 relative">
                  <BuriburiPig />
                  <GameBoard
                    ref={gameRef}
                    level={level}
                    onScoreUpdate={handleScoreUpdate}
                    onNextUpdate={handleNextUpdate}
                    onGameOver={handleGameOver}
                    onMemeShow={handleMemeShow}
                  />

                  <div className="flex flex-col gap-2 sm:gap-3 min-w-[70px] sm:min-w-[80px]">
                    <div className="bg-white border-[3px] border-black p-2 sm:p-3 rounded-xl shadow-[3px_3px_0px_black] flex flex-col items-center">
                      <p className="text-xs sm:text-sm font-normal mb-1 border-b-2 border-black w-full text-center pb-1">NEXT</p>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center">
                        {nextPiece && nextPiece.shape.map((row, y) => (
                          <div key={y} className="flex absolute" style={{ top: `${y * 12}px` }}>
                            {row.map((cell, x) => (
                              <div key={x} className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] ${cell ? 'border-[1px] sm:border-2 border-black rounded-[1px] sm:rounded-[2px]' : ''}`} style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#2ECC71] border-[3px] border-black py-1 sm:py-2 rounded-xl text-center shadow-[3px_3px_0px_black]">
                      <p className="text-sm sm:text-base font-normal text-white">LV.{level}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2 sm:py-4 bg-[#FF4B4B] border-[3px] border-black px-4 sm:px-6 rounded-2xl flex justify-center items-center z-20 shadow-[4px_4px_0px_black] w-full mt-2 sm:mt-4">
                  <Controller
                    onLeft={() => gameRef.current?.moveLeft()}
                    onRight={() => gameRef.current?.moveRight()}
                    onDown={() => gameRef.current?.moveDown()}
                    onRotate={() => gameRef.current?.rotate()}
                    onHardDrop={() => gameRef.current?.hardDrop()}
                  />
                </div>


              </div>
            )}
          </main>
        </div>

        {/* Right Side Banner (Desktop Only) */}
        <div className="hidden 2xl:flex items-center justify-start px-4 h-full absolute right-0 top-0 bottom-0 select-none">
          <AdBanner position="vertical" className="!w-[160px] !h-[600px] !py-0 !border-0 !bg-transparent" />
        </div>
      </div>

      {/* Policies Modals */}
      <Modal title="📄 개인정보처리방침 (Privacy Policy)" isOpen={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <p><strong>1. 총칙</strong>: 테뚜리뚜(이하 "서비스")는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다.</p>
        <p><strong>2. 개인정보의 수집 항목 및 방법</strong>: 본 서비스는 직접적인 회원가입을 받지 않으며, 실명 정보를 수집하지 않습니다. 다만, 명예의 전당 등록 시 사용자가 입력하는 닉네임과 게임 점수가 서버에 저장될 수 있습니다.</p>
        <p><strong>3. 쿠키(Cookie) 및 광고 식별자 사용</strong>: 본 사이트는 광고 게재를 위해 Google AdSense를 사용합니다. 구글은 이용자의 웹사이트 방문 내역을 바탕으로 맞춤형 광고를 제공하기 위해 쿠키를 사용하며, 이용자는 구글 광고 설정에서 이를 거부할 수 있습니다.</p>
        <p><strong>4. 제3자 정보 제공</strong>: 수집된 익명 점수 데이터는 랭킹 노출 외의 목적으로 제3자에게 제공되지 않습니다.</p>
        <p><strong>5. 데이터 보관 기간</strong>: 명예의 전당 기록은 서비스 운영 종료 시 혹은 운영자의 정책에 따라 삭제될 수 있습니다.</p>
      </Modal>

      <Modal title="⚖️ 이용약관 (Terms of Service)" isOpen={showTerms} onClose={() => setShowTerms(false)}>
        <p><strong>제1조 (목적)</strong>: 본 약관은 테뚜리뚜 프로젝트가 제공하는 웹 게임 서비스의 이용 조건 및 절차를 규정합니다.</p>
        <p><strong>제2조 (서비스의 제공)</strong>: 서비스는 365일 무상으로 제공되는 것을 원칙으로 하나, 서버 점검 및 기술적 오류 발생 시 일시적으로 중단될 수 있습니다.</p>
        <p><strong>제3조 (사용자의 권리 및 의무)</strong>: 사용자는 게임 시스템을 비정상적으로 조작하거나 핵(Hack)을 사용하여 랭킹을 조작해서는 안 됩니다. 적발 시 데이터가 삭제될 수 있습니다.</p>
        <p><strong>제4조 (지적 재산권)</strong>: 게임 내 사용된 모든 그래픽, 코드, 사운드 콘텐츠는 테뚜리뚜 프로젝트에 귀속됩니다.</p>
        <p><strong>제5조 (책임의 제한)</strong>: 제작자는 서비스 이용 중에 발생한 기기 오작동, 네트워크 연결 실패 등으로 인한 점수 누락에 대해 책임지지 않습니다.</p>
      </Modal>

      <Modal title="🏆 명예의 전당 (Top 3)" isOpen={showRankings} onClose={() => setShowRankings(false)}>
        <div className="flex flex-col gap-4 py-2">
          {highScores.length > 0 ? (
            highScores.map((rank, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-5 border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_black] ${i === 0 ? 'bg-[#FFDD00]' : i === 1 ? 'bg-[#E5E7EB]' : 'bg-[#FDE6D2]'
                  } transform transition-transform hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-5">
                  <span className="text-3xl font-black">{i + 1}st</span>
                  <span className="text-xl font-bold">{rank.name}</span>
                </div>
                <span className="text-2xl font-black">{rank.score.toLocaleString()}P</span>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-bold text-zinc-400">아직 등록된 기록이 없습니다.<br />첫 번째 전설이 되어보세요!</p>
            </div>
          )}
        </div>
      </Modal>

      {gameState === 'lobby' && <SEOFooter />}
    </div>
  );
};

export default App;
