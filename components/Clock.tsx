import React from 'react';
import type { StuckPoint } from '../types';

interface HomeScreenProps {
  onSelectStuckPoint: (stuckPoint: StuckPoint) => void;
  stuckPoints: StuckPoint[];
  weeklyCompletions: number;
}

const titleMap: { [key: string]: React.ReactNode } = {
  'Decision Paralysis': <>Decision<br/>Paralysis</>,
  'Mental Fog': <>Mental<br/>Fog</>,
  'Too Many Options': <>Too Many<br/>Options</>,
  'Stuck at the Start': <>Stuck at the<br/>Start</>,
  'I\'ve Lost Momentum': 'I\'ve Lost Momentum'
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectStuckPoint, stuckPoints, weeklyCompletions }) => {
  return (
    <div className="animate-fade-in flex flex-col h-full">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white leading-tight">
          Welcome.
          <br/>
          What's keeping you stuck today?
        </h1>
      </header>
      
      <main className="flex-grow grid grid-cols-2 gap-3">
        {stuckPoints.map((sp, index) => (
          <button
            key={sp.id}
            onClick={() => onSelectStuckPoint(sp)}
            className={`
              flex items-center p-4 rounded-2xl shadow-lg text-white
              transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-white/20
              bg-white/10 border border-white/20 backdrop-blur-sm
              ${index === stuckPoints.length - 1 ? 'col-span-2' : ''}
            `}
          >
            <i className={`${sp.icon} text-white text-2xl w-8 text-center`}></i>
            <span className="ml-3 text-base font-semibold text-left leading-snug">{titleMap[sp.title]}</span>
          </button>
        ))}
      </main>

      <footer className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          <i className="fa-solid fa-fire mr-2 text-orange-500"></i>
          {weeklyCompletions} Momentum Moment{weeklyCompletions !== 1 && 's'} this week
        </p>
      </footer>
    </div>
  );
};

export default HomeScreen;