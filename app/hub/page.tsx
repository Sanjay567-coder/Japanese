"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

interface HubTileProps {
  href: string;
  icon: string;
  motif: string;
  titleEn: string;
  titleJa: string;
  descEn: string;
  descJa: string;
  delay: number;
  color: string;
  id: string;
}

function HubTile({
  href,
  icon,
  motif,
  titleEn,
  titleJa,
  descEn,
  descJa,
  delay,
  color,
  id,
}: HubTileProps) {
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        id={id}
        className="block"
        aria-label={lang === "en" ? titleEn : titleJa}
      >
        <div
          className="washi-card rounded-2xl p-8 h-full cursor-pointer relative overflow-hidden group transition-all duration-300"
          style={{
            boxShadow: "0 4px 20px rgba(43,43,43,0.08), 0 1px 3px rgba(43,43,43,0.05)",
          }}
        >
          {/* Colored accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-300 group-hover:h-1.5"
            style={{ background: color }}
          />

          {/* Background motif */}
          <div
            className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-300 select-none pointer-events-none"
            style={{ fontFamily: "Noto Serif JP, serif" }}
            aria-hidden="true"
          >
            {motif}
          </div>

          {/* Icon */}
          <div className="text-4xl mb-4">{icon}</div>

          {/* Title */}
          <h2
            className="text-xl font-semibold mb-2"
            style={{
              color: "var(--color-indigo)",
              fontFamily:
                lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
            }}
          >
            {lang === "en" ? titleEn : titleJa}
          </h2>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--color-ink)",
              opacity: 0.65,
              fontFamily:
                lang === "ja" ? "Noto Sans JP, sans-serif" : "Inter, sans-serif",
              lineHeight: lang === "ja" ? "2" : "1.6",
            }}
          >
            {lang === "en" ? descEn : descJa}
          </p>

          {/* Arrow indicator */}
          <motion.div
            className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -4 }}
            whileHover={{ x: 0 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HubPage() {
  const { t, lang } = useLanguage();

  return (
    <main
      className="relative min-h-screen pt-20 pb-12 px-4"
      style={{ background: "var(--color-paper)" }}
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-20 right-8 text-8xl opacity-5 select-none"
          style={{ fontFamily: "Noto Serif JP, serif", color: "var(--color-indigo)" }}
        >
          日
        </div>
        <div
          className="absolute bottom-20 left-8 text-9xl opacity-5 select-none"
          style={{ fontFamily: "Noto Serif JP, serif", color: "var(--color-hanko)" }}
        >
          語
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header greeting */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative element */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="h-px w-20" style={{ background: "rgba(201,163,123,0.5)" }} />
            <span
              className="text-sm tracking-widest uppercase"
              style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif" }}
            >
              2025 · Japanese Class
            </span>
            <div className="h-px w-20" style={{ background: "rgba(201,163,123,0.5)" }} />
          </motion.div>

          <h1
            className="text-4xl sm:text-5xl font-light mb-3"
            style={{
              color: "var(--color-indigo)",
              fontFamily: "Noto Serif JP, serif",
            }}
          >
            {t(translations.hub.greeting)},
          </h1>
          <h2
            className="text-2xl sm:text-3xl font-semibold mb-4"
            style={{
              fontFamily: "Noto Serif JP, serif",
              background:
                "linear-gradient(135deg, var(--color-hanko), var(--color-wood))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ゴウリサンカル先生
          </h2>
          <p
            className="text-base max-w-md mx-auto"
            style={{
              color: "var(--color-ink)",
              opacity: 0.7,
              fontFamily:
                lang === "ja" ? "Noto Sans JP, sans-serif" : "Inter, sans-serif",
              lineHeight: lang === "ja" ? "2" : "1.7",
            }}
          >
            {t(translations.hub.subgreeting)}
          </p>
        </motion.div>

        {/* Three navigation tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <HubTile
            id="hub-tile-memory"
            href="/memory-lane"
            icon="🌸"
            motif="想"
            titleEn={translations.hub.memoryLane.title.en}
            titleJa={translations.hub.memoryLane.title.ja}
            descEn={translations.hub.memoryLane.desc.en}
            descJa={translations.hub.memoryLane.desc.ja}
            delay={0.3}
            color="linear-gradient(90deg, var(--color-hanko), var(--color-wood))"
          />
          <HubTile
            id="hub-tile-arigatou"
            href="/arigatou"
            icon="📝"
            motif="感"
            titleEn={translations.hub.arigatou.title.en}
            titleJa={translations.hub.arigatou.title.ja}
            descEn={translations.hub.arigatou.desc.en}
            descJa={translations.hub.arigatou.desc.ja}
            delay={0.45}
            color="linear-gradient(90deg, var(--color-indigo), #4A6A9C)"
          />
          <HubTile
            id="hub-tile-vocab"
            href="/vocab"
            icon="🖌️"
            motif="語"
            titleEn={translations.hub.vocab.title.en}
            titleJa={translations.hub.vocab.title.ja}
            descEn={translations.hub.vocab.desc.en}
            descJa={translations.hub.vocab.desc.ja}
            delay={0.6}
            color="linear-gradient(90deg, var(--color-wood), #A8845A)"
          />
        </div>

        {/* Bottom kanji decoration */}
        <motion.div
          className="flex items-center justify-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {["思", "出", "🌸", "感", "謝"].map((char, i) => (
            <span
              key={i}
              className="text-xl"
              style={{
                fontFamily: "Noto Serif JP, serif",
                color: char === "🌸" ? "inherit" : "var(--color-indigo)",
                opacity: char === "🌸" ? 1 : 0.2,
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
