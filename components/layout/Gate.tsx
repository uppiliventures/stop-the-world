"use client";

import { useEffect, useRef, useState } from "react";
import { primeAudio } from "@/lib/audioUnlock";
import { IMAGERY } from "@/lib/imagery";

// Box breathing (Sama Vritti): four equal beats.
const INHALE = 4;
const HOLD = 4;
const EXHALE = 4;
const HOLD_EMPTY = 4;
const CYCLE = INHALE + HOLD + EXHALE + HOLD_EMPTY; // 16s, continuous
const BREATHS = 5;

const FADE_IN = 3000;
const HOLD_MS = 5000;
const FADE_OUT = 5000;
const SENTENCE_TOTAL = FADE_IN + HOLD_MS + FADE_OUT;
const PRE_PAUSE = 4000;
const BEGIN_BEAT_MS = 4000;

type Stage = "form" | "warning" | "prep" | "begin" | "breathing" | "closing";
type Phase = "in" | "hold" | "out" | "holdEmpty";

const WARNINGS = [
  "never force the breath",
  "if you feel unwell, simply stop",
  "are you ready to begin?",
];

// Calm preparation lead-in. Posture, then teach the full box-breathing pattern.
const PREP = [
  "sit comfortably upright, arms and legs uncrossed",
  "relax your shoulders, and let us breathe together",
  "we will breathe in for 4 seconds, hold for 4, breathe out for 4, and hold for 4",
  "the timer will guide you through five cycles",
];

const CLOSING = [
  "now relax, and listen to the music that plays",
  "be present",
  "if any thoughts arise, just let them go",
];

const PHASE_TEXT: Record<Phase, string> = {
  in: "breathe in",
  hold: "hold",
  out: "breathe out",
  holdEmpty: "hold empty",
};

export default function Gate({ onEnter, onBegin }: { onEnter: () => void; onBegin?: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [warnIdx, setWarnIdx] = useState(0);
  const [warnOpacity, setWarnOpacity] = useState(0);
  const [prepIdx, setPrepIdx] = useState(0);
  const [prepOpacity, setPrepOpacity] = useState(0);
  const [beginOpacity, setBeginOpacity] = useState(0);
  const [closeIdx, setCloseIdx] = useState(0);
  const [closeOpacity, setCloseOpacity] = useState(0);
  const [orbFade, setOrbFade] = useState(false); // triggers the slow orb dissolve at the very end
  const [mounted, setMounted] = useState(false); // gentle fade-in of the whole entry on first load
  const [settling, setSettling] = useState(false); // quiet beat after the last breath, before closing
  const [phase, setPhase] = useState<Phase>("in");
  const [orbBig, setOrbBig] = useState(false);
  const [phaseOpacity, setPhaseOpacity] = useState(0);
  const [count, setCount] = useState(INHALE);
  const breathStart = useRef<number>(0);
  const lastPhase = useRef<Phase | null>(null);

  async function submit() {
    if (status === "sending" || stage !== "form") return;
    primeAudio(); // unlock audio within the user gesture (iOS Safari) — MUST stay on this tap
    // Email is no longer required to enter. We simply prime audio and begin the
    // experience. The optional email capture now lives on the closing screen,
    // where it is asked after the value has been felt (better conversion, and
    // it respects people who do not wish to give an email).
    onBegin?.();
    setStage("warning");
    setWarnIdx(0);
  }

  // Gentle fade-in of the whole entry screen on first load (orb + title),
  // so nothing "bangs in". A short delay lets the paint settle, then it eases in.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Preload session imagery during the breathing lead-in, so the first image
  // is fully decoded before the session starts (no choppy first paint).
  useEffect(() => {
    if (stage === "form") return;
    let cancelled = false;
    (async () => {
      for (const src of IMAGERY) {
        if (cancelled) return;
        try {
          const img = new Image();
          img.src = src;
          if (img.decode) await img.decode().catch(() => {});
        } catch {
          // ignore — preloading is best-effort
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stage]);

  // Warnings.
  useEffect(() => {
    if (stage !== "warning") return;
    if (warnIdx >= WARNINGS.length) {
      setStage("prep");
      setPrepIdx(0);
      return;
    }
    const lead = warnIdx === 0 ? PRE_PAUSE : 50;
    setWarnOpacity(0);
    const tIn = setTimeout(() => setWarnOpacity(1), lead);
    const tOut = setTimeout(() => setWarnOpacity(0), lead + FADE_IN + HOLD_MS);
    const tNext = setTimeout(() => setWarnIdx((i) => i + 1), lead + SENTENCE_TOTAL);
    return () => {
      clearTimeout(tIn);
      clearTimeout(tOut);
      clearTimeout(tNext);
    };
  }, [stage, warnIdx]);

  // Preparation lead-in.
  useEffect(() => {
    if (stage !== "prep") return;
    if (prepIdx >= PREP.length) {
      setStage("begin");
      return;
    }
    setPrepOpacity(0);
    const tIn = setTimeout(() => setPrepOpacity(1), 50);
    const tOut = setTimeout(() => setPrepOpacity(0), FADE_IN + HOLD_MS);
    const tNext = setTimeout(() => setPrepIdx((i) => i + 1), SENTENCE_TOTAL);
    return () => {
      clearTimeout(tIn);
      clearTimeout(tOut);
      clearTimeout(tNext);
    };
  }, [stage, prepIdx]);

  // Single "let's begin", then start continuous breathing.
  useEffect(() => {
    if (stage !== "begin") return;
    setBeginOpacity(0);
    const tIn = setTimeout(() => setBeginOpacity(1), 50);
    const tOut = setTimeout(() => setBeginOpacity(0), BEGIN_BEAT_MS);
    const tNext = setTimeout(() => {
      breathStart.current = Date.now();
      lastPhase.current = null;
      setPhase("in");
      setCount(INHALE);
      setPhaseOpacity(0);
      setStage("breathing");
    }, BEGIN_BEAT_MS + 1500);
    return () => {
      clearTimeout(tIn);
      clearTimeout(tOut);
      clearTimeout(tNext);
    };
  }, [stage]);

  // Keep the screen awake for the WHOLE experience (breathing through audio),
  // not just the audio stage. Acquire once we leave the form; release at the end
  // or on unmount. Wake Lock auto-releases when the tab hides, so re-acquire on
  // visibility change. No-ops where unsupported (e.g. iOS < 16.4).
  useEffect(() => {
    if (stage === "form") return;
    let lock: any = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const wl = (navigator as any).wakeLock;
        if (!wl || document.visibilityState !== "visible") return;
        lock = await wl.request("screen");
      } catch {
        // unsupported or denied — let the screen behave normally
      }
    };

    const onVisible = () => {
      if (!cancelled && document.visibilityState === "visible") acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      try { lock?.release?.(); } catch {}
      lock = null;
    };
  }, [stage]);

  // Continuous box breathing for BREATHS cycles. Real-time clock.
  useEffect(() => {
    if (stage !== "breathing") return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - breathStart.current) / 1000;
      if (elapsed >= CYCLE * BREATHS) {
        clearInterval(id);
        setOrbBig(false);
        lastPhase.current = null;
        setSettling(true);     // begin the gentle wind-down
        setPhaseOpacity(0);    // breath cue fades out slowly (FADE_OUT), orb keeps glowing
        // After the slow fade completes, hold the glowing orb alone a moment,
        // then bring in the closing words.
        setTimeout(() => {
          setCloseIdx(0);
          setStage("closing");
        }, FADE_OUT + 1800);
        return;
      }
      const t = elapsed % CYCLE;
      let next: Phase;
      let remainingInPhase: number;
      if (t < INHALE) {
        next = "in";
        remainingInPhase = INHALE - t;
        setOrbBig(true);
      } else if (t < INHALE + HOLD) {
        next = "hold";
        remainingInPhase = INHALE + HOLD - t;
        setOrbBig(true);
      } else if (t < INHALE + HOLD + EXHALE) {
        next = "out";
        remainingInPhase = INHALE + HOLD + EXHALE - t;
        setOrbBig(false);
      } else {
        next = "holdEmpty";
        remainingInPhase = CYCLE - t;
        setOrbBig(false);
      }
      setCount(Math.ceil(remainingInPhase));
      if (next !== lastPhase.current) {
        lastPhase.current = next;
        setPhase(next);
        setPhaseOpacity(0);
        setTimeout(() => setPhaseOpacity(1), 60);
      }
    }, 100);
    return () => clearInterval(id);
  }, [stage]);

  // Closing transition: calm lines (each a normal fade). After the last line,
  // the orb lingers alone for a few seconds, then fades out slowly into the music.
  const ORB_LINGER_MS = 2500; // orb alone, wordless, after the last line
  const ORB_FADE_MS = 5000;   // slow gentle dissolve, in cadence with the calm
  useEffect(() => {
    if (stage !== "closing") return;

    // All lines shown: linger on the orb, then fade it slowly, then enter.
    if (closeIdx >= CLOSING.length) {
      const tLinger = setTimeout(() => setOrbFade(true), ORB_LINGER_MS);
      const tEnter = setTimeout(() => onEnter(), ORB_LINGER_MS + ORB_FADE_MS + 500);
      return () => {
        clearTimeout(tLinger);
        clearTimeout(tEnter);
      };
    }

    setCloseOpacity(0);
    const tIn = setTimeout(() => setCloseOpacity(1), 50);
    const tOut = setTimeout(() => setCloseOpacity(0), FADE_IN + HOLD_MS);
    const tNext = setTimeout(() => setCloseIdx((i) => i + 1), SENTENCE_TOTAL);
    return () => {
      clearTimeout(tIn);
      clearTimeout(tOut);
      clearTimeout(tNext);
    };
  }, [stage, closeIdx, onEnter]);

  const orbScale = orbBig ? 1.15 : 1;
  const orbTransition =
    stage === "breathing"
      ? phase === "out"
        ? `transform ${EXHALE}s ease-in-out`
        : phase === "in"
        ? `transform ${INHALE}s ease-in-out`
        : "transform 1.5s ease-out"
      : "transform 0.6s ease-in-out";
  // The orb stays present through the closing, then dissolves slowly once orbFade is set.
  const orbOpacityTransition = orbFade ? `opacity ${ORB_FADE_MS}ms ease-in-out` : "opacity 600ms ease-in-out";

  let guideText = "";
  let guideOpacity = 0;
  let guideFade = 700;
  if (stage === "warning" && warnIdx < WARNINGS.length) {
    guideText = WARNINGS[warnIdx];
    guideOpacity = warnOpacity;
    guideFade = warnOpacity === 1 ? FADE_IN : FADE_OUT;
  } else if (stage === "prep" && prepIdx < PREP.length) {
    guideText = PREP[prepIdx];
    guideOpacity = prepOpacity;
    guideFade = prepOpacity === 1 ? FADE_IN : FADE_OUT;
  } else if (stage === "begin") {
    guideText = "let's begin";
    guideOpacity = beginOpacity;
    guideFade = 2000;
  } else if (stage === "breathing") {
    guideText = PHASE_TEXT[phase];
    guideOpacity = phaseOpacity;
    guideFade = phaseOpacity === 1 ? FADE_IN : FADE_OUT;
  } else if (stage === "closing" && closeIdx < CLOSING.length) {
    guideText = CLOSING[closeIdx];
    guideOpacity = closeOpacity;
    guideFade = closeOpacity === 1 ? FADE_IN : FADE_OUT;
  }

  const orbLabel =
    stage === "form" && status !== "sending"
      ? "enter"
      : stage === "breathing"
      ? String(count)
      : "";

  // Orb stays present through the closing lines, then fades out slowly after lingering.
  const orbOpacity = orbFade ? 0 : 1;

  // During the form stage the layout is a centered column (title, orb, email)
  // so nothing overlaps on any screen height. During the breathing/closing
  // stages the guide text uses absolute positioning beneath the centered orb.
  const isForm = stage === "form";

  return (
    <main
      className={`relative flex min-h-screen flex-col items-center gap-10 overflow-hidden px-6 py-16 transition-opacity duration-[2000ms] ease-out sm:justify-center sm:gap-12 ${
        isForm ? "justify-start pt-24 pb-44 sm:pt-16 sm:pb-16" : "justify-center"
      }`}
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <style>{`
        @keyframes idleBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.012); }
        }
        .idle-orb { animation: idleBreathe 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .idle-orb { animation: none; } }
      `}</style>

      {/* Title — in normal flow during the form so it never crowds the orb. */}
      <h1
        className="pointer-events-none px-2 text-center text-xl font-light tracking-tight text-bone transition-opacity duration-[2000ms] sm:text-2xl"
        style={{ opacity: isForm ? 1 : 0 }}
      >
        are you ready to stop the world?
      </h1>

      {/* Orb + guide text bound together: the text is anchored just below the
          orb, so it travels with the orb and can never overlap it. */}
      <div className="relative flex shrink-0 items-center justify-center">
        <button
          onClick={submit}
          disabled={stage !== "form" || status === "sending"}
          aria-label="stop the world"
          className={`${isForm ? "idle-orb" : ""} flex h-44 w-44 shrink-0 items-center justify-center rounded-full font-light tracking-wide text-ink active:scale-95 disabled:cursor-default sm:h-52 sm:w-52 ${stage === "breathing" ? "text-5xl" : "text-sm"}`}
          style={{
            backgroundColor: "#CFC9E8",
            boxShadow: "0 0 90px 20px rgba(207, 201, 232, 0.18), 0 0 150px 40px rgba(207, 201, 232, 0.07)",
            transform: `scale(${orbScale})`,
            transition: `${orbTransition}, ${orbOpacityTransition}`,
            opacity: orbOpacity,
          }}
        >
          <span
            style={{
              opacity: stage === "breathing" ? phaseOpacity : 1,
              transition: `opacity ${FADE_OUT}ms ease-in-out`,
            }}
          >
            {orbLabel}
          </span>
        </button>

        {/* Guide text anchored just beneath the orb (never overlaps). */}
        {!isForm && (
          <div className="pointer-events-none absolute left-1/2 top-full mt-8 w-screen max-w-sm -translate-x-1/2 px-8">
            <p
              className="text-center text-base font-light leading-relaxed tracking-[0.05em] text-bone/70 sm:tracking-[0.12em]"
              style={{ opacity: guideOpacity, transition: `opacity ${guideFade}ms ease-in-out` }}
            >
              {guideText}
            </p>
          </div>
        )}
      </div>

      {/* Email moved to the closing screen (AudioEngine) — asked after the
          experience, and optional. The front is now a pure tap-to-enter. */}

    </main>
  );
}
