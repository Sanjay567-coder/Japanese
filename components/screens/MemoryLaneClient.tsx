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

  // Sync mute state and actually play/pause audio
  useEffect(() => {
    mutedRef.current = muted;
    const bg = bgRef.current;
    const song = songRef.current;
    if (!bg || !song) return;

    bg.muted = muted;
    song.muted = muted;

    if (muted) {
      bg.pause();
      song.pause();
    } else {
      if (luffyPlaying) {
        bg.pause();
        song.play().catch(() => {});
      } else {
        song.pause();
        bg.play().catch(() => {});
      }
    }
  }, [muted, luffyPlaying]);

  // Distribute 3 images across 5 pages: 1 -> 2 -> 3 -> 1 -> 2
  // This guarantees NO two consecutive pages share the same image.
  const cards = useMemo(() => [
    {
      id: "cover",
      num: 1,
      kana: "ゴウリサンカル先生へ",
      romaji: "GOWRISANKAR SENSEI",
      headline: "This is for\nyou, Sensei.",
      sub: "A small memory lane for the teacher who made Japanese feel warmer, closer, and easier to love.",
      cta: "Enter the lane",
      photo: images[0] || "/assets/images/image1.jpeg",
      hasAudio: false,
    },
    {
      id: "first-day",
      num: 2,
      kana: "最初の日",
      romaji: "THE FIRST DAY",
      headline: "A Song of\nAdventure.",
      sub: "Before a single textbook opened, you stood at the front of the room and sang. A joyful rendition of Luffy's theme song from One Piece. All academic anxiety evaporated instantly. We knew right then that this class would be a true adventure.",
      cta: null,
      photo: images[1] || "/assets/images/image2.jpeg",
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
      photo: images[2] || "/assets/images/image3.jpeg",
      hasAudio: false,
    },
    {
      id: "gratitude",
      num: 4,
      kana: "深い感謝",
      romaji: "DEEP GRATITUDE",
      headline: "A Profound\nThank You.",
      sub: "We are deeply grateful for your egalitarian approach to teaching. You never lectured from a pedestal, but worked alongside us like a fellow student—sharing in our breakthroughs, our confusions, and our growth.",
      cta: null,
      photo: images[0] || "/assets/images/image1.jpeg",
      hasAudio: false,
    },
    {
      id: "farewell",
      num: 5,
      kana: "さようなら",
      romaji: "We will miss you, Sensei.",
      headline: "We will miss\nyou, Sensei.",
      sub: "Thank you for every class, every correction, every smile, and every moment where you made us believe we could do better.",
      cta: "Walk again",
      photo: images[1] || "/assets/images/image2.jpeg",
      hasAudio: false,
    },
  ], [images]);

  const total = cards.length;
  const current = cards[page];

  // Initialize and manage audio lifecycle
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
      if (!mutedRef.current) bg.play().catch(() => {});
    };
    song.addEventListener("ended", handleSongEnded);

    // Interaction bypass to play audio
    const startOnInteraction = () => {
      if (bg.paused && !mutedRef.current) bg.play().catch(() => {});
      window.removeEventListener("pointerdown", startOnInteraction);
    };
    window.addEventListener("pointerdown", startOnInteraction, { once: true });

    // Initial play attempt
    bg.play().catch(() => {});

    return () => {
      song.removeEventListener("ended", handleSongEnded);
      bg.pause();
      song.pause();
      bgRef.current = null;
      songRef.current = null;
    };
  }, []);

  // Sync background music when Luffy's song toggles or page changes
  const toggleLuffy = useCallback(() => {
    const bg = bgRef.current;
    const song = songRef.current;
    if (!bg || !song) return;

    if (luffyPlaying) {
      song.pause();
      setLuffyPlaying(false);
      if (!mutedRef.current) bg.play().catch(() => {});
    } else {
      bg.pause();
      if (mutedRef.current) {
        setMuted(false); // Unmute globally if user explicitly clicks play
      }
      song.play()
        .then(() => setLuffyPlaying(true))
        .catch(() => { if (!mutedRef.current) bg.play().catch(() => {}); });
    }
  }, [luffyPlaying]);

  // Clean up Luffy audio when navigating away from the First Day card
  useEffect(() => {
    if (current.id !== "first-day" && luffyPlaying) {
      songRef.current?.pause();
      if (songRef.current) songRef.current.currentTime = 0;
      setLuffyPlaying(false);
      if (!mutedRef.current) bgRef.current?.play().catch(() => {});
    }
  }, [current.id, luffyPlaying]);

  // Page lifecycle events to pause/stop audio when hidden, closed, or unfocused
  useEffect(() => {
    const handleVisibilityChange = () => {
      const bg = bgRef.current;
      const song = songRef.current;
      if (!bg || !song) return;

      if (document.hidden) {
        bg.pause();
        song.pause();
      } else {
        if (!mutedRef.current) {
          if (current.id === "first-day" && luffyPlaying) {
            song.play().catch(() => {});
          } else {
            bg.play().catch(() => {});
          }
        }
      }
    };

    const handlePageHide = () => {
      if (bgRef.current) {
        bgRef.current.pause();
        bgRef.current.currentTime = 0;
      }
      if (songRef.current) {
        songRef.current.pause();
        songRef.current.currentTime = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, [current.id, luffyPlaying]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); navigate(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); navigate(-1); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX < -50) navigate(1);
    else if (diffX > 50) navigate(-1);
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 52 : -52 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -52 : 52 }),
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(circle at 50% 30%, #15101F 0%, #08070D 100%)",
        color: "#F0EBE2",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.015,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
        backgroundSize: "30px 30px",
      }} />
      {/* Corner glows */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "220px", height: "220px",
        pointerEvents: "none", opacity: 0.18,
        background: "radial-gradient(circle at 0% 0%, #C5A059 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, right: 0, width: "220px", height: "220px",
        pointerEvents: "none", opacity: 0.1,
        background: "radial-gradient(circle at 100% 100%, #4A2C6E 0%, transparent 70%)",
      }} />

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header style={{
        flexShrink: 0, width: "100%", maxWidth: "480px",
        margin: "0 auto", padding: "20px 24px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 30,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{
            fontSize: "10px", letterSpacing: "0.22em", color: "#C5A059",
            fontWeight: 600, textTransform: "uppercase",
          }}>
            {current.kana}
          </span>
          <span style={{
            fontSize: "9px", letterSpacing: "0.2em", color: "rgba(240,235,226,0.38)",
            fontWeight: 500, textTransform: "uppercase",
          }}>
            {current.romaji}
          </span>
        </div>
        <button
          id="mute-toggle-btn"
          onClick={() => setMuted((prev) => !prev)}
          aria-label={muted ? "Unmute Audio" : "Mute Audio"}
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(240,235,226,0.55)", cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0,
          }}
        >
          {muted ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </header>

      {/* ─── MAIN (flex-1) ──────────────────────────────────────── */}
      <main style={{
        flex: 1, minHeight: 0, width: "100%", maxWidth: "480px",
        margin: "0 auto", position: "relative", zIndex: 10, overflow: "hidden",
      }}>
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            style={{
              height: "100%", display: "flex", flexDirection: "column",
              justifyContent: "space-between", padding: "16px 24px 0",
            }}
          >
            {/* TEXT BLOCK — natural height */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Heading */}
              <h2 style={{
                fontFamily: "Noto Serif JP, Georgia, serif",
                fontSize: "clamp(1.85rem, 7.5vw, 2.75rem)",
                fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em",
                color: "#F0EBE2", whiteSpace: "pre-line", marginBottom: "8px",
              }}>
                {current.headline}
              </h2>

              {/* Body */}
              <p style={{
                fontSize: "clamp(0.85rem, 3.5vw, 0.9375rem)",
                lineHeight: 1.72, color: "rgba(240,235,226,0.72)",
                fontWeight: 300, marginBottom: "12px", maxWidth: "340px",
              }}>
                {current.sub}
              </p>

              {/* CTA Button */}
              {current.cta && (
                <button
                  id={current.id === "cover" ? "cover-cta-btn" : "memory-replay-btn"}
                  onClick={() => current.id === "cover" ? navigate(1) : jumpToPage(0)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    padding: "12px 22px", borderRadius: "100px",
                    fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#08070D", border: "none",
                    background: "linear-gradient(135deg, #C5A059 0%, #B8924A 100%)",
                    boxShadow: "0 6px 20px rgba(197,160,89,0.3), 0 2px 6px rgba(197,160,89,0.15)",
                    cursor: "pointer", marginBottom: "12px", width: "fit-content",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                >
                  <span>{current.cta}</span>
                  <span style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "rgba(0,0,0,0.12)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    {current.id === "cover" ? (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    ) : (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                      </svg>
                    )}
                  </span>
                </button>
              )}

              {/* Audio Card */}
              {current.hasAudio && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 16px", borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(197,160,89,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                  border: "1px solid rgba(197,160,89,0.22)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(197,160,89,0.12)",
                  maxWidth: "340px", marginBottom: "12px", backdropFilter: "blur(8px)",
                }}>
                  {/* Vinyl Disc */}
                  <motion.button
                    id="luffy-vinyl-btn"
                    onClick={toggleLuffy}
                    animate={luffyPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={luffyPlaying
                      ? { repeat: Infinity, duration: 5, ease: "linear" }
                      : { duration: 0.3 }}
                    style={{
                      width: "52px", height: "52px", borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "radial-gradient(circle at 40% 35%, #3A3A3A 0%, #1A1A1A 45%, #090909 100%)",
                      border: luffyPlaying ? "2px solid #C5A059" : "2px solid rgba(197,160,89,0.35)",
                      boxShadow: luffyPlaying
                        ? "0 0 18px rgba(197,160,89,0.35), 0 4px 12px rgba(0,0,0,0.5)"
                        : "0 4px 12px rgba(0,0,0,0.4)",
                      cursor: "pointer", position: "relative",
                      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    <div style={{ position: "absolute", inset: "6px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)" }} />
                    <div style={{ position: "absolute", inset: "12px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)" }} />
                    <div style={{
                      width: "16px", height: "16px", borderRadius: "50%",
                      background: "radial-gradient(circle, #C5302A 0%, #8E1E23 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.5)", zIndex: 2,
                    }}>
                      {luffyPlaying ? (
                        <svg width="5" height="5" viewBox="0 0 24 24" fill="white">
                          <rect x="4" y="4" width="5" height="16" rx="1" />
                          <rect x="15" y="4" width="5" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="5" height="5" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "1px" }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </motion.button>

                  {/* Track Info */}
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
                    <p style={{
                      fontSize: "13px", fontWeight: 600, color: "#F0EBE2",
                      letterSpacing: "0.01em", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      Luffy&apos;s Theme Song
                    </p>
                    <p style={{
                      fontSize: "10px", color: "rgba(240,235,226,0.45)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      Performed by Gowrisankar Sensei · Day One
                    </p>
                    <button
                      id="luffy-song-play-btn"
                      onClick={toggleLuffy}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: luffyPlaying ? "#F0EBE2" : "#C5A059",
                        background: "none", border: "none", padding: 0, cursor: "pointer",
                        width: "fit-content", marginTop: "1px", transition: "color 0.2s ease",
                      }}
                    >
                      {luffyPlaying ? "Pause Track" : "Play Track"}
                    </button>
                  </div>

                  {/* Waveform */}
                  <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                    {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={luffyPlaying ? { scaleY: [h, h * 0.4 + 0.2, h] } : { scaleY: 0.25 }}
                        transition={luffyPlaying ? {
                          duration: 0.55 + i * 0.09, repeat: Infinity,
                          ease: "easeInOut", delay: i * 0.07,
                        } : { duration: 0.3 }}
                        style={{
                          width: "3px", height: "20px", borderRadius: "2px",
                          background: luffyPlaying
                            ? "linear-gradient(to top, #C5A059, rgba(197,160,89,0.35))"
                            : "rgba(197,160,89,0.18)",
                          transformOrigin: "center",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PHOTO ZONE — takes remaining height, centers large photo card */}
            <div style={{
              flex: 1, minHeight: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              position: "relative", paddingBottom: "10px",
            }}>
              {current.photo && (
                <motion.div
                  key={`${current.id}-photo`}
                  initial={{ opacity: 0, y: 25, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "relative",
                    width: "clamp(200px, 64vw, 300px)",
                    height: "clamp(260px, 84vw, 390px)",
                    background: "#FAF8F5",
                    padding: "9px 9px 32px",
                    borderRadius: "14px",
                    boxShadow: "0 18px 45px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transform: `rotate(${page % 2 === 0 ? "-2deg" : "2deg"})`,
                    transformOrigin: "center center",
                  }}
                >
                  <div style={{
                    position: "relative", width: "100%", height: "100%",
                    borderRadius: "8px", overflow: "hidden", background: "#EBE7DF",
                  }}>
                    <Image
                      src={current.photo}
                      alt="Class Memory"
                      fill
                      priority
                      sizes="(max-width: 480px) 300px, 300px"
                      className="object-cover object-top"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── FOOTER / PAGINATION ────────────────────────────────── */}
      <footer style={{
        flexShrink: 0, width: "100%", padding: "10px 24px 18px",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 30,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 16px", borderRadius: "100px",
          background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
        }}>
          {cards.map((c, i) => (
            <button
              key={c.id}
              id={`pagination-btn-${i + 1}`}
              onClick={() => jumpToPage(i)}
              aria-label={`Go to section ${i + 1}`}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 600, letterSpacing: "0.02em",
                background: i === page ? "#F0EBE2" : "transparent",
                color: i === page ? "#08070D" : "rgba(240,235,226,0.38)",
                border: i === page
                  ? "1.5px solid rgba(240,235,226,0.8)"
                  : "1.5px solid rgba(255,255,255,0.07)",
                cursor: "pointer",
                transition: "background 0.25s ease, color 0.25s ease, transform 0.2s ease",
                transform: i === page ? "scale(1.12)" : "scale(1)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
