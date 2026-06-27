// Shared audio controller. iOS Safari only allows audio that begins from a real
// user gesture. We "unlock" a single <audio> element on the orb tap (a genuine
// gesture), then reuse that same element when the session starts. If anything
// here fails, the session falls back to its own <audio> element (silent on iOS,
// but never broken).

import { AUDIO_LOOP } from "@/lib/imagery";

let el: HTMLAudioElement | null = null;
let primed = false;

// Call from the orb tap (a user gesture). Creates the audio element and nudges
// it to play (muted) so iOS marks it as user-initiated, then pauses it.
export function primeAudio(): void {
  if (typeof window === "undefined") return;
  try {
    if (!el) {
      el = new Audio(AUDIO_LOOP);
      el.loop = true;
      el.preload = "auto";
      el.crossOrigin = "anonymous";
    }
    el.muted = true;
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        if (!el) return;
        el.pause();
        el.currentTime = 0;
        el.muted = false;
        primed = true;
      }).catch(() => {
        if (el) el.muted = false;
      });
    } else {
      primed = true;
    }
  } catch {
    // ignore — session will fall back to its own element
  }
}

// Returns the primed element (or null if priming never ran/failed).
export function getPrimedAudio(): HTMLAudioElement | null {
  return el;
}

export function audioWasPrimed(): boolean {
  return primed;
}
