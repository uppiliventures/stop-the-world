"use client";

import { useEffect, useRef, useState } from "react";
import { IMAGERY, AUDIO_LOOP } from "@/lib/imagery";
import { TIERS, FORGE_LINKS, type Tier } from "@/lib/tiers";
import { getPrimedAudio } from "@/lib/audioUnlock";

const CROSSFADE_HOLD_MS = 18000;
const FADE_MS = 6000;
const TARGET_VOLUME = 0.7;
const END_FADE_S = 8;

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Gentle ecosystem doors, shown only at the very end (the peak moment).
const DOORS: { label: string; href: string }[] = [
  { label: "book", href: FORGE_LINKS.books },
  { label: "movement", href: FORGE_LINKS.movement },
  { label: "journal", href: FORGE_LINKS.journal },
  { label: "peace", href: TIERS.PEACE.stripeLink },
  { label: "harmony", href: TIERS.HARMONY.stripeLink },
];

export default function AudioEngine({ tier = "AWARE" }: { tier?: Tier }) {
  const totalSeconds = TIERS[tier].minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [frame, setFrame] = useState(0);
  const [done, setDone] = useState(false);
  const [doorsIn, setDoorsIn] = useState(false); // doors fade in a beat after "the world returns"
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const elRef = useRef<HTMLAudioElement | null>(null);
  const volumeFadeRef = useRef<number | null>(null);

  // Countdown timer.
  useEffect(() => {
    const tick = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(tick);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // When the session ends, let "the world returns" settle, then gently reveal the doors.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDoorsIn(true), 4500);
    return () => clearTimeout(t);
  }, [done]);

  // Image cycle — settle on final image near the end instead of jumping.
  useEffect(() => {
    const cycle = setInterval(() => {
      setRemaining((r) => {
        if (r > END_FADE_S + 2) setFrame((f) => (f + 1) % IMAGERY.length);
        return r;
      });
    }, CROSSFADE_HOLD_MS);
    return () => clearInterval(cycle);
  }, []);

  // Audio playback. Prefer the element primed on the orb tap (so iOS Safari
  // allows it); otherwise fall back to the in-page <audio> element. A simple
  // volume ramp via requestAnimationFrame keeps it smooth without needing a
  // user-gesture-bound AudioContext (which iOS often blocks here).
  useEffect(() => {
    const primed = getPrimedAudio();
    const el = primed ?? fallbackAudioRef.current;
    if (!el) return;
    elRef.current = el;

    try {
      el.loop = true;
      el.currentTime = 0;
      el.volume = 0;
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }

      // Gentle fade-in to target volume.
      const start = Date.now();
      const FADE_IN_MS = 3000;
      const fadeIn = () => {
        const t = Math.min(1, (Date.now() - start) / FADE_IN_MS);
        el.volume = TARGET_VOLUME * t;
        if (t < 1) volumeFadeRef.current = requestAnimationFrame(fadeIn);
      };
      volumeFadeRef.current = requestAnimationFrame(fadeIn);
    } catch {
      // ignore
    }

    return () => {
      if (volumeFadeRef.current) cancelAnimationFrame(volumeFadeRef.current);
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // ignore
      }
    };
  }, []);

  // Smooth audio fade-out over the final seconds.
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (remaining === END_FADE_S) {
      if (volumeFadeRef.current) cancelAnimationFrame(volumeFadeRef.current);
      const startVol = el.volume;
      const start = Date.now();
      const FADE_OUT_MS = END_FADE_S * 1000;
      const fadeOut = () => {
        const t = Math.min(1, (Date.now() - start) / FADE_OUT_MS);
        el.volume = startVol * (1 - t);
        if (t < 1) volumeFadeRef.current = requestAnimationFrame(fadeOut);
      };
      volumeFadeRef.current = requestAnimationFrame(fadeOut);
    }
  }, [remaining]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-ink animate-[sessionFade_2s_ease-in]">
      <style>{`@keyframes sessionFade { from { opacity: 0; } to { opacity: 1; } }`}</style>

      {IMAGERY.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: i === frame && !done ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-ink/50" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {done ? (
          <>
            <p className="text-lg tracking-[0.3em] text-bone/80">the world returns</p>

            {/* The gentle doors: appear a calm beat after the world returns. */}
            <div
              className="mt-14 flex flex-col items-center gap-5 transition-opacity duration-[2500ms] ease-in-out"
              style={{ opacity: doorsIn ? 1 : 0, pointerEvents: doorsIn ? "auto" : "none" }}
            >
              <p className="text-[11px] lowercase tracking-[0.25em] text-bone/40">
                if you wish to go deeper
              </p>
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {DOORS.map((d) =>
                  d.href ? (
                    <a
                      key={d.label}
                      href={d.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm lowercase tracking-[0.2em] text-bone/55 transition-colors duration-500 hover:text-bone"
                    >
                      {d.label}
                    </a>
                  ) : null
                )}
              </nav>
            </div>
          </>
        ) : (
          <p className="font-mono text-5xl tabular-nums tracking-widest text-bone/70 sm:text-7xl">
            {format(remaining)}
          </p>
        )}
      </div>

      {/* Fallback element, used only if priming on the orb tap did not run. */}
      <audio ref={fallbackAudioRef} src={AUDIO_LOOP} preload="auto" crossOrigin="anonymous" loop />
    </div>
  );
}
