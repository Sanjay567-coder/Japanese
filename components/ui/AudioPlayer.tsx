"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/lib/audio-context";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

interface AudioPlayerProps {
  src: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const { isPlaying, currentTime, duration, volume, toggle, setVolume, seek, registerAudio, stopAudio } =
    useAudio();
  const { t } = useLanguage();

  useEffect(() => {
    registerAudio(src);
    return () => {
      stopAudio();
    };
  }, [src, registerAudio, stopAudio]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      seek(ratio * duration);
    },
    [seek, duration]
  );

  return (
    <motion.div
      className="washi-card rounded-2xl p-5 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Title */}
      <div className="text-center mb-4">
        <p
          className="text-xs tracking-widest uppercase mb-1"
          style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
        >
          {t(translations.memoryLane.audioCaption)}
        </p>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-indigo)", fontFamily: "Noto Serif JP, serif" }}
        >
          ♪ {t(translations.memoryLane.audioLabel)}
        </p>
      </div>

      {/* Play button */}
      <div className="flex items-center justify-center mb-4">
        <motion.button
          id="audio-play-btn"
          onClick={toggle}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all"
          style={{
            background: "var(--color-hanko)",
            color: "white",
          }}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.07 }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full cursor-pointer mb-2 overflow-hidden"
        style={{ background: "rgba(201, 163, 123, 0.3)" }}
        onClick={handleSeek}
        role="slider"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-label="Audio progress"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") seek(Math.min(currentTime + 5, duration));
          if (e.key === "ArrowLeft") seek(Math.max(currentTime - 5, 0));
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--color-hanko), var(--color-wood))",
            width: `${progress}%`,
          }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Time display */}
      <div
        className="flex justify-between text-xs mb-4"
        style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-wood)"
          strokeWidth="2"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 rounded-full accent-hanko cursor-pointer"
          aria-label="Volume"
          style={{ accentColor: "var(--color-hanko)" }}
        />
      </div>
    </motion.div>
  );
}
