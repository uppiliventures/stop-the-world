"use client";

import { useEffect, useRef, useState } from "react";
import { IMAGERY, AUDIO_LOOP } from "@/lib/imagery";
import { TIERS, type Tier } from "@/lib/tiers";

const CROSSFADE_HOLD_MS = 11000; // each image holds 11s
const FADE_MS = 4000;            // slow crossfade between images
const TARGET_VOLUME = 0.7;
const END_FADE_S = 8;            // audio + visuals settle over the final 8s

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioEngine({ tier = "AWARE" }: { tier?: Tier }) {
  const totalSeconds = TIERS[tier].minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [frame, setFrame] = useState(0);
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Image cycle — but stop advancing in the final stretch so it settles
  // on the last image and fades, instead of jumping to a new one at the end.
  useEffect(() => {
    const cycle = setInterval(() => {
      setRemaining((r) => {
        if (r > END_FADE_S + 2) {
          setFrame((f) => (f + 1) % IMAGERY.length);
        }
        return r; // don't change remaining here
      });
    }, CROSSFADE_HOLD_MS);
    return () => clearInterval(cycle);
  }, []);

  // Audio: play once, fade in.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.loop = false;
    el.volume = 0;
    el.play().catch(() => {});
    const fadeIn = setInterval(() => {
      if (el.volume < TARGET_VOLUME - 0.03) {
        el.volume = Math.min(TARGET_VOLUME, el.volume + 0.03);
      } else {
        el.volume = TARGET_VOLUME;
        clearInterval(fadeIn);
      }
    }, 130);
    return () => clearInterval(fadeIn);
  }, []);

  // Gentle audio fade over the final END_FADE_S seconds.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (remaining <= END_FADE_S && remaining > 0) {
      el.volume = Math.max(0, TARGET_VOLUME * (remaining / END_FADE_S));
    }
    if (remaining === 0) el.volume = 0;
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

      <div className="absolute inset-0 flex items-center justify-center">
        {done ? (
          <p className="text-lg tracking-[0.3em] text-bone/80">the world returns</p>
        ) : (
          <p className="font-mono text-5xl tabular-nums tracking-widest text-bone/70 sm:text-7xl">
            {format(remaining)}
          </p>
        )}
      </div>

      <audio ref={audioRef} src={AUDIO_LOOP} preload="auto" />
    </div>
  );
}
