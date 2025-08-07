// components/BacksoundPlayer.js

"use client";
import { useRef, useEffect } from 'react';

export default function BacksoundPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    audio.volume = 0.2;

    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.play().catch(e => console.error("Gagal memutar backsound:", e));
      }
    };

    audio.play().catch(() => {
      const events = ['click', 'touchstart', 'keydown', 'scroll'];
      events.forEach(event => window.addEventListener(event, handleFirstInteraction, { once: true }));
    });
  }, []);

  return (
    <audio ref={audioRef} src="/music/background-music.mp3" loop preload="auto" />
  );
}