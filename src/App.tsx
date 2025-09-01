import React, { useState, useEffect } from 'react';
import { generateBackground } from './services/geminiService';
import Clock from './components/Clock.tsx';
import Greeting from './components/Greeting.tsx';
import Focus from './components/Focus.tsx';
import Loader from './components/Loader.tsx';
import Attribution from './components/Attribution.tsx';

const App: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const cachedImage = localStorage.getItem('backgroundImage');
        const cacheTimestamp = localStorage.getItem('backgroundImageTimestamp');
        const now = new Date().getTime();
        
        // Cache for 1 hour
        if (cachedImage && cacheTimestamp && now - parseInt(cacheTimestamp, 10) < 3600 * 1000) {
            setBackgroundImage(cachedImage);
        } else {
            const themes = ['serene landscape', 'abstract digital art', 'beautiful nature', 'calm morning sky', 'peaceful forest', 'tranquil ocean view'];
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];
            const imageB64 = await generateBackground(`${randomTheme}, high resolution, cinematic lighting`);
            const imageUrl = `data:image/png;base64,${imageB64}`;
            setBackgroundImage(imageUrl);
            localStorage.setItem('backgroundImage', imageUrl);
            localStorage.setItem('backgroundImageTimestamp', now.toString());
        }
      } catch (err) {
        console.error('Failed to generate background:', err);
        setError('Could not load a beautiful background for you. Using a fallback.');
        // Fallback to a Picsum image if Gemini fails
        setBackgroundImage('https://picsum.photos/1920/1080');
      } finally {
        setIsLoading(false);
        // Start fade-in animation after a short delay
        setTimeout(() => setShowContent(true), 100);
      }
    };
    
    fetchBackground();
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <Loader />
        <p className="mt-4 text-lg">Generating your personal space...</p>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <main
      className="w-screen h-screen bg-cover bg-center transition-opacity duration-1000"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={`w-full h-full bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <Clock />
          <Greeting />
          <Focus />
        </div>
        <Attribution />
      </div>
    </main>
  );
};

export default App;