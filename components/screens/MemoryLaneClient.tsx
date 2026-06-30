"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryLaneClientProps {
  images: string[];
}

export default function MemoryLaneClient({ images }: MemoryLaneClientProps) {
  const [activeCard, setActiveCard] = useState(0);
  const [luffyPlaying, setLuffyPlaying] = useState(false);
  const [audioArmed, setAudioArmed] = useState(false);

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const luffyAudioRef = useRef<HTMLAudioElement | null>(null);

  // Card Content Definition
  const fixedNarratives = {
    intro: {
      title: "A Sensei's Legacy",
      text: "A teacher's influence is not merely written on tablets of stone, but gently etched onto the hearts and minds of their students. This experience is a collection of the moments, melodies, and lessons shared with Gowrisankar Sensei—a tribute to the patience, humor, and stories that transformed our classroom into a sanctuary of true learning.",
    },
    firstDay: {
      title: "The First Day: A Song of Adventure",
      text: "On the very first day of our Japanese language class, before the heavy textbooks were opened or a single kanji character was written, Gowrisankar Sensei stood at the front of the room. Rather than reading through a routine syllabus, he began to sing—giving us a passionate, unprompted rendition of Luffy's theme song from One Piece. In that single, musical instant, the air of academic anxiety dissolved. We realized that this class would be an adventure, a place where language was not just memorized, but felt. Alongside the music, his storytelling breathed life into the kanji, proving that every brushstroke holds a soul.",
    },
    moreThanSensei: {
      title: "More than a Teacher",
      text: "In a world where teaching is often defined by distance and authority, Gowrisankar Sensei chose a different path. Carrying himself with the quiet, unflappable composure of Dhoni, his presence was defined by a steady warmth and a reassuring smile that made even the most complex grammar patterns feel accessible. He possessed a rare gift for practical learning—encouraging us to stand up, mime verbs, and physically perform vocabulary. His classroom was never a place for passive listening, but a stage where the Japanese language came alive.",
    },
    thankYou: {
      title: "A Deep Gratitude",
      text: "We count ourselves incredibly fortunate to have had him as our guide. The meticulous preparation tips and exam strategies he shared with us will remain invaluable tools long after our time in this classroom concludes. Yet, beyond the exam prep, we are deeply grateful for his egalitarian approach to teaching. He did not lecture from a pedestal; instead, he worked alongside us like a fellow student, sharing in our confusion, celebrating our breakthroughs, and offering constant, unwavering support.",
    },
    weWillMissYou: {
      title: "Sayonara, Sensei",
      text: "As this chapter closes, we bid a warm and sincere farewell to a teacher who gave us so much more than vocabulary list sheets and grammatical rules. Though the class has ended, the lessons of curiosity, warmth, and persistence you instilled in us will carry forward. Your smile will remain etched in our memories. Go forward with our deepest gratitude and best wishes. We will miss you, Sensei.",
    },
  };

  interface MemoryCard {
    type: string;
    title: string;
    text: string;
    image?: string;
    imageIndex?: number;
    audioBtn?: boolean;
    replayBtn?: boolean;
  }

  // Compile the cards dynamically based on the number of images
  const cards: MemoryCard[] = [
    // Card 1: Intro (Cover) - uses first image
    {
      type: "intro",
      title: fixedNarratives.intro.title,
      text: fixedNarratives.intro.text,
      image: images[0] || "/assets/images/image1.jpeg",
    },
    // Card 2: First Day (Audio Card)
    {
      type: "firstDay",
      title: fixedNarratives.firstDay.title,
      text: fixedNarratives.firstDay.text,
      audioBtn: true,
    },
    // Card 3: More Than Just a Sensei
    {
      type: "narrative",
      title: fixedNarratives.moreThanSensei.title,
      text: fixedNarratives.moreThanSensei.text,
    },
    // Dynamic Image Cards (except the first one which is on the cover, or all of them as gallery)
    ...images.slice(1).map((imgSrc, idx) => ({
      type: "image",
      title: `Captured Memories`,
      text: `Moments of laughter, learning, and collaboration. These snapshots capture the heart of our classroom journey—reminding us of the shared steps we took in mastering a beautiful language under your guidance.`,
      image: imgSrc,
      imageIndex: idx + 2,
    })),
    // Card Thank You
    {
      type: "narrative",
      title: fixedNarratives.thankYou.title,
      text: fixedNarratives.thankYou.text,
    },
    // Card We Will Miss You
    {
      type: "outro",
      title: fixedNarratives.weWillMissYou.title,
      text: fixedNarratives.weWillMissYou.text,
      replayBtn: true,
    },
  ];

  const totalCards = cards.length;

  // Initialize background audio
  useEffect(() => {
    if (typeof window === "undefined" || !window.Audio) return;

    const bgAudio = new Audio("/assets/audio/background.mp3");
    bgAudio.loop = true;
    bgAudio.volume = 0.12; // Muted low volume
    bgAudioRef.current = bgAudio;

    const luffyAudio = new Audio("/assets/audio/audio.mp3");
    luffyAudio.volume = 0.7; // Full volume
    luffyAudioRef.current = luffyAudio;

    const handleLuffyEnded = () => {
      setLuffyPlaying(false);
      if (bgAudioRef.current) {
        bgAudioRef.current.play().catch(() => {});
      }
    };

    luffyAudio.addEventListener("ended", handleLuffyEnded);

    // Try autoplay background music
    const startBgAudio = () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.play()
          .then(() => {
            setAudioArmed(true);
          })
          .catch(() => {
            // Autoplay blocked - wait for user interaction
          });
      }
    };

    startBgAudio();

    // Set user interaction listener to play audio if blocked
    const handleFirstInteraction = () => {
      if (bgAudioRef.current && bgAudioRef.current.paused) {
        bgAudioRef.current.play()
          .then(() => {
            setAudioArmed(true);
          })
          .catch(() => {});
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      // Complete teardown on unmount
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
      if (luffyAudioRef.current) {
        luffyAudioRef.current.pause();
        luffyAudioRef.current.removeEventListener("ended", handleLuffyEnded);
        luffyAudioRef.current = null;
      }
    };
  }, []);

  // Duck audio helper
  const handleLuffyToggle = useCallback(() => {
    if (!luffyAudioRef.current || !bgAudioRef.current) return;

    if (luffyPlaying) {
      luffyAudioRef.current.pause();
      setLuffyPlaying(false);
      // Resume background music
      bgAudioRef.current.play().catch(() => {});
    } else {
      // Pause background music
      bgAudioRef.current.pause();
      luffyAudioRef.current.play()
        .then(() => {
          setLuffyPlaying(true);
        })
        .catch(() => {
          // Play failed
          bgAudioRef.current?.play().catch(() => {});
        });
    }
  }, [luffyPlaying]);

  // Navigate away from Card 2 stops Luffy song
  useEffect(() => {
    if (activeCard !== 1 && luffyPlaying) {
      if (luffyAudioRef.current) {
        luffyAudioRef.current.pause();
        luffyAudioRef.current.currentTime = 0;
      }
      setLuffyPlaying(false);
      if (bgAudioRef.current) {
        bgAudioRef.current.play().catch(() => {});
      }
    }
  }, [activeCard, luffyPlaying]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveCard((prev) => Math.min(prev + 1, totalCards - 1));
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setActiveCard((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReplay = useCallback(() => {
    setActiveCard(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Framer Motion slide variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const [[page, direction], setPageDirection] = useState([0, 0]);

  const handleNextSlide = () => {
    if (activeCard < totalCards - 1) {
      setPageDirection([activeCard + 1, 1]);
      setActiveCard(activeCard + 1);
    }
  };

  const handlePrevSlide = () => {
    if (activeCard > 0) {
      setPageDirection([activeCard - 1, -1]);
      setActiveCard(activeCard - 1);
    }
  };

  const currentCardData = cards[activeCard];

  return (
    <div className="relative min-h-screen bg-[#111317] flex flex-col justify-between overflow-hidden py-6 select-none">
      {/* Dynamic Ambient Background based on Active Card Type */}
      <div className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000">
        <div
          className="absolute inset-0 opacity-40 transition-colors duration-1000"
          style={{
            background:
              activeCard === 0
                ? "radial-gradient(circle at 10% 20%, rgba(42,58,92,0.15) 0%, transparent 60%)"
                : activeCard === 1
                ? "radial-gradient(circle at 90% 10%, rgba(183,40,46,0.12) 0%, transparent 65%)"
                : "radial-gradient(circle at 50% 50%, rgba(201,163,123,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Subtle dynamic washi texture lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 px-6 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/hub"
          className="inline-flex items-center gap-2.5 text-xs tracking-widest text-[#C5A059] uppercase hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Hub
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span className="text-[10px] tracking-[0.2em] font-medium text-[#C5A059]/75 uppercase">
            Memory Lane
          </span>
        </div>
      </header>

      {/* Main Card Viewport */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 flex-1 flex items-center justify-center py-6">
        <div className="w-full relative overflow-hidden" style={{ minHeight: "480px" }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeCard}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 220, damping: 26 },
                opacity: { duration: 0.25 },
              }}
              className="w-full h-full flex flex-col md:flex-row items-stretch rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: "linear-gradient(145deg, #FAF7F2 0%, #F3ECE0 100%)",
                border: "1px solid rgba(197, 160, 89, 0.25)",
              }}
            >
              {/* Left Column: Image or Large Graphic Frame (shown if card has image) */}
              {currentCardData.image && (
                <div className="relative w-full md:w-1/2 min-h-[250px] md:min-h-0 bg-[#EFE9DF] overflow-hidden group">
                  <Image
                    src={currentCardData.image}
                    alt={currentCardData.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                    priority={activeCard === 0}
                  />
                  {/* Elegant vintage photo frame overlay effect */}
                  <div className="absolute inset-0 border-[12px] border-[#FAF7F2]/90 pointer-events-none" />
                  <div className="absolute inset-[12px] border border-[#C5A059]/30 pointer-events-none" />
                  {/* Subtle warm wash */}
                  <div className="absolute inset-0 bg-orange-900/5 mix-blend-multiply pointer-events-none" />
                </div>
              )}

              {/* Special Graphic Column for Card 2 (First Day Audio Card) */}
              {currentCardData.type === "firstDay" && (
                <div className="relative w-full md:w-1/2 min-h-[200px] md:min-h-0 bg-[#1A253C] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                  {/* Visualizer animation circles when luffy playing */}
                  {luffyPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 2.5], opacity: [0.15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        className="absolute w-24 h-24 rounded-full border border-[#C5A059]"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
                        transition={{ duration: 2, delay: 0.7, repeat: Infinity, ease: "easeOut" }}
                        className="absolute w-24 h-24 rounded-full border border-[#C5A059]"
                      />
                    </div>
                  )}

                  {/* Hanko stamp styled vinyl/record design */}
                  <motion.div
                    animate={luffyPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={luffyPlaying ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                    className="relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                    style={{
                      background: "radial-gradient(circle, #B7282E 20%, #151C2C 21%, #151C2C 100%)",
                      border: "3px solid #C5A059",
                    }}
                    onClick={handleLuffyToggle}
                  >
                    <div className="absolute inset-2 rounded-full border border-[#C5A059]/25 border-dashed" />
                    {/* Inner core text */}
                    <div className="text-white text-center font-serif text-[10px] tracking-widest font-light opacity-90 select-none">
                      <p className="font-jp text-lg leading-none mb-1">歌</p>
                      <p>LUFFY</p>
                    </div>
                  </motion.div>

                  <p className="text-[#C5A059] font-serif text-xs tracking-widest uppercase mt-6 opacity-85">
                    {luffyPlaying ? "Now Playing Luffy's Song" : "Tap to Play Theme Song"}
                  </p>
                  <p className="text-white/50 text-[10px] tracking-wider mt-1.5 max-w-[200px]">
                    (Theme from One Piece — performed on Day One)
                  </p>
                </div>
              )}

              {/* Text Content Column */}
              <div
                className={`flex-1 p-8 md:p-12 flex flex-col justify-between ${
                  !currentCardData.image && currentCardData.type !== "firstDay"
                    ? "md:max-w-2xl mx-auto text-center items-center"
                    : ""
                }`}
              >
                {/* Top Section */}
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-4 justify-start">
                    <span className="text-[11px] font-mono tracking-widest text-[#C5A059] font-medium">
                      0{activeCard + 1}
                    </span>
                    <div className="h-[1px] w-8 bg-[#C5A059]/40" />
                    <span className="text-[9px] tracking-[0.2em] uppercase text-slate-500 font-medium">
                      {currentCardData.type === "intro"
                        ? "Opening Notes"
                        : currentCardData.type === "image"
                        ? "Visual Archive"
                        : currentCardData.type === "outro"
                        ? "Closing Words"
                        : "Narrative"}
                    </span>
                  </div>

                  <h3
                    className="text-2xl md:text-3xl font-light text-[#1A253C] mb-6 leading-tight"
                    style={{ fontFamily: "Noto Serif JP, Georgia, serif" }}
                  >
                    {currentCardData.title}
                  </h3>

                  <p
                    className="text-sm md:text-base text-slate-700 leading-relaxed font-light"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.75",
                      maxWidth: "520px",
                    }}
                  >
                    {currentCardData.text}
                  </p>
                </div>

                {/* Bottom Action Section (for Audio or Replay buttons) */}
                <div className="mt-8 w-full flex items-center justify-start gap-4">
                  {currentCardData.audioBtn && (
                    <motion.button
                      id="luffy-song-play-btn"
                      onClick={handleLuffyToggle}
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all animate-fade-in"
                      style={{
                        background: luffyPlaying ? "#1A253C" : "var(--color-hanko)",
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {luffyPlaying ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="4" y="4" width="4" height="16" />
                            <rect x="16" y="4" width="4" height="16" />
                          </svg>
                          Pause Song
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Play Luffy's Song
                        </>
                      )}
                    </motion.button>
                  )}

                  {currentCardData.replayBtn && (
                    <motion.button
                      id="memory-replay-btn"
                      onClick={handleReplay}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-[#1A253C] border border-[#1A253C]/20 hover:bg-[#1A253C]/5 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                      Walk Again
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation Bar */}
      <footer className="relative z-10 px-6 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        {/* Progress Tracker Numbers */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-wider text-[#C5A059]/50">INDEX</span>
          <span className="font-serif text-lg text-[#C5A059] tracking-widest">
            0{activeCard + 1} <span className="opacity-45 text-sm">/</span> 0{totalCards}
          </span>
        </div>

        {/* Minimal Progress Slider */}
        <div className="flex-1 max-w-[200px] sm:max-w-xs mx-4 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-[#C5A059] rounded-full"
            style={{ width: `${((activeCard + 1) / totalCards) * 100}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          />
        </div>

        {/* Dynamic Pagination Slide Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevSlide}
            disabled={activeCard === 0}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#C5A059] disabled:opacity-20 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-colors bg-white/5 hover:bg-white/10"
            aria-label="Previous Slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={handleNextSlide}
            disabled={activeCard === totalCards - 1}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#C5A059] disabled:opacity-20 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-colors bg-white/5 hover:bg-white/10"
            aria-label="Next Slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
