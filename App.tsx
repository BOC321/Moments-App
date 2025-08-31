import React, { useState, useEffect, useCallback } from 'react';
import type { StuckPoint, Reflection, Screen } from './types';
import HomeScreen from './components/Clock'; // Repurposed to HomeScreen
import SessionScreen from './components/Greeting'; // Repurposed to SessionScreen
import ReflectionsListScreen from './components/Focus'; // Repurposed to ReflectionsListScreen
import AboutScreen from './components/Attribution'; // Repurposed to AboutScreen

// --- DATA ---
const STUCK_POINTS: StuckPoint[] = [
  {
    id: 'decision-paralysis',
    title: 'Decision Paralysis',
    icon: 'fa-solid fa-code-branch fa-rotate-90',
    session: {
      intro: "You don't need to solve it all right now. You just need to shift your thinking. Let's start there.",
      prompts: [
        // FIX: Escaped apostrophe in "you're".
        { title: 'Entry', text: 'What is the actual decision you\'re trying to make, in one sentence?', duration: 2 },
        // FIX: Escaped apostrophe in "What's".
        { title: 'Unblocker', text: 'What\'s the real question you might be avoiding asking yourself?', duration: 3 },
        { title: 'Momentum', text: 'What is the smallest possible step that could make the decision easier?', duration: 2 },
      ],
      outro: "You've just made space to think. That matters. Well done."
    }
  },
  {
    id: 'mental-fog',
    title: 'Mental Fog',
    icon: 'fa-solid fa-cloud',
    session: {
        intro: "Clarity isn't found, it's created. Let's create a small clearing in the fog.",
        prompts: [
            { title: 'Entry', text: 'What feels foggy right now—but also important?', duration: 2 },
            { title: 'Unblocker', text: 'If the fog had a voice, what would it be whispering?', duration: 3 },
            { title: 'Momentum', text: 'What is one thing you know to be true, even in this fog?', duration: 2 },
        ],
        outro: "You've invited clarity. The fog may not be gone, but you've found your footing within it."
    }
  },
  {
    id: 'too-many-options',
    title: 'Too Many Options',
    icon: 'fa-solid fa-bullseye',
    session: {
        intro: "The goal isn't to find the 'perfect' path, but to choose a good one and start walking. Let's simplify.",
        prompts: [
            { title: 'Entry', text: 'List 3-5 of the options occupying your mind. Just name them.', duration: 2 },
            { title: 'Unblocker', text: 'Which option feels most energizing, even if it seems less practical?', duration: 3 },
            { title: 'Momentum', text: 'How could you test one of these options on a tiny scale this week?', duration: 2 },
        ],
        outro: "You've turned a tangled mess into distinct paths. The power is in choosing one to try."
    }
  },
  {
    id: 'stuck-at-the-start',
    title: 'Stuck at the Start',
    icon: 'fa-solid fa-shoe-prints',
    session: {
        intro: "The beginning is often the hardest part. Let's forget the mountain top and just focus on the first step.",
        prompts: [
            { title: 'Entry', text: 'What does the finished version of this project or task look like?', duration: 2 },
            // FIX: Escaped apostrophes in "you're" and "can't".
            { title: 'Unblocker', text: 'What is the story you\'re telling yourself about why you can\'t start?', duration: 3 },
            // FIX: Corrected a syntax error in the string by removing extra quotes around "can't fail" and escaping the apostrophe.
            { title: 'Momentum', text: 'What would a ridiculously small, can\'t fail first step look like?', duration: 2 },
        ],
        outro: "You've broken the inertia. The first step isn't just progress; it's a statement."
    }
  },
  {
    id: 'lost-momentum',
    // FIX: Escaped apostrophe in "I've".
    title: 'I\'ve Lost Momentum',
    icon: 'fa-solid fa-rotate',
    session: {
        intro: "Momentum is a cycle, not a straight line. It's okay to pause. Now, let's gently restart the engine.",
        prompts: [
            { title: 'Entry', text: 'Where were you when you last felt momentum? What were you doing?', duration: 2 },
            { title: 'Unblocker', text: 'What changed between then and now? Be honest and kind to yourself.', duration: 3 },
            { title: 'Momentum', text: 'What is one small action that could recreate a tiny piece of that past feeling?', duration: 2 },
        ],
        outro: "You've honored the pause and chosen to begin again. That is the essence of momentum."
    }
  },
];


// --- MAIN APP ---
const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedStuckPoint, setSelectedStuckPoint] = useState<StuckPoint | null>(null);
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
    setSelectedStuckPoint(stuckPoint);
    setScreen('session');
  };

  const handleSessionComplete = useCallback((reflectionText: string | null) => {
    if (reflectionText && selectedStuckPoint) {
      const newReflection: Reflection = {
        id: new Date().toISOString(),
        stuckPointTitle: selectedStuckPoint.title,
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
    setSelectedStuckPoint(null);
  }, [selectedStuckPoint, reflections, sessionCompletions]);

  const getWeeklyCompletions = () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return sessionCompletions.filter(ts => ts > oneWeekAgo).length;
  };
  
  const renderScreen = () => {
    switch (screen) {
      case 'session':
        return selectedStuckPoint && <SessionScreen stuckPoint={selectedStuckPoint} onSessionComplete={handleSessionComplete} />;
      case 'reflections':
        return <ReflectionsListScreen reflections={reflections} />;
      case 'about':
        return <AboutScreen />;
      case 'home':
      default:
        return <HomeScreen onSelectStuckPoint={handleSelectStuckPoint} stuckPoints={STUCK_POINTS} weeklyCompletions={getWeeklyCompletions()} />;
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