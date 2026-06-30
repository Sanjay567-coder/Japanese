"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

interface AudioContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (v: number) => void;
  seek: (t: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  registerAudio: (src: string) => void;
  stopAudio: () => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const registeredSrc = useRef<string>("");
  const volumeRef = useRef<number>(0.75);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.75);

  /**
   * registerAudio — idempotent. Only creates/updates the Audio element when
   * src changes. Uses refs so the function identity never changes, preventing
   * AudioPlayer's useEffect from re-firing on re-renders.
   */
  const registerAudio = useCallback((src: string) => {
    // Already registered the same source — do nothing (fixes duplicate mount)
    if (registeredSrc.current === src && audioRef.current) return;

    // Tear down existing Audio element before creating a new one
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
    }

    const audio = new Audio(src);
    audio.volume = volumeRef.current;
    audioRef.current = audio;
    registeredSrc.current = src;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    // No cleanup return — cleanup happens when src changes or on unmount
  }, []); // Stable: no dependencies, uses refs only

  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        // State will be set by the 'play' event listener
      } catch {
        setIsPlaying(false);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      // State will be set by the 'pause' event listener
    }
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) play();
    else pause();
  }, [play, pause]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    volumeRef.current = clamped;
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const seek = useCallback((t: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setCurrentTime(t);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Full cleanup on provider unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
        registeredSrc.current = "";
      }
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        volume,
        play,
        pause,
        toggle,
        setVolume,
        seek,
        audioRef,
        registerAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
}
