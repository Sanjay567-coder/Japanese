"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { studentMessages } from "@/lib/messages-data";
import EmaCard from "@/components/ui/EmaCard";

export default function ArigatouPage() {
  const { t, lang } = useLanguage();

  return (
    <main
      className="relative min-h-screen pt-20 pb-16 px-4"
      style={{ background: "var(--color-paper)" }}
    >
      {/* Background decorative gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(42,58,92,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Page header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(42,58,92,0.07)",
              border: "1px solid rgba(42,58,92,0.15)",
            }}
          >
            <span className="text-sm">📝</span>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--color-indigo)", fontFamily: "Inter, sans-serif" }}
            >
              Arigatou Board
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-light mb-2"
            style={{
              color: "var(--color-indigo)",
              fontFamily: "Noto Serif JP, serif",
            }}
          >
            {t(translations.arigatou.title)}
          </h1>

          <p
            className="text-base opacity-65 mb-4"
            style={{
              color: "var(--color-ink)",
              fontFamily:
                lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
            }}
          >
            {t(translations.arigatou.subtitle)}
          </p>

          {/* Tap hint */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: "rgba(201,163,123,0.15)",
              color: "var(--color-wood)",
              fontFamily: "Inter, sans-serif",
              border: "1px solid rgba(201,163,123,0.3)",
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>👆</span>
            <span>{t(translations.arigatou.tapHint)}</span>
          </motion.div>
        </motion.div>

        {/* Ema card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {studentMessages.map((message, index) => (
            <EmaCard
              key={message.id}
              message={message}
              index={index}
            />
          ))}
        </div>

        {/* Decorative bottom section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: "rgba(201,163,123,0.4)" }} />
            <span
              className="text-2xl"
              style={{ fontFamily: "Noto Serif JP, serif", color: "var(--color-hanko)", opacity: 0.4 }}
            >
              ありがとう
            </span>
            <div className="h-px w-16" style={{ background: "rgba(201,163,123,0.4)" }} />
          </div>

          <p
            className="text-sm max-w-sm mx-auto mb-8 opacity-60"
            style={{
              color: "var(--color-ink)",
              fontFamily:
                lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
              lineHeight: lang === "ja" ? "2" : "1.7",
            }}
          >
            {lang === "en"
              ? "Each tablet holds a piece of our gratitude. Thank you for everything, Sensei."
              : "それぞれのえまに、かんしゃがこもっています。先生、ありがとうございました。"}
          </p>

          {/* Back to hub */}
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
