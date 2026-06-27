// Shared audio controller. iOS Safari only allows audio that begins from a real
// user gesture. We "unlock" a single <audio> element on the orb tap (a genuine
// gesture), then reuse that same element when the session starts. The element is
// also told to fully buffer during the breathing lead-in, so on slow connections
// the track is ready before the session begins. If anything here fails, the
// session falls back to its own <audio> element.

import { AUDIO_LOOP } from "@/lib/imagery";

let el: HTMLAudioElement | null = null;
let primed = false;

// Call from the orb tap (a user gesture). Creates the audio element, nudges it
// to play (muted) so iOS marks it user-initiated, then pauses it and begins
// buffering the full track for the session ahead.
export function primeAudio(): void {
  if (typeof window === "undefined") return;
  try {
    if (!el) {
      el = new Audio();
      el.loop = true;
      el.preload = "auto";
      el.crossOrigin = "anonymous";
      el.src = AUDIO_LOOP;
    }

    // Begin fetching the whole file now (it has the full breathing lead-in to
    // finish on slow connections).
    el.load();

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
