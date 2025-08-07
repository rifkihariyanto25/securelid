// components/BacksoundPlayer.js

"use client";
import { useRef, useEffect, useState } from 'react';

export default function BacksoundPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    // Set volume lebih rendah untuk narasi
    audio.volume = 0.15;

    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error("Gagal memutar backsound:", e));
      }
    };

    // Coba autoplay saat komponen dimount
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Jika autoplay gagal (kebijakan browser), tambahkan event listener untuk interaksi pengguna
        console.log("Autoplay diblokir oleh browser. Menunggu interaksi pengguna...");
        const events = ['click', 'touchstart', 'keydown', 'scroll'];
        events.forEach(event => window.addEventListener(event, handleFirstInteraction, { once: true }));
      });

    // Cleanup event listeners saat komponen unmount
    return () => {
      const events = ['click', 'touchstart', 'keydown', 'scroll'];
      events.forEach(event => window.removeEventListener(event, handleFirstInteraction));
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/audio/narasi-web.mp3" loop preload="auto" />
    </>
  );
}