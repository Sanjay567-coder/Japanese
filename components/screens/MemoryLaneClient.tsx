"use client";

import {
  useEffect, useRef, useState, useCallback, useMemo,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────── */
interface MemoryCard {
  id: string;
  type: "cover" | "firstDay" | "narrative" | "photo" | "gratitude" | "outro";
  label: string;
  title: string;
  body: string;
  image?: string;
  audioBtn?: boolean;
  replayBtn?: boolean;
}

interface MemoryLaneClientProps {
  images: string[];
}

/* ─── Helper: format card index ─────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, "0");

export default function MemoryLaneClient({ images }: MemoryLaneClientProps) {
  /* ── State ── */
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [luffyPlaying, setLuffyPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  /* ── Audio refs ── */
  const bgRef  = useRef<HTMLAudioElement | null>(null);
  const songRef = useRef<HTMLAudioElement | null>(null);

  /* ── Build cards dynamically from image list ── */
  const cards: MemoryCard[] = useMemo(() => [
    // ─ Cover card — uses first image as full-bleed
    {
      id: "cover",
      type: "cover",
      label: "Preface",
      title: "A Sensei's Legacy",
      body: "A teacher's influence is not merely written on tablets of stone, but gently etched onto the hearts of those who sat before them. What follows is a collection of the moments, melodies, and lessons shared with Gowrisankar Sensei — a tribute to the warmth, patience, and stories that turned an ordinary classroom into something worth remembering.",
      image: images[0],
    },
    // ─ First Day — audio card
    {
      id: "first-day",
      type: "firstDay",
      label: "Chapter I",
      title: "The First Day",
      body: "Before a single textbook was opened, before a syllabus was recited, Gowrisankar Sensei did something no one expected — he sang. Standing at the front of the class on day one, he delivered a heartfelt, completely unprompted rendition of Luffy's theme song from One Piece. The anxiety that had settled over a room full of beginners dissolved in an instant. He followed it with a story — an old one, personal, vivid — that wove itself around the meaning of a kanji in a way no definition ever could. In that first hour, it was clear: this was not going to be a typical class.",
      audioBtn: true,
    },
    // ─ More than a Sensei
    {
      id: "more-than",
      type: "narrative",
      label: "Chapter II",
      title: "More than a Teacher",
      body: "There is a particular kind of calm that a few rare people carry with them — the kind that does not announce itself, but simply fills a room. Gowrisankar Sensei had that. Composed, unhurried, steady — the quiet authority of someone who has nothing to prove. Paired with a smile that made even the most tangled grammar feel approachable, his presence was its own form of pedagogy. He had a gift for making the body part of the learning: acting out verbs, physiclizing vocabulary, turning rote memorization into something you could feel. His joy in the language was contagious. When he smiled, the whole class found itself smiling too.",
    },
    // ─ Dynamic photo cards — all remaining images
    ...images.slice(1).map((src, i): MemoryCard => ({
      id: `photo-${i}`,
      type: "photo",
      label: `Memory ${pad(i + 1)}`,
      title: "Captured in Time",
      body: "Moments like these — unguarded, unplanned — are the ones that last. The laughter between vocabulary drills, the expressions of someone finally understanding something difficult, the quiet satisfaction of a lesson well-taught. These photographs hold what no lesson plan could: the texture of the time we shared.",
      image: src,
    })),
    // ─ Gratitude
    {
      id: "gratitude",
      type: "gratitude",
      label: "Chapter III",
      title: "A Deep Gratitude",
      body: "We were fortunate — genuinely so. The exam strategies he offered will stay useful long after this course concludes, but they are only a fraction of what he gave us. More than techniques and tips, he gave us the rare experience of being taught by someone who treats their students as equals in curiosity. He did not lecture from a distance. He worked alongside us — through confusion, breakthrough, and everything between. His consistency, his patience, his refusal to make anyone feel small: these were gifts, and we received them.",
    },
    // ─ Outro
    {
      id: "outro",
      type: "outro",
      label: "Farewell",
      title: "Sayonara, Sensei",
      body: "This chapter ends, as all good things must. But what a sensei truly teaches never quite leaves — it lives in the way a student looks at a difficult thing with curiosity instead of fear, in the instinct to find the story inside the subject. Your smile will stay with this class. The lessons go far beyond the language. We bid you farewell with our deepest gratitude, our warmest wishes, and the hope that wherever you go next, you carry some measure of what you gave us. We will miss you.",
      replayBtn: true,
    },
  ], [images]);

  const total = cards.length;
  const current = cards[index];

  /* ─────────────────────── Audio engine ─────────────────────── */
  useEffect(() => {
    const bg   = new Audio("/assets/audio/background.mp3");
    const song = new Audio("/assets/audio/audio.mp3");

    bg.loop   = true;
    bg.volume = 0.13;
    song.volume = 0.8;

    bgRef.current   = bg;
    songRef.current = song;

    const onEnded = () => {
      setLuffyPlaying(false);
      bg.play().catch(() => {});
    };
    song.addEventListener("ended", onEnded);

    // Try autoplay; arm on first interaction if blocked
    bg.play().then(() => setAudioReady(true)).catch(() => {});

    const arm = () => {
      if (bg.paused) bg.play().then(() => setAudioReady(true)).catch(() => {});
      window.removeEventListener("pointerdown", arm);
    };
    window.addEventListener("pointerdown", arm, { once: true });

    return () => {
      song.removeEventListener("ended", onEnded);
      bg.pause();  bg.src   = "";
      song.pause(); song.src = "";
      bgRef.current   = null;
      songRef.current = null;
    };
  }, []);

  // Stop Luffy song when leaving Card 2
  useEffect(() => {
    if (current.id !== "first-day" && luffyPlaying) {
      songRef.current?.pause();
      if (songRef.current) songRef.current.currentTime = 0;
      setLuffyPlaying(false);
      bgRef.current?.play().catch(() => {});
    }
  }, [current.id, luffyPlaying]);

  const toggleLuffy = useCallback(() => {
    const bg   = bgRef.current;
    const song = songRef.current;
    if (!bg || !song) return;

    if (luffyPlaying) {
      song.pause();
      setLuffyPlaying(false);
      bg.play().catch(() => {});
    } else {
      bg.pause();
      song.play()
        .then(() => setLuffyPlaying(true))
        .catch(() => bg.play().catch(() => {}));
    }
  }, [luffyPlaying]);

  /* ──────────────────── Navigation ───────────────────────────── */
  const navigate = useCallback((dir: 1 | -1) => {
    setIndex(prev => {
      const next = prev + dir;
      if (next < 0 || next >= total) return prev;
      setDirection(dir);
      return next;
    });
  }, [total]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); navigate(1); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); navigate(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // Swipe (touch + mouse drag)
  const dragX = useMotionValue(0);
  const onDragEnd = useCallback((_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    if (offset.x < -60 || velocity.x < -400) navigate(1);
    else if (offset.x > 60 || velocity.x > 400) navigate(-1);
    dragX.set(0);
  }, [navigate, dragX]);

  /* ────────────────── Card-specific backgrounds ─────────────── */
  const cardBg: Record<MemoryCard["type"], string> = {
    cover:     "linear-gradient(160deg, #0B1220 0%, #1A2540 100%)",
    firstDay:  "linear-gradient(135deg, #101820 0%, #0F1C30 100%)",
    narrative: "linear-gradient(150deg, #F7F3ED 0%, #EDE5D8 100%)",
    photo:     "#0B0E14",
    gratitude: "linear-gradient(145deg, #FAF7F2 0%, #F0E9DC 100%)",
    outro:     "linear-gradient(155deg, #0A0D14 0%, #111827 100%)",
  };

  const isDark = ["cover", "firstDay", "photo", "outro"].includes(current.type);

  /* ─────────────── Framer variants ──────────────────────────── */
  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.97 }),
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#090C12", userSelect: "none" }}
    >
      {/* ── Ambient orb — shifts per card type ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ borderRadius: "50%", filter: "blur(90px)", zIndex: 0 }}
        animate={{
          background: isDark
            ? "radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(42,58,92,0.08) 0%, transparent 70%)",
          width:  "80vw",
          height: "80vw",
          top:    isDark ? "10%" : "30%",
          left:   isDark ? "20%" : "10%",
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* ── Full-screen card stack ── */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0, 0.22, 1] }}
          className="absolute inset-0 z-10"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
          style={{ x: dragX }}
        >
          {/* ───── COVER card ───── */}
          {current.type === "cover" && current.image && (
            <div className="relative w-full h-full">
              <Image
                src={current.image}
                alt="Gowrisankar Sensei"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ filter: "brightness(0.55) saturate(0.85)" }}
              />
              {/* Gradient scrim — text legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,10,18,0.96) 0%, rgba(8,10,18,0.5) 40%, rgba(8,10,18,0.15) 70%, transparent 100%)",
                }}
              />
              {/* Cover text */}
              <div className="absolute inset-0 flex flex-col justify-end px-8 pb-28 md:px-16 md:pb-32 max-w-3xl">
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.22em", color: "#C5A059", textTransform: "uppercase", marginBottom: "18px" }}
                >
                  {current.label} — A Tribute
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                  style={{ fontFamily: "Noto Serif JP, Georgia, serif", fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 300, color: "#F0EBE2", lineHeight: 1.1, marginBottom: "22px", letterSpacing: "-0.02em" }}
                >
                  {current.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.875rem,1.6vw,1.05rem)", color: "rgba(240,235,226,0.72)", lineHeight: 1.85, maxWidth: "560px", fontWeight: 300 }}
                >
                  {current.body}
                </motion.p>
              </div>
            </div>
          )}

          {/* ───── FIRST DAY card ───── */}
          {current.type === "firstDay" && (
            <div
              className="relative w-full h-full flex flex-col md:flex-row"
              style={{ background: cardBg.firstDay }}
            >
              {/* Left panel — vinyl player */}
              <div className="relative flex-none w-full md:w-2/5 flex flex-col items-center justify-center p-10 order-2 md:order-1"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                {/* Pulsing rings when playing */}
                {luffyPlaying && (
                  <>
                    {[1.8, 2.6, 3.4].map((scale, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-[#C5A059]/20"
                        style={{ width: "140px", height: "140px" }}
                        animate={{ scale: [1, scale], opacity: [0.5, 0] }}
                        transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                      />
                    ))}
                  </>
                )}

                {/* Vinyl disc */}
                <motion.button
                  id="luffy-vinyl-btn"
                  onClick={toggleLuffy}
                  animate={luffyPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={luffyPlaying
                    ? { repeat: Infinity, duration: 8, ease: "linear" }
                    : { duration: 0.4, ease: "easeOut" }
                  }
                  className="relative w-36 h-36 rounded-full focus:outline-none"
                  style={{
                    background: "radial-gradient(circle at 38% 38%, #3A3A3A 0%, #1A1A1A 55%, #111 100%)",
                    boxShadow: luffyPlaying
                      ? "0 0 0 3px #C5A059, 0 0 40px rgba(197,160,89,0.25), inset 0 0 30px rgba(0,0,0,0.6)"
                      : "0 0 0 2px rgba(197,160,89,0.5), inset 0 0 30px rgba(0,0,0,0.5)",
                    cursor: "pointer",
                  }}
                  aria-label={luffyPlaying ? "Pause Song" : "Play Luffy's Song"}
                >
                  {/* Groove rings */}
                  {[0.72, 0.56, 0.42].map((r, i) => (
                    <div key={i} className="absolute inset-0 rounded-full"
                      style={{
                        border: "1px solid rgba(255,255,255,0.06)",
                        margin: `${(1 - r) * 50}%`,
                        borderRadius: "50%",
                      }}
                    />
                  ))}
                  {/* Center label */}
                  <div
                    className="absolute w-12 h-12 rounded-full flex flex-col items-center justify-center"
                    style={{
                      top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "#B7282E",
                    }}
                  >
                    {luffyPlaying ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <rect x="5" y="4" width="4" height="16" rx="1" />
                        <rect x="15" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </motion.button>

                <p
                  className="mt-6 text-center"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "0.625rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C5A059", opacity: 0.85 }}
                >
                  {luffyPlaying ? "Now Playing" : "Tap to Play"}
                </p>
                <p
                  className="mt-1.5 text-center"
                  style={{ fontFamily: "Noto Serif JP, serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", maxWidth: "170px" }}
                >
                  Luffy&apos;s Theme — as sung on Day One
                </p>
              </div>

              {/* Right panel — narrative */}
              <div className="flex-1 flex flex-col justify-center px-10 py-12 md:px-14 order-1 md:order-2">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C5A059", marginBottom: "20px" }}>
                  {current.label}
                </p>
                <h2
                  style={{ fontFamily: "Noto Serif JP, Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,3rem)", fontWeight: 300, color: "#F0EBE2", lineHeight: 1.15, marginBottom: "24px", letterSpacing: "-0.015em" }}
                >
                  {current.title}
                </h2>
                <p
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.875rem,1.5vw,1.0rem)", color: "rgba(240,235,226,0.65)", lineHeight: 1.85, maxWidth: "480px", fontWeight: 300 }}
                >
                  {current.body}
                </p>

                {/* Play button — text form */}
                <motion.button
                  id="luffy-song-play-btn"
                  onClick={toggleLuffy}
                  className="mt-10 self-start inline-flex items-center gap-3 px-6 py-3 text-xs font-semibold uppercase tracking-widest"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    border: "1px solid rgba(197,160,89,0.4)",
                    color: "#C5A059",
                    background: "rgba(197,160,89,0.07)",
                    borderRadius: "2px",
                    letterSpacing: "0.14em",
                    cursor: "pointer",
                  }}
                  whileHover={{ background: "rgba(197,160,89,0.14)", borderColor: "rgba(197,160,89,0.7)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {luffyPlaying ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
                      Pause Song
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      Play Luffy&apos;s Song
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          )}

          {/* ───── NARRATIVE / GRATITUDE card ───── */}
          {(current.type === "narrative" || current.type === "gratitude") && (
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{ background: cardBg[current.type] }}
            >
              {/* Ghosted kanji watermark */}
              <div
                className="absolute select-none pointer-events-none"
                style={{
                  fontFamily: "Noto Serif JP, serif",
                  fontSize: "clamp(220px, 30vw, 380px)",
                  color: "rgba(42,58,92,0.04)",
                  right: "-2%",
                  bottom: "-5%",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {current.type === "narrative" ? "師" : "謝"}
              </div>

              {/* Left accent rule */}
              <div
                className="absolute left-0 top-[15%] bottom-[15%] w-[3px]"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(197,160,89,0.5), transparent)" }}
              />

              <div className="relative z-10 px-12 py-16 md:px-20 max-w-3xl">
                <p
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "#C5A059", marginBottom: "20px" }}
                >
                  {current.label}
                </p>
                <h2
                  style={{ fontFamily: "Noto Serif JP, Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,3rem)", fontWeight: 300, color: "#1A253C", lineHeight: 1.15, marginBottom: "28px", letterSpacing: "-0.015em" }}
                >
                  {current.title}
                </h2>
                {/* Thin gold rule */}
                <div style={{ width: "40px", height: "1px", background: "rgba(197,160,89,0.6)", marginBottom: "28px" }} />
                <p
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.9rem,1.5vw,1.05rem)", color: "#3A4A62", lineHeight: 1.9, maxWidth: "600px", fontWeight: 300 }}
                >
                  {current.body}
                </p>
              </div>
            </div>
          )}

          {/* ───── PHOTO card ───── */}
          {current.type === "photo" && current.image && (
            <div className="relative w-full h-full">
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-cover"
                style={{ filter: "brightness(0.6) saturate(0.8)" }}
              />
              {/* Bottom gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,8,14,0.92) 0%, rgba(6,8,14,0.4) 45%, transparent 100%)",
                }}
              />
              {/* Photo caption */}
              <div className="absolute bottom-0 left-0 right-0 px-8 pb-28 md:px-16 md:pb-32 max-w-2xl">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C5A059", marginBottom: "14px" }}>
                  {current.label}
                </p>
                <h2 style={{ fontFamily: "Noto Serif JP, Georgia, serif", fontSize: "clamp(1.4rem,3vw,2.5rem)", fontWeight: 300, color: "#F0EBE2", lineHeight: 1.2, marginBottom: "14px", letterSpacing: "-0.015em" }}>
                  {current.title}
                </h2>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.85rem,1.3vw,0.95rem)", color: "rgba(240,235,226,0.6)", lineHeight: 1.8, maxWidth: "480px", fontWeight: 300 }}>
                  {current.body}
                </p>
              </div>
            </div>
          )}

          {/* ───── OUTRO card ───── */}
          {current.type === "outro" && (
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{ background: cardBg.outro }}
            >
              {/* Ink wash texture */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(197,160,89,1) 0%, transparent 100%)",
                }}
              />
              {/* Large faded kanji */}
              <div
                className="absolute select-none pointer-events-none"
                style={{
                  fontFamily: "Noto Serif JP, serif",
                  fontSize: "clamp(280px, 40vw, 500px)",
                  color: "rgba(197,160,89,0.04)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                感
              </div>

              <div className="relative z-10 text-center px-8 md:px-16 max-w-2xl">
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "#C5A059", marginBottom: "20px", opacity: 0.8 }}>
                  {current.label}
                </p>
                <h2
                  style={{ fontFamily: "Noto Serif JP, Georgia, serif", fontSize: "clamp(2rem,4.5vw,3.75rem)", fontWeight: 300, color: "#F0EBE2", lineHeight: 1.1, marginBottom: "28px", letterSpacing: "-0.02em" }}
                >
                  {current.title}
                </h2>
                {/* Thin gold separator */}
                <div style={{ width: "40px", height: "1px", background: "rgba(197,160,89,0.5)", margin: "0 auto 28px" }} />
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.875rem,1.5vw,1.0rem)", color: "rgba(240,235,226,0.6)", lineHeight: 1.9, maxWidth: "520px", margin: "0 auto", fontWeight: 300 }}>
                  {current.body}
                </p>

                {/* Walk again button */}
                <motion.button
                  id="memory-replay-btn"
                  onClick={() => { setDirection(-1); setIndex(0); }}
                  className="mt-12 inline-flex items-center gap-3 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest mx-auto"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    border: "1px solid rgba(197,160,89,0.35)",
                    color: "#C5A059",
                    background: "rgba(197,160,89,0.06)",
                    borderRadius: "2px",
                    letterSpacing: "0.16em",
                    cursor: "pointer",
                  }}
                  whileHover={{ background: "rgba(197,160,89,0.12)", borderColor: "rgba(197,160,89,0.6)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38L20.77 8"/>
                  </svg>
                  Walk Again
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation: invisible click zones left / right ── */}
      <button
        onClick={() => navigate(-1)}
        disabled={index === 0}
        className="absolute left-0 top-0 h-full z-20 focus:outline-none"
        style={{ width: "clamp(48px, 10vw, 80px)", background: "transparent", border: "none", cursor: index === 0 ? "default" : "w-resize" }}
        aria-label="Previous"
      />
      <button
        onClick={() => navigate(1)}
        disabled={index === total - 1}
        className="absolute right-0 top-0 h-full z-20 focus:outline-none"
        style={{ width: "clamp(48px, 10vw, 80px)", background: "transparent", border: "none", cursor: index === total - 1 ? "default" : "e-resize" }}
        aria-label="Next"
      />

      {/* ── Arrow hint buttons (visible) ── */}
      <AnimatePresence>
        {index > 0 && (
          <motion.button
            key="prev-arrow"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
            }}
            aria-label="Previous slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </motion.button>
        )}
        {index < total - 1 && (
          <motion.button
            key="next-arrow"
            onClick={() => navigate(1)}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
            }}
            aria-label="Next slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Bottom HUD ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between px-6 pb-8 md:px-10 md:pb-10"
        style={{ pointerEvents: "none" }}
      >
        {/* Index */}
        <div style={{ pointerEvents: "auto" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(197,160,89,0.55)",
            }}
          >
            {pad(index + 1)}&thinsp;/&thinsp;{pad(total)}
          </span>
        </div>

        {/* Segment progress dots */}
        <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
              aria-label={`Go to card ${i + 1}`}
              style={{
                width: i === index ? "28px" : "6px",
                height: "4px",
                borderRadius: "2px",
                background: i === index ? "#C5A059" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), background 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Card label */}
        <div style={{ pointerEvents: "none", textAlign: "right" }}>
          <span
            style={{
              fontFamily: "Noto Serif JP, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              color: "rgba(197,160,89,0.5)",
            }}
          >
            {current.label}
          </span>
        </div>
      </div>

      {/* ── Top chrome — exit link ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
        <a
          href="/"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(197,160,89,0.55)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(197,160,89,1)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(197,160,89,0.55)")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Exit
        </a>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(197,160,89,0.45)",
          }}
        >
          Memory Lane
        </span>
      </div>
    </div>
  );
}
