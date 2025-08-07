

"use client";
import { useState, useRef, useEffect } from 'react';

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export default function NaratorPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true));
      }
    };
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        const events = ['click', 'touchstart', 'keydown', 'scroll'];
        events.forEach(event => window.addEventListener(event, handleFirstInteraction, { once: true }));
      });
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => {
      const shouldPlay = !prevIsPlaying;
      if (shouldPlay) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      return shouldPlay;
    });
  };

  return (
    <>
      <audio ref={audioRef} src="/music/narasi-web.mp3" loop preload="auto" />
      <button
        onClick={togglePlayPause}
        className="fixed bottom-5 right-5 z-50 bg-white/20 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label={isPlaying ? "Jeda narasi" : "Putar narasi"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </>
  );
}