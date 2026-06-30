"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import type { StudentMessage } from "@/lib/messages-data";
import { translations } from "@/lib/translations";

interface EmaCardProps {
  message: StudentMessage;
  index: number;
}

export default function EmaCard({ message, index }: EmaCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { t, lang } = useLanguage();

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const messageText = lang === "en" ? message.en : message.ja;

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ perspective: "1000px", minHeight: "200px" }}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      aria-label={flipped ? "Click to flip back" : "Click to read message"}
    >
      <motion.div
        className="w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front — Ema tablet */}
        <div
          className="absolute inset-0 rounded-xl p-5 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(145deg, #C9A37B 0%, #A8845A 60%, #8B6B42 100%)",
            boxShadow: "0 8px 24px rgba(43, 43, 43, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.15)",
          }}
        >
          {/* Hanging hole decoration */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-white/40"
            style={{
              background: "radial-gradient(circle, #D4A853 0%, #B8842A 100%)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          />

          {/* Decorative rope lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-amber-800/40" />

          {/* Japanese text decoration */}
          <div
            className="text-center mb-3"
            style={{ fontFamily: "Noto Serif JP, serif", color: "rgba(255,255,255,0.95)" }}
          >
            <div className="text-3xl mb-1">絵馬</div>
            <div className="text-xs tracking-widest opacity-70">EMA</div>
          </div>

          {/* Tap hint */}
          <div
            className="text-xs mt-2 py-1.5 px-3 rounded-full"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.9)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {t(translations.arigatou.tapHint)}
          </div>

          {/* Subtle wood grain lines */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            {[0.2, 0.4, 0.6, 0.8].map((opacity, i) => (
              <div
                key={i}
                className="absolute w-full h-px"
                style={{
                  top: `${20 + i * 18}%`,
                  background: `rgba(255,255,255,${opacity * 0.08})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Back — Message */}
        <div
          className="absolute inset-0 rounded-xl p-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #FAF6F0 0%, #F5EFE6 100%)",
            boxShadow: "0 8px 24px rgba(43, 43, 43, 0.15)",
            border: "1px solid rgba(201, 163, 123, 0.4)",
          }}
        >
          {/* Decorative top border */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
            style={{ background: "linear-gradient(90deg, var(--color-wood), var(--color-hanko), var(--color-wood))" }}
          />

          {/* Message text */}
          <div className="flex-1 flex items-center pt-3">
            <p
              className="text-sm leading-relaxed text-center"
              style={{
                color: "var(--color-ink)",
                fontFamily:
                  lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
                lineHeight: lang === "ja" ? "2" : "1.7",
              }}
            >
              {messageText}
            </p>
          </div>

          {/* Attribution */}
          <div className="text-center pt-3 border-t border-wood/20">
            <span
              className="text-xs"
              style={{ color: "var(--color-wood)", fontFamily: "Noto Serif JP, serif" }}
            >
              — {t(translations.arigatou.from)}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
