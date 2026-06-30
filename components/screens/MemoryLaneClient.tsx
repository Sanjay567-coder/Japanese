"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryLaneClientProps {
  images: string[];
}

export default function MemoryLaneClient({ images }: MemoryLaneClientProps) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(0);
  const [luffyPlaying, setLuffyPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const bgRef = useRef<HTMLAudioElement | null>(null);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);

  // Sync mute state ref
  useEffect(() => {
    mutedRef.current = muted;
    if (bgRef.current) bgRef.current.muted = muted;
    if (songRef.current) songRef.current.muted = muted;
  }, [muted]);

  // Handle card text & photo distribution
  const cards = useMemo(() => [
    {
      id: "cover",
      num: 1,
      kana: "ゴウリサンカル先生へ",
      romaji: "GOWRISANKAR SENSEI",
      headline: "This is for\nyou, Sensei.",
      sub: "A small memory lane for the teacher who made Japanese feel warmer, closer, and easier to love.",
      cta: "Enter the lane",
      photos: images.slice(0, 1),
    },
    {
      id: "first-day",
      num: 2,
      kana: "最初の日",
      romaji: "THE FIRST DAY",
      headline: "A Song of\nAdventure.",
      sub: "Before a single textbook opened, you stood at the front of the room and sang. A joyful rendition of Luffy's theme song from One Piece. All academic anxiety evaporated instantly. We knew right then that this class would be a true adventure.",
      cta: null,
      photos: images.slice(1, 2),
      hasAudio: true,
    },
    {
      id: "calm-presence",
      num: 3,
      kana: "穏やかな存在",
      romaji: "MORE THAN A TEACHER",
      headline: "A Reassuring\nPresence.",
      sub: "Carrying the quiet composure of Dhoni, your presence was defined by steady warmth and a reassuring smile. You made complex grammar feel simple, encouraging us to act out verbs and bring the vocabulary to life.",
      cta: null,
      photos: images.slice(0, 2),
    },
    {
      id: "gratitude",
      num: 4,
      kana: "深い感謝",
      romaji: "DEEP GRATITUDE",
      headline: "A Profound\nThank You.",
      sub: "We are deeply grateful for your egalitarian approach to teaching. You never lectured from a pedestal, but worked alongside us like a fellow student—sharing in our breakthroughs, our confusions, and our growth.",
      cta: null,
      photos: images.slice(1, 3),
    },
    {
      id: "farewell",
      num: 5,
      kana: "さようなら",
      romaji: "We will miss you, Sensei.",
      headline: "We will miss\nyou, Sensei.",
      sub: "Thank you for every class, every correction, every smile, and every moment where you made us believe we could do better.",
      cta: "Walk again",
      photos: images.slice(0, 3),
    },
  ], [images]);

  const total = cards.length;
  const current = cards[page];

  // Initialize and manage audio contexts
  useEffect(() => {
    const bg = new Audio("/assets/audio/background.mp3");
    const song = new Audio("/assets/audio/audio.mp3");

    bg.loop = true;
    bg.volume = 0.15;
    song.volume = 0.85;

    bgRef.current = bg;
    songRef.current = song;

    const handleSongEnded = () => {
      setLuffyPlaying(false);
      if (!mutedRef.current) {
        bg.play().catch(() => {});
      }
    };
    song.addEventListener("ended", handleSongEnded);

    // Play background music on load (browsers may require interaction)
    bg.play().catch(() => {});

    // Interaction fallback to start audio if blocked
    const startOnInteraction = () => {
      if (bg.paused && !mutedRef.current) {
        bg.play().catch(() => {});
      }
      window.removeEventListener("pointerdown", startOnInteraction);
    };
    window.addEventListener("pointerdown", startOnInteraction, { once: true });

    return () => {
      song.removeEventListener("ended", handleSongEnded);
      bg.pause();
      song.pause();
      bgRef.current = null;
      songRef.current = null;
    };
  }, []);

  // Sync background music stop/play when Luffy's song is toggled or page changes
  const toggleLuffy = useCallback(() => {
    const bg = bgRef.current;
    const song = songRef.current;
    if (!bg || !song) return;

    if (luffyPlaying) {
      song.pause();
      setLuffyPlaying(false);
      if (!mutedRef.current) {
        bg.play().catch(() => {});
      }
    } else {
      bg.pause();
      song.play()
        .then(() => setLuffyPlaying(true))
        .catch(() => {
          if (!mutedRef.current) bg.play().catch(() => {});
        });
    }
  }, [luffyPlaying]);

  // Clean up Luffy audio when navigating away from the First Day card
  useEffect(() => {
    if (current.id !== "first-day" && luffyPlaying) {
      songRef.current?.pause();
      if (songRef.current) songRef.current.currentTime = 0;
      setLuffyPlaying(false);
      if (!mutedRef.current) {
        bgRef.current?.play().catch(() => {});
      }
    }
  }, [current.id, luffyPlaying]);

  // Navigation handlers
  const navigate = useCallback((d: 1 | -1) => {
    setPage((prev) => {
      const next = prev + d;
      if (next < 0 || next >= total) return prev;
      setDir(d);
      return next;
    });
  }, [total]);

  const jumpToPage = useCallback((index: number) => {
    setDir(index > page ? 1 : -1);
    setPage(index);
  }, [page]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Touch swiping handler
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX < -50) {
      navigate(1);
    } else if (diffX > 50) {
      navigate(-1);
    }
  };

  // Card slide transition variants
  const slideVariants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? 100 : -100,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? -100 : 100,
    }),
  };

  return (
    <div
      className="relative w-screen h-[100dvh] overflow-hidden select-none flex flex-col justify-between"
      style={{
        background: "radial-gradient(circle at 50% 30%, #15101F 0%, #08070D 100%)",
        color: "#F0EBE2",
        fontFamily: "Inter, sans-serif",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Subtle Background Washi Grid Lines ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:30px_30px]" />

      {/* ── Global Header (Japanese Subtitle / Mute Control) ── */}
      <header className="relative z-30 w-full px-6 pt-6 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] font-semibold uppercase">
            {current.kana}
          </span>
          <span className="text-[9px] tracking-widest text-[#F0EBE2]/40 font-medium uppercase mt-0.5">
            {current.romaji}
          </span>
        </div>

        {/* Global Mute Toggle Button */}
        <button
          id="mute-toggle-btn"
          onClick={() => setMuted((prev) => !prev)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:text-[#C5A059] hover:border-[#C5A059]/30 hover:bg-white/10 transition-all active:scale-95"
          style={{ cursor: "pointer" }}
          aria-label={muted ? "Unmute Audio" : "Mute Audio"}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </header>

      {/* ── Main Viewport Stack ── */}
      <main className="relative flex-1 w-full max-w-lg mx-auto flex flex-col justify-start px-6 pt-8 z-10 overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="w-full flex-1 flex flex-col justify-between"
          >
            {/* Upper Content Box */}
            <div className="flex flex-col">
              {/* Giant Serif Header */}
              <h2
                className="text-[2.6rem] md:text-[3.2rem] font-bold tracking-tight leading-[1.08] text-[#F0EBE2] mb-6 whitespace-pre-line"
                style={{ fontFamily: "Noto Serif JP, Georgia, serif" }}
              >
                {current.headline}
              </h2>

              {/* Light Subtitle paragraph */}
              <p className="text-[0.95rem] md:text-[1rem] leading-relaxed text-[#F0EBE2]/70 font-light max-w-sm mb-6">
                {current.sub}
              </p>

              {/* Action Button (Enter the Lane / Walk Again) */}
              {current.cta && (
                <button
                  id={current.id === "cover" ? "cover-cta-btn" : "memory-replay-btn"}
                  onClick={() => (current.id === "cover" ? navigate(1) : jumpToPage(0))}
                  className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#08070D] transition-all hover:scale-103 active:scale-97 mb-6"
                  style={{
                    background: "linear-gradient(135deg, #C5A059 0%, #B8924A 100%)",
                    boxShadow: "0 6px 20px rgba(197, 160, 89, 0.25)",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                >
                  <span>{current.cta}</span>
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    {current.id === "cover" ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    )}
                  </span>
                </button>
              )}

              {/* Inline Vinyl Player Interface (Only on First Day Card) */}
              {current.hasAudio && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-sm mb-6">
                  {/* Rotating CD Disc */}
                  <motion.button
                    id="luffy-vinyl-btn"
                    onClick={toggleLuffy}
                    animate={luffyPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={luffyPlaying ? { repeat: Infinity, duration: 6, ease: "linear" } : { duration: 0.3 }}
                    className="relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "radial-gradient(circle, #2C2C2C 20%, #151515 21%, #090909 100%)",
                      border: luffyPlaying ? "2px solid #C5A059" : "2px solid rgba(197, 160, 89, 0.4)",
                      boxShadow: luffyPlaying ? "0 0 20px rgba(197, 160, 89, 0.25)" : "none",
                      cursor: "pointer",
                    }}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#B7282E] flex items-center justify-center">
                      {luffyPlaying ? (
                        <svg width="6" height="6" viewBox="0 0 24 24" fill="white">
                          <rect x="4" y="4" width="4" height="16" />
                          <rect x="16" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg width="6" height="6" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "1px" }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#F0EBE2] truncate">
                      Luffy&apos;s Theme Song
                    </p>
                    <p className="text-[10px] text-[#F0EBE2]/40 truncate mt-0.5">
                      Performed by Gowrisankar Sensei on Day One
                    </p>
                    <button
                      id="luffy-song-play-btn"
                      onClick={toggleLuffy}
                      className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] mt-1.5 inline-block"
                      style={{ cursor: "pointer" }}
                    >
                      {luffyPlaying ? "Pause Track" : "Play Track"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section: Overlapping Scattered Polaroid Collage Layout */}
            <div className="flex-1 relative min-h-[220px] max-h-[340px] w-full mt-4 flex items-end">
              {current.photos && current.photos.length > 0 && (
                <div className="absolute inset-x-0 bottom-4 h-full flex items-end justify-center">
                  {current.photos.map((src, idx) => {
                    // Position setups based on collage photo count to match screenshots
                    let rotate = "0deg";
                    let zIndex = 10;
                    let bottom = "0px";
                    let leftOffset = "50%";
                    let scale = "1";

                    if (current.photos.length === 1) {
                      rotate = "-2deg";
                      bottom = "10px";
                      leftOffset = "50%";
                    } else if (current.photos.length === 2) {
                      if (idx === 0) {
                        rotate = "-6deg";
                        leftOffset = "35%";
                        bottom = "15px";
                        zIndex = 10;
                      } else {
                        rotate = "4deg";
                        leftOffset = "65%";
                        bottom = "5px";
                        zIndex = 12;
                      }
                    } else if (current.photos.length >= 3) {
                      if (idx === 0) {
                        rotate = "-8deg";
                        leftOffset = "26%";
                        bottom = "20px";
                        zIndex = 10;
                        scale = "0.95";
                      } else if (idx === 1) {
                        rotate = "6deg";
                        leftOffset = "74%";
                        bottom = "30px";
                        zIndex = 11;
                        scale = "0.95";
                      } else {
                        rotate = "-1deg";
                        leftOffset = "50%";
                        bottom = "0px";
                        zIndex = 15;
                        scale = "1.05";
                      }
                    }

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute w-[150px] h-[200px] md:w-[170px] md:h-[220px] bg-[#FAF8F5] p-2.5 pb-8 rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col justify-between"
                        style={{
                          left: leftOffset,
                          bottom: bottom,
                          transform: `translateX(-50%) rotate(${rotate}) scale(${scale})`,
                          zIndex: zIndex,
                          transformOrigin: "bottom center",
                        }}
                      >
                        <div className="relative w-full h-full bg-[#EBE7DF] rounded-lg overflow-hidden flex-1">
                          <Image
                            src={src}
                            alt="Class Memory"
                            fill
                            sizes="170px"
                            className="object-cover object-top"
                          />
                        </div>
                        {/* Polaroid white edge bottom spacing is created via pb-8 */}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer Centered Pagination Pill Container ── */}
      <footer className="relative z-30 w-full pb-8 pt-4 flex items-center justify-center">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => jumpToPage(i)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all active:scale-90"
              style={{
                background: i === page ? "#F0EBE2" : "transparent",
                color: i === page ? "#08070D" : "rgba(240, 235, 226, 0.4)",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={`Go to section ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
