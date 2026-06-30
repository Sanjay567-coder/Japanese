"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/lib/audio-context";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

interface AudioPlayerProps {
  src: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    toggle,
    setVolume,
    seek,
    registerAudio,
    stopAudio,
  } = useAudio();
  const { t, lang } = useLanguage();
  const mountedRef = useRef(false);

  useEffect(() => {
    // Guard: only register once per mount (fixes StrictMode double-invoke in dev)
    if (mountedRef.current) return;
    mountedRef.current = true;
    registerAudio(src);

    return () => {
      stopAudio();
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]); // Only src as dep — registerAudio and stopAudio are stable

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, x / rect.width));
      seek(ratio * duration);
    },
    [seek, duration]
  );

  return (
    <div
      className="w-full max-w-lg mx-auto"
      style={{
        background: "linear-gradient(150deg, #FDFAF6 0%, #F5EDE0 100%)",
        borderRadius: "18px",
        border: "1px solid rgba(201,163,123,0.25)",
        boxShadow: "0 2px 12px rgba(43,43,43,0.06), 0 1px 2px rgba(43,43,43,0.04)",
        padding: "24px 28px",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.625rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-wood)",
              marginBottom: "3px",
            }}
          >
            {t(translations.memoryLane.audioCaption)}
          </p>
          <p
            style={{
              fontFamily: "Noto Serif JP, serif",
              fontSize: "0.9375rem",
              fontWeight: "500",
              color: "var(--color-indigo)",
            }}
          >
            ♪ {t(translations.memoryLane.audioLabel)}
          </p>
        </div>

        {/* Play / Pause button — positioned right */}
        <motion.button
          id="audio-play-btn"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: isPlaying
              ? "var(--color-indigo)"
              : "var(--color-hanko)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(183,40,46,0.25)",
            transition: "background 0.2s ease",
          }}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.06 }}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1.5" />
              <rect x="14" y="4" width="4" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "2px" }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Progress track */}
      <div
        className="relative mb-2 cursor-pointer rounded-full overflow-hidden"
        style={{
          height: "4px",
          background: "rgba(201,163,123,0.22)",
        }}
        onClick={handleSeek}
        role="slider"
        tabIndex={0}
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-label="Audio progress"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") seek(Math.min(currentTime + 5, duration));
          if (e.key === "ArrowLeft") seek(Math.max(currentTime - 5, 0));
        }}
      >
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${progress}%`,
            background: isPlaying
              ? "linear-gradient(90deg, var(--color-hanko), var(--color-wood))"
              : "var(--color-hanko)",
          }}
        />
        {/* Scrubber thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full transition-all"
          style={{
            left: `${progress}%`,
            transform: `translate(-50%, -50%)`,
            width: "10px",
            height: "10px",
            background: "var(--color-hanko)",
            boxShadow: "0 1px 4px rgba(183,40,46,0.4)",
            opacity: progress > 0 ? 1 : 0,
          }}
        />
      </div>

      {/* Time row */}
      <div
        className="flex justify-between mb-5"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.6875rem",
          color: "var(--color-wood)",
          opacity: 0.75,
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Volume row */}
      <div className="flex items-center gap-3">
        {/* Mute icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-wood)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 0.6, flexShrink: 0 }}
        >
          {volume === 0 ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </>
          )}
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1"
          style={{ accentColor: "var(--color-hanko)", height: "3px", cursor: "pointer" }}
          aria-label="Volume"
        />
        {/* Max icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-wood)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 0.6, flexShrink: 0 }}
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      </div>
    </div>
  );
}
