"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { useAudio } from "@/lib/audio-context";
import AudioPlayer from "@/components/ui/AudioPlayer";

const AUDIO_SRC = "/assets/audio/audio.mp3";

// The three class photos
const heroImage = { src: "/assets/images/image1.jpeg", alt: "Class photo" };
const supportingImages = [
  { src: "/assets/images/image2.jpeg", alt: "Class memory 2" },
  { src: "/assets/images/image3.jpeg", alt: "Class memory 3" },
];

export default function MemoryLanePage() {
  const { t, lang } = useLanguage();
  const { stopAudio } = useAudio();

  // Stop audio when navigating away
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <main
      className="relative min-h-screen pt-20 pb-16 px-4"
      style={{ background: "var(--color-paper)" }}
    >
      {/* Subtle top gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(183,40,46,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Page header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(183,40,46,0.08)",
              border: "1px solid rgba(183,40,46,0.2)",
            }}
          >
            <span className="text-sm">🌸</span>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--color-hanko)", fontFamily: "Inter, sans-serif" }}
            >
              Memory Lane
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-light mb-2"
            style={{
              color: "var(--color-indigo)",
              fontFamily: "Noto Serif JP, serif",
            }}
          >
            {t(translations.memoryLane.title)}
          </h1>
          <p
            className="text-base opacity-65"
            style={{
              color: "var(--color-ink)",
              fontFamily:
                lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
            }}
          >
            {t(translations.memoryLane.subtitle)}
          </p>
        </motion.div>

        {/* Audio Player */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <AudioPlayer src={AUDIO_SRC} />
        </motion.div>

        {/* Main content: hero image + narrative panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12 items-start">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="photo-vintage rounded-lg overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={heroImage.src}
                  alt={t(translations.memoryLane.photoCaption)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Vintage overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245,239,230,0.15) 0%, transparent 50%, rgba(201,163,123,0.08) 100%)",
                  }}
                />
              </div>
            </div>

            {/* Photo caption */}
            <motion.p
              className="mt-3 text-center text-xs italic"
              style={{
                color: "var(--color-wood)",
                fontFamily:
                  lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {t(translations.memoryLane.photoCaption)}
            </motion.p>
          </motion.div>

          {/* Narrative journal panel */}
          <motion.div
            className="scroll-panel rounded-2xl p-7 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {/* Decorative journal lines */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px"
                  style={{
                    top: `${8 + i * 8}%`,
                    background: "rgba(201,163,123,0.12)",
                  }}
                />
              ))}
            </div>

            {/* Journal heading */}
            <div className="relative z-10 mb-5">
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ background: "var(--color-hanko)" }}
                />
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{
                    color: "var(--color-hanko)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  A Note From Your Students
                </span>
              </div>
            </div>

            {/* Narrative paragraphs */}
            <div className="relative z-10 space-y-5">
              {translations.memoryLane.narrative.map((para, i) => (
                <motion.p
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{
                    color: "var(--color-ink)",
                    opacity: 0.85,
                    fontFamily:
                      lang === "ja"
                        ? "Noto Serif JP, serif"
                        : "Inter, sans-serif",
                    lineHeight: lang === "ja" ? "2.2" : "1.8",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {lang === "en" ? para.en : para.ja}
                </motion.p>
              ))}
            </div>

            {/* Journal closing */}
            <motion.div
              className="relative z-10 mt-6 pt-4 border-t flex items-center justify-end"
              style={{ borderColor: "rgba(201,163,123,0.3)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span
                className="text-sm italic"
                style={{
                  color: "var(--color-wood)",
                  fontFamily: "Noto Serif JP, serif",
                }}
              >
                — {lang === "en" ? "Your students, always" : "いつでも、あなたの学生"}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Supporting image strip — easy to extend with more photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div
            className="text-center mb-5 flex items-center gap-4"
          >
            <div className="flex-1 h-px" style={{ background: "rgba(201,163,123,0.4)" }} />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
            >
              {lang === "en" ? "More Memories" : "ほかのきおく"}
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(201,163,123,0.4)" }} />
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {supportingImages.map((img, i) => (
              <motion.div
                key={i}
                className="photo-vintage rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(245,239,230,0.1) 0%, transparent 100%)",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back to hub */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
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
    </main>
  );
}
