"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

// ─── Illustrated SVG card icons — hand-drawn style, warm line-art ───────────

function IconCamera() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="12" width="32" height="22" rx="4" stroke="var(--color-hanko)" strokeWidth="1.5" fill="rgba(183,40,46,0.06)"/>
      <circle cx="20" cy="22" r="6" stroke="var(--color-hanko)" strokeWidth="1.5" fill="rgba(183,40,46,0.08)"/>
      <circle cx="20" cy="22" r="2.5" fill="var(--color-hanko)" opacity="0.5"/>
      <path d="M14 12V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="var(--color-hanko)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="30" cy="17" r="1.5" fill="var(--color-hanko)" opacity="0.6"/>
    </svg>
  );
}

function IconEma() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="5" y="14" width="30" height="20" rx="3" stroke="var(--color-indigo)" strokeWidth="1.5" fill="rgba(42,58,92,0.06)"/>
      <path d="M14 14V10" stroke="var(--color-indigo)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 14V10" stroke="var(--color-indigo)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 10 Q20 6 26 10" stroke="var(--color-indigo)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M12 22h6M12 27h10" stroke="var(--color-indigo)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <path d="M23 24l3-3 3 3" stroke="var(--color-indigo)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  );
}

function IconBrush() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M28 6 L14 26" stroke="var(--color-wood)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 26 Q10 30 12 34 Q16 32 16 28 L14 26Z" fill="rgba(201,163,123,0.35)" stroke="var(--color-wood)" strokeWidth="1.2"/>
      <line x1="22" y1="10" x2="30" y2="18" stroke="var(--color-wood)" strokeWidth="1" opacity="0.4"/>
      <circle cx="30" cy="8" r="3" fill="rgba(201,163,123,0.15)" stroke="var(--color-wood)" strokeWidth="1.2"/>
    </svg>
  );
}

interface HubTileProps {
  href: string;
  Icon: React.ComponentType;
  motif: string;
  titleEn: string;
  titleJa: string;
  descEn: string;
  descJa: string;
  delay: number;
  accentColor: string;
  accentBg: string;
  id: string;
  index: number;
}

function HubTile({
  href, Icon, motif, titleEn, titleJa, descEn, descJa,
  delay, accentColor, accentBg, id, index,
}: HubTileProps) {
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} id={id} className="block group" aria-label={lang === "en" ? titleEn : titleJa}>
        <motion.div
          className="relative h-full cursor-pointer overflow-hidden"
          style={{
            background: "linear-gradient(150deg, #FDFAF6 0%, #F7F0E8 100%)",
            borderRadius: "20px",
            border: "1px solid rgba(201,163,123,0.22)",
            boxShadow: "0 2px 8px rgba(43,43,43,0.04), 0 1px 2px rgba(43,43,43,0.04)",
            padding: "32px 28px 28px",
          }}
          whileHover={{
            y: -4,
            boxShadow: "0 12px 32px rgba(43,43,43,0.1), 0 2px 8px rgba(43,43,43,0.06)",
            borderColor: accentColor,
          }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {/* Large ghosted kanji watermark */}
          <div
            className="absolute -bottom-4 -right-2 select-none pointer-events-none"
            aria-hidden="true"
            style={{
              fontFamily: "Noto Serif JP, serif",
              fontSize: "7rem",
              color: accentColor,
              opacity: 0.04,
              lineHeight: 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {motif}
          </div>

          {/* Thin left accent rule */}
          <div
            className="absolute left-0 top-8 bottom-8 w-0.5 rounded-r-full"
            style={{
              background: `linear-gradient(180deg, transparent, ${accentColor}, transparent)`,
              opacity: 0.6,
            }}
          />

          {/* Icon container */}
          <div
            className="inline-flex items-center justify-center mb-6 rounded-2xl transition-transform duration-200 group-hover:scale-105"
            style={{
              width: "56px",
              height: "56px",
              background: accentBg,
              border: `1px solid ${accentColor}22`,
            }}
          >
            <Icon />
          </div>

          {/* Title */}
          <h2
            className="mb-2"
            style={{
              fontFamily: lang === "ja" ? "Noto Serif JP, serif" : "Inter, sans-serif",
              fontSize: "1.0625rem",
              fontWeight: "600",
              color: "var(--color-indigo)",
              letterSpacing: lang === "ja" ? "0.03em" : "-0.01em",
              lineHeight: "1.3",
            }}
          >
            {lang === "en" ? titleEn : titleJa}
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: lang === "ja" ? "Noto Sans JP, sans-serif" : "Inter, sans-serif",
              fontSize: "0.8125rem",
              color: "var(--color-ink)",
              opacity: 0.55,
              lineHeight: lang === "ja" ? "2" : "1.65",
            }}
          >
            {lang === "en" ? descEn : descJa}
          </p>

          {/* Animated arrow — only shows on hover */}
          <div
            className="absolute bottom-7 right-7 flex items-center gap-1 text-xs font-medium transition-all duration-200 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
            style={{ color: accentColor, fontFamily: "Inter, sans-serif" }}
          >
            <span>{lang === "ja" ? "開く" : "Open"}</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </div>

          {/* Card index number — subtle, editorial */}
          <div
            className="absolute top-6 right-7 font-mono text-xs"
            style={{ color: accentColor, opacity: 0.25, fontFamily: "Inter, sans-serif" }}
          >
            0{index + 1}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function HubPage() {
  const { t, lang } = useLanguage();

  return (
    <main
      className="relative min-h-screen pb-16 px-4"
      style={{ background: "var(--color-paper)", paddingTop: "80px" }}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute blur-3xl rounded-full"
          style={{
            width: "500px", height: "500px",
            top: "-100px", right: "-100px",
            background: "radial-gradient(circle, rgba(183,40,46,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute blur-3xl rounded-full"
          style={{
            width: "400px", height: "400px",
            bottom: "0", left: "-80px",
            background: "radial-gradient(circle, rgba(42,58,92,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Ghosted kanji — very faint, compositional */}
        <div
          className="absolute select-none"
          style={{
            top: "15%", right: "4%",
            fontFamily: "Noto Serif JP, serif",
            fontSize: "min(22vw, 240px)",
            color: "var(--color-indigo)",
            opacity: 0.025,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          想
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header section */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-7"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
          >
            <div
              className="h-px flex-none"
              style={{ width: "48px", background: "var(--color-hanko)", opacity: 0.5 }}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-wood)",
              }}
            >
              Japanese Class · 2025
            </span>
          </motion.div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: "Noto Serif JP, serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: "300",
              color: "var(--color-indigo)",
              lineHeight: "1.2",
              letterSpacing: "-0.01em",
              marginBottom: "8px",
            }}
          >
            {t(translations.hub.greeting)},
          </h1>
          <h2
            style={{
              fontFamily: "Noto Serif JP, serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: "500",
              background: "linear-gradient(135deg, var(--color-hanko) 0%, #C9832A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: "1.25",
              marginBottom: "20px",
            }}
          >
            ゴウリサンカル先生
          </h2>
          <p
            style={{
              fontFamily: lang === "ja" ? "Noto Sans JP, sans-serif" : "Inter, sans-serif",
              fontSize: "0.9375rem",
              color: "var(--color-ink)",
              opacity: 0.6,
              lineHeight: lang === "ja" ? "2" : "1.7",
              maxWidth: "420px",
            }}
          >
            {t(translations.hub.subgreeting)}
          </p>
        </motion.div>

        {/* Section label */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-wood)",
              opacity: 0.7,
            }}
          >
            {lang === "ja" ? "セクションを選ぶ" : "Choose a section"}
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(201,163,123,0.3)" }} />
        </motion.div>

        {/* Three tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <HubTile
            id="hub-tile-memory"
            href="/memory-lane"
            Icon={IconCamera}
            motif="想"
            titleEn={translations.hub.memoryLane.title.en}
            titleJa={translations.hub.memoryLane.title.ja}
            descEn={translations.hub.memoryLane.desc.en}
            descJa={translations.hub.memoryLane.desc.ja}
            delay={0.3}
            accentColor="#B7282E"
            accentBg="rgba(183,40,46,0.07)"
            index={0}
          />
          <HubTile
            id="hub-tile-arigatou"
            href="/arigatou"
            Icon={IconEma}
            motif="感"
            titleEn={translations.hub.arigatou.title.en}
            titleJa={translations.hub.arigatou.title.ja}
            descEn={translations.hub.arigatou.desc.en}
            descJa={translations.hub.arigatou.desc.ja}
            delay={0.42}
            accentColor="#2A3A5C"
            accentBg="rgba(42,58,92,0.07)"
            index={1}
          />
          <HubTile
            id="hub-tile-vocab"
            href="/vocab"
            Icon={IconBrush}
            motif="語"
            titleEn={translations.hub.vocab.title.en}
            titleJa={translations.hub.vocab.title.ja}
            descEn={translations.hub.vocab.desc.en}
            descJa={translations.hub.vocab.desc.ja}
            delay={0.54}
            accentColor="#A8845A"
            accentBg="rgba(201,163,123,0.1)"
            index={2}
          />
        </div>

        {/* Footer mark */}
        <motion.div
          className="flex items-center gap-5 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="h-px flex-1" style={{ background: "rgba(201,163,123,0.25)" }} />
          <div className="flex items-center gap-3">
            {["思", "出", "感", "謝"].map((k, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "Noto Serif JP, serif",
                  fontSize: "0.85rem",
                  color: "var(--color-indigo)",
                  opacity: 0.18 + i * 0.04,
                }}
              >
                {k}
              </span>
            ))}
          </div>
          <div className="h-px flex-1" style={{ background: "rgba(201,163,123,0.25)" }} />
        </motion.div>
      </div>
    </main>
  );
}
