import React, { useState } from 'react';
import type { ActiveSession } from '../types';

interface SessionScreenProps {
  session: ActiveSession;
  onSessionComplete: (reflectionText: string | null) => void;
}

type SessionStep = 
  | { type: 'intro' }
  | { type: 'prompt'; index: number }
  | { type: 'outro' }
  | { type: 'reflection' };

const SessionScreen: React.FC<SessionScreenProps> = ({ session, onSessionComplete }) => {
  const [step, setStep] = useState<SessionStep>({ type: 'intro' });
  const [reflectionText, setReflectionText] = useState('');

  const nextStep = () => {
    if (step.type === 'intro') {
      setStep({ type: 'prompt', index: 0 });
    } else if (step.type === 'prompt') {
      if (step.index < session.prompts.length - 1) {
        setStep({ type: 'prompt', index: step.index + 1 });
      } else {
        setStep({ type: 'outro' });
      }
    } else if (step.type === 'outro') {
        setStep({ type: 'reflection' });
    }
  };
  
  const handleSave = () => {
    onSessionComplete(reflectionText.trim());
  };

  const handleSkip = () => {
    onSessionComplete(null);
  };
  
  const renderContent = () => {
    switch (step.type) {
      case 'intro':
        return <StepView key="intro" title="Let's Begin" text={session.intro} buttonText="Start" onNext={nextStep} />;
      case 'prompt':
        const prompt = session.prompts[step.index];
        return <StepView key={`prompt-${step.index}`} title={prompt.title} text={prompt.text} buttonText="Next" onNext={nextStep} />;
      case 'outro':
        return <StepView key="outro" title="Session Complete" text={session.outro} buttonText="Capture Thoughts" onNext={nextStep} />;
      case 'reflection':
        return (
          <div className="flex flex-col h-full text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">Capture Your Thoughts</h2>
            <p className="text-gray-300 mb-6">What came up for you during that session? What feels clearer now?</p>
            <textarea
              className="w-full flex-grow bg-white/5 border border-white/10 rounded-lg p-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              placeholder="Jot down a quick note..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              autoFocus
            ></textarea>
            <div className="mt-6 flex gap-4">
                <button onClick={handleSkip} className="flex-1 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Skip</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors font-bold text-white">Save & Close</button>
            </div>
          </div>
        );
    }
  };
  
  return <div className="flex flex-col h-full">{renderContent()}</div>;
};


interface StepViewProps {
  title: string;
  text: string;
  buttonText: string;
  onNext: () => void;
}
const StepView: React.FC<StepViewProps> = ({ title, text, buttonText, onNext }) => {
  return (
    <div className="flex flex-col h-full text-center animate-fade-in justify-between">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        </div>
        <p className="text-xl md:text-2xl text-gray-300 my-auto">{text}</p>
        <button onClick={onNext} className="w-full py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors mt-8">
            {buttonText} <i className="fa-solid fa-arrow-right ml-2"></i>
        </button>
    </div>
  );
};

export default SessionScreen;
