import React, { useState } from 'react';
import { Background } from './components/Background';
import { LandingScreen } from './screens/LandingScreen';
import { SelectionScreen } from './screens/SelectionScreen';
import { InputScreen } from './screens/InputScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { Screen, CardType } from './types';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.LANDING);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const navigate = (newScreen: Screen) => {
    // Smooth scroll to top when changing screens (simulating new page load)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScreen(newScreen);
  };

  const handleSelectCard = (type: CardType) => {
    setSelectedCard(type);
    console.log(`Selected destiny path: ${type}`);
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
        <InputScreen onNavigate={navigate} />
      )}

      {screen === Screen.RESULT && (
        <ResultScreen onNavigate={navigate} />
      )}

      {screen === Screen.HISTORY && (
        <HistoryScreen onNavigate={navigate} />
      )}
    </div>
  );
}