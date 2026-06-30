"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { vocabWords, type VocabWord } from "@/lib/vocab-data";

// Layout positions for scattered word cloud effect (percentages, precomputed)
const POSITIONS = [
  { top: "12%", left: "8%", rotate: -8, fontSize: "1.6rem" },
  { top: "8%", left: "55%", rotate: 5, fontSize: "2.4rem" },
  { top: "28%", left: "30%", rotate: -3, fontSize: "1.3rem" },
  { top: "20%", left: "72%", rotate: 10, fontSize: "1.8rem" },
  { top: "50%", left: "12%", rotate: -12, fontSize: "2rem" },
  { top: "52%", left: "58%", rotate: 6, fontSize: "1.5rem" },
  { top: "68%", left: "35%", rotate: -5, fontSize: "2.2rem" },
  { top: "72%", left: "75%", rotate: 8, fontSize: "1.4rem" },
];

interface TooltipProps {
  word: VocabWord;
  onClose: () => void;
}

function WordTooltip({ word, onClose }: TooltipProps) {
  const { lang } = useLanguage();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(43,43,43,0.3)" }} />

      {/* Card */}
      <motion.div
        className="relative washi-card rounded-2xl p-8 max-w-sm w-full"
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 20px 60px rgba(43,43,43,0.2)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors"
          style={{ background: "rgba(201,163,123,0.2)", color: "var(--color-ink)" }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Word */}
        <div className="text-center mb-4">
          <div
            className="text-5xl mb-2"
            style={{ fontFamily: "Noto Serif JP, serif", color: "var(--color-indigo)" }}
          >
            {word.word}
          </div>
          {word.kana && (
            <div
              className="text-base mb-1"
              style={{ color: "var(--color-wood)", fontFamily: "Noto Sans JP, sans-serif" }}
            >
              {word.kana}
            </div>
          )}
          {word.romaji && (
            <div
              className="text-sm tracking-wide"
              style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif", opacity: 0.7 }}
            >
              {word.romaji}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "rgba(201,163,123,0.4)" }} />
          <span className="text-xs" style={{ color: "var(--color-hanko)" }}>🌸</span>
          <div className="flex-1 h-px" style={{ background: "rgba(201,163,123,0.4)" }} />
        </div>

        {/* Meaning */}
        <div className="text-center mb-4">
          <span
            className="text-xs tracking-widest uppercase block mb-1"
            style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
          >
            Meaning
          </span>
          <p
            className="text-base font-medium"
            style={{ color: "var(--color-ink)", fontFamily: "Inter, sans-serif" }}
          >
            {word.meaning}
          </p>
        </div>

        {/* Class memory */}
        {word.memory && (
          <div
            className="scroll-panel rounded-lg p-4 mt-4"
          >
            <span
              className="text-xs tracking-widest uppercase block mb-1"
              style={{ color: "var(--color-hanko)", fontFamily: "Inter, sans-serif" }}
            >
              {lang === "en" ? "Class Memory" : "クラスのきおく"}
            </span>
            <p
              className="text-sm italic leading-relaxed"
              style={{ color: "var(--color-ink)", opacity: 0.75, fontFamily: "Inter, sans-serif" }}
            >
              {word.memory}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function VocabPage() {
  const { t, lang } = useLanguage();
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((word: VocabWord) => {
    setSelectedWord(word);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedWord(null);
  }, []);

  // Keyboard escape to close tooltip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  return (
    <main
      className="relative min-h-screen pt-20 pb-16 px-4"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Page header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(201,163,123,0.15)",
              border: "1px solid rgba(201,163,123,0.4)",
            }}
          >
            <span className="text-sm">🖌️</span>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
            >
              Vocab Canvas
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-light mb-2"
            style={{ color: "var(--color-indigo)", fontFamily: "Noto Serif JP, serif" }}
          >
            {t(translations.vocab.title)}
          </h1>

          <p
            className="text-sm opacity-60 mb-2"
            style={{
              color: "var(--color-ink)",
              fontFamily: lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
            }}
          >
            {t(translations.vocab.subtitle)}
          </p>

          <motion.p
            className="text-xs"
            style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            👆 {t(translations.vocab.clickHint)}
          </motion.p>
        </motion.div>

        {/* Word canvas — relative container */}
        <div
          ref={containerRef}
          className="relative mx-auto rounded-3xl overflow-hidden"
          style={{
            height: "520px",
            background: "linear-gradient(135deg, #FAF6F0 0%, #F0E9DC 100%)",
            border: "1px solid rgba(201,163,123,0.3)",
            boxShadow: "inset 0 2px 20px rgba(201,163,123,0.1)",
          }}
        >
          {/* Subtle washi texture lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px pointer-events-none"
              style={{
                top: `${15 + i * 14}%`,
                background: "rgba(201,163,123,0.1)",
              }}
            />
          ))}

          {/* Watermark kanji */}
          <div
            className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
            aria-hidden="true"
          >
            <span
              style={{
                fontFamily: "Noto Serif JP, serif",
                fontSize: "14rem",
                color: "rgba(42,58,92,0.03)",
                lineHeight: 1,
              }}
            >
              語
            </span>
          </div>

          {/* Scattered vocabulary words */}
          {vocabWords.map((word, index) => {
            const pos = POSITIONS[index % POSITIONS.length];
            return (
              <motion.button
                key={word.id}
                id={`vocab-word-${word.id}`}
                className="absolute cursor-pointer select-none hover:z-20 focus-visible:z-20 rounded-lg px-2 py-1 transition-colors"
                style={{
                  top: pos.top,
                  left: pos.left,
                  fontSize: pos.fontSize,
                  rotate: `${pos.rotate}deg`,
                  fontFamily: "Noto Serif JP, serif",
                  color: index % 3 === 0 ? "var(--color-indigo)" : index % 3 === 1 ? "var(--color-hanko)" : "var(--color-wood)",
                  opacity: 0.8,
                  transformOrigin: "center",
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0.85, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.07, duration: 0.5, type: "spring" }}
                whileHover={{
                  scale: 1.15,
                  opacity: 1,
                  color: "var(--color-hanko)",
                  rotate: 0,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(word)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(word);
                  }
                }}
                aria-label={`${word.word} - ${word.meaning}`}
              >
                {word.word}
              </motion.button>
            );
          })}
        </div>

        {/* Word list below canvas for mobile accessibility */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vocabWords.map((word) => (
            <motion.button
              key={`list-${word.id}`}
              className="washi-card rounded-xl p-3 text-center cursor-pointer hover:shadow-md transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(word)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div
                className="text-base font-medium mb-0.5"
                style={{ fontFamily: "Noto Serif JP, serif", color: "var(--color-indigo)" }}
              >
                {word.word}
              </div>
              {word.romaji && (
                <div
                  className="text-xs"
                  style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
                >
                  {word.romaji}
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Back to hub */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--color-indigo)", fontFamily: "Inter, sans-serif" }}
          >
            <span>←</span>
            <span>{t(translations.common.backToHub)}</span>
          </Link>
        </motion.div>
      </div>

      {/* Word tooltip overlay */}
      <AnimatePresence>
        {selectedWord && (
          <WordTooltip word={selectedWord} onClose={handleClose} />
        )}
      </AnimatePresence>
    </main>
  );
}
