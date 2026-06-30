"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

// ─── Shoji panel — refined, accurate grid proportions ────────────────────────
function ShojiPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  // Shoji grid: 3 columns × 5 rows of translucent panes
  const cols = 3;
  const rows = 5;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #F8F2E8 0%, #EDE4D4 60%, #E4DAC8 100%)",
      }}
    >
      {/* Wood frame — top */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "28px",
          background: "linear-gradient(180deg, #7A5C35 0%, #A8845A 60%, #C9A37B 100%)",
          boxShadow: "0 2px 8px rgba(43,43,43,0.2)",
        }}
      />
      {/* Wood frame — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "28px",
          background: "linear-gradient(0deg, #7A5C35 0%, #A8845A 60%, #C9A37B 100%)",
          boxShadow: "0 -2px 8px rgba(43,43,43,0.2)",
        }}
      />
      {/* Wood frame — inner vertical edge (meeting center) */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          width: "18px",
          right: isLeft ? 0 : "auto",
          left: isLeft ? "auto" : 0,
          background: "linear-gradient(90deg, #6B4F2C, #8B6B42)",
          boxShadow: isLeft ? "-2px 0 12px rgba(43,43,43,0.25)" : "2px 0 12px rgba(43,43,43,0.25)",
        }}
      />
      {/* Wood frame — outer vertical edge */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          width: "14px",
          left: isLeft ? 0 : "auto",
          right: isLeft ? "auto" : 0,
          background: "linear-gradient(90deg, #8B6B42, #6B4F2C)",
        }}
      />

      {/* Shoji grid panes — inside the frame */}
      <div
        className="absolute"
        style={{ top: "28px", bottom: "28px", left: "14px", right: "18px" }}
      >
        {/* Horizontal rails */}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <div
            key={`h${i}`}
            className="absolute left-0 right-0"
            style={{
              top: `${(i / rows) * 100}%`,
              height: i === 0 || i === rows ? "6px" : "4px",
              background: "linear-gradient(90deg, #8B6B42, #A8845A, #8B6B42)",
              transform: "translateY(-50%)",
            }}
          />
        ))}
        {/* Vertical stiles */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <div
            key={`v${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${(i / cols) * 100}%`,
              width: "4px",
              background: "linear-gradient(180deg, #8B6B42, #A8845A, #8B6B42)",
              transform: "translateX(-50%)",
            }}
          />
        ))}
        {/* Paper panes — warm translucent fill */}
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => (
            <div
              key={`p${row}-${col}`}
              className="absolute"
              style={{
                top: `calc(${(row / rows) * 100}% + 3px)`,
                left: `calc(${(col / cols) * 100}% + 3px)`,
                width: `calc(${(1 / cols) * 100}% - 6px)`,
                height: `calc(${(1 / rows) * 100}% - 6px)`,
                background: "rgba(255, 252, 245, 0.75)",
                // Subtle paper grain
                backdropFilter: "blur(1px)",
              }}
            />
          ))
        )}
      </div>

      {/* Subtle wood grain texture on frame edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,107,66,0.04) 3px, rgba(139,107,66,0.04) 4px)",
          opacity: 0.5,
        }}
      />
    </div>
  );
}

// ─── Hub preview — shown through the gap as doors open ────────────────────────
function HubPreview() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: "var(--color-paper)" }}
    >
      {/* Ghost of the hub content — seen "through" the opening doors */}
      <div className="text-center px-6 select-none pointer-events-none">
        <div
          style={{
            fontFamily: "Noto Serif JP, serif",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            color: "var(--color-indigo)",
            opacity: 0.9,
            marginBottom: "8px",
            fontWeight: "300",
          }}
        >
          いらっしゃいませ
        </div>
        <div
          style={{
            fontFamily: "Noto Serif JP, serif",
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            color: "var(--color-hanko)",
            opacity: 0.7,
            marginBottom: "32px",
          }}
        >
          ゴウリサンカル先生
        </div>
        {/* Blurred card silhouettes */}
        <div className="flex items-center gap-4 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "80px",
                height: "100px",
                borderRadius: "12px",
                background: "rgba(201,163,123,0.15)",
                border: "1px solid rgba(201,163,123,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EntrancePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "opening" | "navigating">("idle");

  const handleEnter = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("opening");

    // Navigate during the animation — the page transition happens seamlessly
    // as the doors are still sliding. This removes any perceptible gap/flash.
    setTimeout(() => {
      setPhase("navigating");
      router.push("/hub");
    }, 700); // Navigate at 700ms — doors are 80% open, feels like walking through
  }, [phase, router]);

  // Custom easing: weighted start, ease out to rest — feels like sliding wood
  const shojiEase = [0.32, 0, 0.67, 1] as const;

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--color-paper)" }}
    >
      {/* ── Ambient light blobs ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%", left: "-10%",
          width: "55vw", height: "55vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(183,40,46,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%", right: "-10%",
          width: "50vw", height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(42,58,92,0.06) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Entrance content — staggered reveal ── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="entrance-content"
            className="relative z-10 flex flex-col items-center text-center px-6"
            style={{ maxWidth: "640px" }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
                style={{
                  background: "rgba(201,163,123,0.12)",
                  border: "1px solid rgba(201,163,123,0.35)",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--color-hanko)", opacity: 0.7 }}>⛩</span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-wood)",
                  }}
                >
                  {t(translations.entrance.subtitle)}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-hanko)", opacity: 0.7 }}>⛩</span>
              </div>
            </motion.div>

            {/* Heading line 1 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "Noto Serif JP, serif",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: "300",
                color: "var(--color-indigo)",
                lineHeight: "1.1",
                letterSpacing: "-0.01em",
                marginBottom: "8px",
              }}
            >
              {t(translations.entrance.heading1)}
            </motion.h1>

            {/* Heading line 2 */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "Noto Serif JP, serif",
                fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
                fontWeight: "500",
                background: "linear-gradient(135deg, var(--color-hanko) 0%, #C9832A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: "1.2",
                marginBottom: "32px",
              }}
            >
              {t(translations.entrance.heading2)}
            </motion.h2>

            {/* Rule */}
            <motion.div
              className="flex items-center gap-4 mb-8 w-full"
              style={{ maxWidth: "340px", transformOrigin: "center" }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.68, ease: "easeOut" }}
            >
              <div className="flex-1 h-px" style={{ background: "rgba(201,163,123,0.45)" }} />
              <span style={{ fontSize: "1.1rem", opacity: 0.8 }}>🌸</span>
              <div className="flex-1 h-px" style={{ background: "rgba(201,163,123,0.45)" }} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.82 }}
              style={{
                fontFamily: "Noto Serif JP, serif",
                fontSize: "clamp(0.875rem, 2vw, 1.0625rem)",
                color: "var(--color-ink)",
                opacity: 0.6,
                lineHeight: "1.8",
                fontStyle: "italic",
                marginBottom: "48px",
                maxWidth: "380px",
              }}
            >
              {t(translations.entrance.tagline)}
            </motion.p>

            {/* Hanko CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 1.0, type: "spring", stiffness: 240, damping: 22 }}
              className="flex flex-col items-center gap-3"
            >
              <button
                id="entrance-btn"
                onClick={handleEnter}
                disabled={phase !== "idle"}
                aria-label={t(translations.entrance.cta)}
                style={{
                  width: "108px",
                  height: "108px",
                  borderRadius: "50%",
                  border: "2px solid rgba(183,40,46,0.7)",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  position: "relative",
                  transition: "all 0.2s ease",
                  fontFamily: "Noto Serif JP, serif",
                  color: "var(--color-hanko)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(183,40,46,0.07)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04) rotate(-2deg)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(183,40,46,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1) rotate(0deg)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                {/* Inner ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: "5px",
                    borderRadius: "50%",
                    border: "0.5px solid rgba(183,40,46,0.3)",
                    pointerEvents: "none",
                  }}
                />
                <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>
                  {t(translations.entrance.cta)}
                </span>
              </button>

              {/* Pulse hint text */}
              <motion.p
                animate={{ opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-wood)",
                }}
              >
                {t(translations.entrance.ctaSubtext)}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hub preview layer — revealed as doors open ── */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="hub-preview"
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <HubPreview />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shoji door panels — slide apart over the hub preview ── */}
      <AnimatePresence>
        {phase !== "idle" && (
          <>
            {/* Left door */}
            <motion.div
              key="door-left"
              className="fixed top-0 left-0 h-full z-40"
              style={{ width: "50%" }}
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{
                duration: 0.85,
                ease: shojiEase,
                delay: 0,
              }}
            >
              <ShojiPanel side="left" />
            </motion.div>

            {/* Right door */}
            <motion.div
              key="door-right"
              className="fixed top-0 right-0 h-full z-40"
              style={{ width: "50%" }}
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{
                duration: 0.85,
                ease: shojiEase,
                delay: 0,
              }}
            >
              <ShojiPanel side="right" />
            </motion.div>

            {/* Center shadow line — door gap realism */}
            <motion.div
              key="door-gap"
              className="fixed top-0 h-full z-50"
              style={{
                width: "2px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(180deg, rgba(43,43,43,0.25), rgba(43,43,43,0.4), rgba(43,43,43,0.25))",
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
