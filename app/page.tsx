"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

// Shoji door panel component
function ShojiPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F5EFE6 0%, #EDE4D6 50%, #E6DDD0 100%)",
        borderRight: isLeft ? "2px solid rgba(201, 163, 123, 0.6)" : "none",
        borderLeft: !isLeft ? "2px solid rgba(201, 163, 123, 0.6)" : "none",
      }}
    >
      {/* Shoji grid pattern */}
      <div className="absolute inset-0" style={{ opacity: 0.3 }}>
        {/* Horizontal lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`h${i}`}
            className="absolute w-full h-px"
            style={{
              top: `${10 + i * 11}%`,
              background: "rgba(201, 163, 123, 0.8)",
            }}
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`v${i}`}
            className="absolute h-full w-px"
            style={{
              left: `${15 + i * 18}%`,
              background: "rgba(201, 163, 123, 0.8)",
            }}
          />
        ))}
      </div>

      {/* Wood frame top */}
      <div
        className="absolute top-0 left-0 right-0 h-6"
        style={{ background: "linear-gradient(180deg, #A8845A, #C9A37B)" }}
      />
      {/* Wood frame bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6"
        style={{ background: "linear-gradient(0deg, #A8845A, #C9A37B)" }}
      />
      {/* Wood frame side */}
      <div
        className="absolute top-0 bottom-0 w-5"
        style={{
          right: isLeft ? 0 : "auto",
          left: !isLeft ? 0 : "auto",
          background: "linear-gradient(90deg, #8B6B42, #A8845A)",
        }}
      />
    </div>
  );
}

export default function EntrancePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  const handleEnter = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    // Navigate after door animation completes
    setTimeout(() => {
      router.push("/hub");
    }, 1000);
  }, [isOpening, router]);

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--color-paper)" }}
    >
      {/* Animated decorative circles */}
      <div
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-hanko)", transform: "translate(-30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--color-indigo)", transform: "translate(30%, 30%)" }}
      />
      <div
        className="absolute top-1/2 left-0 w-48 h-48 rounded-full opacity-10 blur-2xl"
        style={{ background: "var(--color-wood)" }}
      />

      {/* Content — staggered entrance */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        {/* Subtitle — Japanese class */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border"
            style={{
              borderColor: "rgba(201, 163, 123, 0.5)",
              background: "rgba(201, 163, 123, 0.1)",
            }}
          >
            <span className="text-lg">⛩️</span>
            <span
              className="text-sm tracking-widest uppercase"
              style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
            >
              {t(translations.entrance.subtitle)}
            </span>
            <span className="text-lg">⛩️</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-2"
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-light leading-tight"
            style={{ color: "var(--color-indigo)", fontFamily: "Noto Serif JP, serif" }}
          >
            {t(translations.entrance.heading1)}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-8"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold"
            style={{
              fontFamily: "Noto Serif JP, serif",
              background: "linear-gradient(135deg, var(--color-hanko), var(--color-wood))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t(translations.entrance.heading2)}
          </h2>
        </motion.div>

        {/* Divider with cherry blossom */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center gap-4 mb-8 w-full max-w-sm"
        >
          <div className="flex-1 h-px" style={{ background: "rgba(201, 163, 123, 0.5)" }} />
          <span className="text-xl">🌸</span>
          <div className="flex-1 h-px" style={{ background: "rgba(201, 163, 123, 0.5)" }} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-base sm:text-lg mb-12 leading-relaxed max-w-md"
          style={{
            color: "var(--color-ink)",
            opacity: 0.75,
            fontFamily: "Noto Serif JP, serif",
            fontStyle: "italic",
          }}
        >
          {t(translations.entrance.tagline)}
        </motion.p>

        {/* Hanko stamp CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            id="entrance-btn"
            onClick={handleEnter}
            disabled={isOpening}
            className="hanko-stamp w-28 h-28 flex-col gap-1 transition-all disabled:opacity-70"
            aria-label={t(translations.entrance.cta)}
            style={{
              background: isOpening ? "rgba(183, 40, 46, 0.12)" : "transparent",
            }}
          >
            <span
              style={{ fontFamily: "Noto Serif JP, serif", fontSize: "1.5rem", color: "var(--color-hanko)" }}
            >
              {t(translations.entrance.cta)}
            </span>
          </button>
          <motion.p
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs tracking-widest"
            style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
          >
            {t(translations.entrance.ctaSubtext)}
          </motion.p>
        </motion.div>
      </div>

      {/* Shoji door animation overlay */}
      <AnimatePresence>
        {isOpening && (
          <>
            {/* Left panel */}
            <motion.div
              className="fixed top-0 left-0 w-1/2 h-full z-50"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              <ShojiPanel side="left" />
            </motion.div>
            {/* Right panel */}
            <motion.div
              className="fixed top-0 right-0 w-1/2 h-full z-50"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              <ShojiPanel side="right" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
