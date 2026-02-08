import React, { useState } from 'react';
import { Background } from './components/Background';
import { LandingScreen } from './screens/LandingScreen';
import { SelectionScreen } from './screens/SelectionScreen';
import { InputScreen } from './screens/InputScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { Screen, CardType, Fortune } from './types';

import { AdMob, BannerAdSize, BannerAdPosition, RewardAdOptions } from '@capacitor-community/admob';

const REWARD_AD_ID = 'ca-app-pub-9625149267611159/5587558816';
const BANNER_AD_ID = 'ca-app-pub-9625149267611159/8529318868';

export default function App() {
    const [credits, setCredits] = useState<number>(() => {
        const saved = localStorage.getItem('user_credits');
        const lastReset = localStorage.getItem('last_credit_reset');
        const today = new Date().toLocaleDateString();

        if (lastReset !== today) {
            localStorage.setItem('last_credit_reset', today);
            localStorage.setItem('user_credits', '1');
            return 1;
        }
        return saved ? parseInt(saved) : 1;
    });

    React.useEffect(() => {
        const initAdMob = async () => {
            await AdMob.initialize();
            await AdMob.showBanner({
                adId: BANNER_AD_ID,
                adSize: BannerAdSize.ADAPTIVE_BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0
            });
        };
        initAdMob();
    }, []);

    const updateCredits = (newCredits: number) => {
        setCredits(newCredits);
        localStorage.setItem('user_credits', newCredits.toString());
    };

    const showRewardAd = async () => {
        try {
            await AdMob.prepareRewardVideoAd({ adId: REWARD_AD_ID });
            const reward = await AdMob.showRewardVideoAd();
            if (reward) {
                updateCredits(credits + 1);
                return true;
            }
        } catch (e) {
            console.error("Ad failed", e);
            alert("광고 로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        return false;
    };

    const [screen, setScreen] = useState<Screen>(Screen.LANDING);
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);

    const navigate = (newScreen: Screen) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setScreen(newScreen);
    };

    const handleSelectCard = (type: CardType) => {
        setSelectedCard(type);
        console.log(`Selected destiny path: ${type}`);
    };

    const handleAnalyze = async (text: string) => {
        setIsAnalyzing(true);
        try {
            console.log("Analyzing:", text);
            // Call API
            const response = await fetch('https://dream-fortune-ai.onrender.com/analyze_dream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: selectedCard || 'DREAM',
                    user_context: text
                })
            });

            let luckScore = 0;
            let lottoNumbers: number[] = [];
            let resultText = "";
            let imageUrl = "";

            if (response.ok) {
                const data = await response.json();
                resultText = data.interpretation;
                luckScore = data.luck_score;
                lottoNumbers = data.lotto_numbers;
                imageUrl = data.image_url;
            } else {
                console.error("API Error");
                // Mock response matching the new 3-section format
                let mockResult = `1. [한줄 요약]: 우주의 기운이 당신을 감싸고 있습니다. (AI 연결 실패, 데모 모드)\n\n2. [심층 분석]: 현재 AI 서버와 연결되지 않아 오프라인 점술가가 대신 답변합니다. 당신의 내면에는 무한한 가능성이 잠재되어 있으며, 곧 좋은 기회가 찾아올 것입니다.\n\n3. [조언]: 잠시 서버를 확인하고 다시 시도해보세요.`

                if (selectedCard === 'ORACLE') mockResult = `1. [한줄 요약]: 금전운이 트이는 시기입니다. 💰\n\n2. [심층 분석]: 꿈속의 'FORTUNE'은 확실한 길조입니다. 막혔던 자금 흐름이 원활해지고 뜻밖의 수익을 기대할 수 있습니다.\n\n3. [조언]: 로또를 사거나 투자를 고려해보세요.`
                else if (selectedCard === 'SOUL') mockResult = `1. [한줄 요약]: 내면의 평화를 찾을 때입니다. 🧘\n\n2. [심층 분석]: 혼란스러운 마음이 가라앉고 있습니다. 당신의 영혼은 지금 휴식을 원하고 있으며, 직관력이 높아지는 시기입니다.\n\n3. [조언]: 명상을 통해 머리를 비우세요.`
                else if (selectedCard === 'DREAM') mockResult = `1. [한줄 요약]: 예지몽의 가능성이 있습니다. 🌙\n\n2. [심층 분석]: 당신의 꿈은 단순한 환상이 아니라 미래의 조각일 수 있습니다. 중요한 메시지가 숨겨져 있으니 기록해두는 것이 좋습니다.\n\n3. [조언]: 꿈 일기를 작성해보세요.`

                resultText = mockResult;
                luckScore = Math.floor(Math.random() * 100) + 1;
                lottoNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1);
            }

            // Construct Fortune Object
            const newFortune: Fortune = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                title: selectedCard || 'Destiny',
                description: resultText,
                type: 'Mystery',
                icon: selectedCard === 'DREAM' ? 'Moon' : selectedCard === 'ORACLE' ? 'Eye' : 'Heart',
                luckScore: luckScore,
                lotto: lottoNumbers,
                imageUrl: imageUrl || "https://picsum.photos/seed/mystic/400/600"
            };

            setCurrentFortune(newFortune);
            navigate(Screen.RESULT);

        } catch (error) {
            console.error("Fetch error", error);
            const fallbackFortune: Fortune = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                title: 'Offline',
                description: "Connection severed. The oracle is offline.",
                type: 'Flux',
                icon: 'Wind'
            };
            setCurrentFortune(fallbackFortune);
            navigate(Screen.RESULT);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="antialiased min-h-screen font-sans text-white">
            <Background />

            {screen === Screen.LANDING && (
                <LandingScreen onNavigate={navigate} />
            )}

            {screen === Screen.SELECTION && (
                <SelectionScreen onNavigate={navigate} onSelectType={handleSelectCard} />
            )}

            {screen === Screen.INPUT && (
                <InputScreen
                    onNavigate={navigate}
                    onSubmit={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                    selectedCard={selectedCard}
                    credits={credits}
                    onWatchAd={showRewardAd}
                    onUseCredit={() => updateCredits(credits - 1)}
                />
            )}

            {screen === Screen.RESULT && (
                <ResultScreen onNavigate={navigate} result={currentFortune} />
            )}

            {screen === Screen.HISTORY && (
                <HistoryScreen onNavigate={navigate} />
            )}
        </div>
    );
}
