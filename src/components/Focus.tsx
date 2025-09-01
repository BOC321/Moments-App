import React, { useState, useEffect, KeyboardEvent } from 'react';
import type { AIAdvice } from '../types';
import { getAIAdvice } from '../services/geminiService';
import Loader from './Loader.tsx';

const Focus: React.FC = () => {
  const [focus, setFocus] = useState<string>('');
  const [isSet, setIsSet] = useState<boolean>(false);
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    const storedFocus = localStorage.getItem('dailyFocus');
    const storedTimestamp = localStorage.getItem('dailyFocusTimestamp');
    if (storedFocus && storedTimestamp) {
        const today = new Date().toDateString();
        if (new Date(storedTimestamp).toDateString() === today) {
            setFocus(storedFocus);
            setIsSet(true);
            const storedAdvice = localStorage.getItem('dailyAdvice');
            if(storedAdvice) {
                setAdvice(JSON.parse(storedAdvice));
            }
        } else {
            localStorage.removeItem('dailyFocus');
            localStorage.removeItem('dailyFocusTimestamp');
            localStorage.removeItem('dailyAdvice');
        }
    }
  }, []);

  const handleFocusSubmit = async () => {
    if (focus.trim() === '') return;
    setIsLoading(true);
    setError('');
    try {
      const aiResponse = await getAIAdvice(focus);
      setAdvice(aiResponse);
      setIsSet(true);
      localStorage.setItem('dailyFocus', focus);
      localStorage.setItem('dailyFocusTimestamp', new Date().toISOString());
      localStorage.setItem('dailyAdvice', JSON.stringify(aiResponse));
    } catch (err) {
      setError('The AI coach is resting. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFocusSubmit();
    }
  };

  const resetFocus = () => {
    setIsSet(false);
    setFocus('');
    setAdvice(null);
    localStorage.removeItem('dailyFocus');
    localStorage.removeItem('dailyFocusTimestamp');
    localStorage.removeItem('dailyAdvice');
  };

  if (!isSet) {
    return (
      <div className="mt-12 text-center w-full max-w-lg">
        <h2 className="text-2xl text-white font-medium">What is your main focus for today?</h2>
        <div className="relative mt-4">
            <input
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-b-2 border-white w-full text-center text-xl p-2 outline-none placeholder-white placeholder-opacity-70"
              placeholder="e.g., Launch my new project"
              disabled={isLoading}
            />
            {isLoading && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Loader small />
                </div>
            )}
        </div>
        {error && <p className="text-red-300 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-8 text-center w-full max-w-2xl bg-black bg-opacity-20 backdrop-blur-sm p-6 rounded-lg transition-all duration-500">
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-lg text-gray-200">TODAY'S FOCUS:</h3>
            <p className="text-3xl font-bold">{focus}</p>
        </div>
        <button onClick={resetFocus} title="Set new focus" className="text-gray-300 hover:text-white transition-colors">
          <i className="fa-solid fa-pen-to-square fa-lg"></i>
        </button>
      </div>

      {advice && (
        <div className="mt-6 text-left animate-fade-in">
          <div className="border-l-4 border-cyan-400 pl-4 mb-6">
            <p className="text-lg italic">"{advice.quote}"</p>
          </div>
          <p className="mb-4 text-gray-200">{advice.encouragement}</p>
          <h4 className="font-semibold text-lg mb-2 text-cyan-300">Your First Steps:</h4>
          <ul className="list-none space-y-2">
            {advice.steps.map((step, index) => (
              <li key={index} className="flex items-center">
                <i className="fa-regular fa-circle-check text-cyan-400 mr-3"></i>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Focus;