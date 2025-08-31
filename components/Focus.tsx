import React from 'react';
import type { Reflection } from '../types';

interface ReflectionsListScreenProps {
  reflections: Reflection[];
}

const ReflectionsListScreen: React.FC<ReflectionsListScreenProps> = ({ reflections }) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-6">Reflections</h1>
      
      {reflections.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/5 rounded-lg">
          <i className="fa-solid fa-lightbulb text-4xl text-teal-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-white">No Reflections Yet</h2>
          <p className="text-gray-400 mt-2">Your saved insights from completed sessions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reflections.map(reflection => (
            <div key={reflection.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-xs text-gray-400 mb-1">{reflection.date}</p>
              <p className="font-bold text-teal-300 mb-2">{reflection.stuckPointTitle}</p>
              <p className="text-gray-300 whitespace-pre-wrap">{reflection.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReflectionsListScreen;