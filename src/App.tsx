import React, { useState, useEffect, useCallback } from 'react';
import type { StuckPoint, Reflection, Screen, ActiveSession, ThinkingStats } from './types';
import HomeScreen from './components/Clock';
import SessionScreen from './components/Greeting';
import ReflectionsListScreen from './components/Focus';
import AboutScreen from './components/Attribution';
import { PROMPT_DATA } from './data/prompts';

// --- DATA ---
const STUCK_POINTS: StuckPoint[] = [
  { id: 'decision-paralysis', title: 'Decision Paralysis', icon: 'fa-solid fa-code-branch fa-rotate-90' },
  { id: 'mental-fog', title: 'Mental Fog', icon: 'fa-solid fa-cloud' },
  { id: 'too-many-options', title: 'Too Many Options', icon: 'fa-solid fa-bullseye' },
  { id: 'stuck-at-the-start', title: 'Stuck at the Start', icon: 'fa-solid fa-shoe-prints' },
  { id: 'lost-momentum', title: "I've Lost Momentum", icon: 'fa-solid fa-rotate' },
  { id: 'unfamiliar-territory', title: "I'm in Unfamiliar Territory", icon: 'fa-solid fa-map-location-dot' },
  { id: 'strategic-thinking', title: 'Need to Think Strategically', icon: 'fa-solid fa-chess' }
];


// --- HELPERS ---
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- MAIN APP ---
const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [sessionCompletions, setSessionCompletions] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedReflections = localStorage.getItem('momentumReflections');
      if (storedReflections) setReflections(JSON.parse(storedReflections));

      const storedCompletions = localStorage.getItem('momentumCompletions');
      if (storedCompletions) setSessionCompletions(JSON.parse(storedCompletions));
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  const handleSelectStuckPoint = (stuckPoint: StuckPoint) => {
    const data = PROMPT_DATA[stuckPoint.id];
    if (!data) return;

    const session: ActiveSession = {
      stuckPointTitle: stuckPoint.title,
      intro: data.intro,
      prompts: [
        { title: 'Entry', text: getRandomItem(data.prompts.entry) },
        { title: 'Unblocker', text: getRandomItem(data.prompts.unblocker) },
        { title: 'Momentum', text: getRandomItem(data.prompts.momentum) },
      ],
      outro: data.outro,
    };
    setActiveSession(session);
    setScreen('session');
  };

  const handleSessionComplete = useCallback((reflectionText: string | null) => {
    if (reflectionText && activeSession) {
      const newReflection: Reflection = {
        id: new Date().toISOString(),
        stuckPointTitle: activeSession.stuckPointTitle,
        text: reflectionText,
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      };
      const updatedReflections = [newReflection, ...reflections];
      setReflections(updatedReflections);
      localStorage.setItem('momentumReflections', JSON.stringify(updatedReflections));
    }
    
    const now = Date.now();
    const updatedCompletions = [...sessionCompletions, now];
    setSessionCompletions(updatedCompletions);
    localStorage.setItem('momentumCompletions', JSON.stringify(updatedCompletions));

    setScreen('home');
    setActiveSession(null);
  }, [activeSession, reflections, sessionCompletions]);

  const getThinkingStats = (): ThinkingStats => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - (now.getDay() * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    const sessionDuration = 10; // 10 minutes per session
    
    return {
      today: sessionCompletions.filter(ts => ts >= todayStart).length * sessionDuration,
      thisWeek: sessionCompletions.filter(ts => ts >= weekStart).length * sessionDuration,
      thisMonth: sessionCompletions.filter(ts => ts >= monthStart).length * sessionDuration,
      allTime: sessionCompletions.length * sessionDuration,
    };
  };

  const getWeeklyCompletionsCount = () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return sessionCompletions.filter(ts => ts > oneWeekAgo).length;
  };
  
  const renderScreen = () => {
    switch (screen) {
      case 'session':
        return activeSession && <SessionScreen session={activeSession} onSessionComplete={handleSessionComplete} />;
      case 'reflections':
        return <ReflectionsListScreen reflections={reflections} stats={getThinkingStats()} />;
      case 'about':
        return <AboutScreen />;
      case 'home':
      default:
        return <HomeScreen onSelectStuckPoint={handleSelectStuckPoint} stuckPoints={STUCK_POINTS} weeklyCompletions={getWeeklyCompletionsCount()} />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen md:h-[90vh] md:max-h-[800px] md:my-8 bg-slate-900 text-gray-200 font-sans rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto bg-gradient-to-b from-slate-900 to-teal-900 p-6">
            {renderScreen()}
        </div>
        <NavBar activeScreen={screen} setScreen={setScreen} />
    </div>
  );
};

// --- NAVBAR ---
interface NavBarProps {
  activeScreen: Screen;
  setScreen: (screen: Screen) => void;
}
const NavBar: React.FC<NavBarProps> = ({ activeScreen, setScreen }) => {
    const navItems = [
        { id: 'home', icon: 'fa-solid fa-house', label: 'Home' },
        { id: 'reflections', icon: 'fa-solid fa-circle-plus', label: 'Reflections' },
        { id: 'about', icon: 'fa-solid fa-user', label: 'About' },
    ];

    return (
        <nav className="bg-slate-800/70 backdrop-blur-sm flex justify-around items-center p-2 border-t border-slate-700">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setScreen(item.id as Screen)}
                    className={`flex flex-col items-center justify-center w-24 p-2 rounded-lg transition-colors duration-200 ${activeScreen === item.id ? 'text-white' : 'text-gray-500 hover:bg-slate-700/50 hover:text-gray-300'}`}
                    aria-label={item.label}
                >
                    <i className={`${item.icon} text-xl`}></i>
                    <span className="text-xs mt-1">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}

export default App;
