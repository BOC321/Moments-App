import React from 'react';

const AboutScreen: React.FC = () => {
  return (
    <div className="animate-fade-in text-gray-300 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4">About Momentum</h1>
      
      <div>
        <h2 className="text-xl font-semibold text-teal-300 mb-2">What is a Momentum Moment?</h2>
        <p>
          A Momentum Moment is a guided, 10-minute structured thinking session designed to help you get mentally unstuck and regain cognitive momentum. 
          When you feel overwhelmed, foggy, or paralyzed by choice, these sessions provide a simple framework to create clarity and identify a path forward.
        </p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-teal-300 mb-2">The Moment Method</h2>
        <p>
          Created by Kate, The Moment Method is built on the principle that small shifts in perspective can unlock massive progress. It's not about finding the perfect answer, but about asking better questions. 
          This app brings that method to your fingertips, offering a quiet space to reflect, unblock, and move.
        </p>
      </div>
      
      <div>
        <a 
          href="https://boc321.github.io/MomentumMoment/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block text-teal-300 font-semibold hover:text-teal-200 transition-colors"
        >
          Learn More <i className="fa-solid fa-arrow-up-right-from-square text-xs ml-1"></i>
        </a>
      </div>
    </div>
  );
};

export default AboutScreen;
