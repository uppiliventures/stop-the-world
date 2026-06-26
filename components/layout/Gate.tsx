"use client";

import { useEffect, useRef, useState } from "react";

const INHALE = 4;
const HOLD = 7;
const EXHALE = 8;
const REST = 5; // calm rest between full cycles
const CYCLE = INHALE + HOLD + EXHALE + REST; // one full cycle incl. the rest
const BREATHS = 3; // three cycles

const FADE_IN = 3000;
const HOLD_MS = 6000;
const FADE_OUT = 5000;
const SENTENCE_TOTAL = FADE_IN + HOLD_MS + FADE_OUT;
const PRE_PAUSE = 4000;

type Stage = "form" | "warning" | "prep" | "begin" | "breathing" | "closing";
type Phase = "in" | "hold" | "out" | "rest";

const WARNINGS = ["sit comfortably", "never force the breath", "if you feel unwell, simply stop"];

// Calm preparation lead-in, shown one line at a time before breathing starts.
const PREP = [
  "find a comfortable position",
  "relax your shoulders",
  "let us breathe together as one",
  "we will breathe in for 4 seconds, hold for 7, and breathe out for 8",
  "the timer will count you through each step",
  "are you ready to begin?",
];

const PHASE_TEXT: Record<Phase, string> = {
  in: "breathe in",
  hold: "hold",
  out: "breathe out",
  rest: "rest",
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
  const [phase, setPhase] = useState<Phase>("in");
  const [orbBig, setOrbBig] = useState(false);
  const [phaseOpacity, setPhaseOpacity] = useState(0);
  const [count, setCount] = useState(INHALE);
  const breathStart = useRef<number>(0);
  const lastPhase = useRef<Phase | null>(null);

  async function submit() {
    if (status === "sending" || stage !== "form") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "something went wrong. try again.");
        return;
      }
      setStatus("idle");
      onBegin?.();
      setStage("warning");
      setWarnIdx(0);
    } catch {
      setStatus("error");
      setMessage("no connection. check your network and try again.");
    }
  }

  // Warnings sequence.
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

  // Calm preparation lead-in, same gentle pacing as the warnings.
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

  // "let's begin" beat, then a calm hold before the first inhale.
  useEffect(() => {
    if (stage !== "begin") return;
    setBeginOpacity(0);
    const tIn = setTimeout(() => setBeginOpacity(1), 50);
    const tOut = setTimeout(() => setBeginOpacity(0), 3500);
    const tNext = setTimeout(() => {
      breathStart.current = Date.now();
      lastPhase.current = null;
      setStage("breathing");
    }, 6500);
    return () => {
      clearTimeout(tIn);
      clearTimeout(tOut);
      clearTimeout(tNext);
    };
  }, [stage]);

  // Breathing engine. Real-time clock; clean one-second countdown per phase.
  useEffect(() => {
    if (stage !== "breathing") return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - breathStart.current) / 1000;
      if (elapsed >= CYCLE * BREATHS) {
        clearInterval(id);
        setOrbBig(false);
        setStage("closing");
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
        next = "rest";
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

  useEffect(() => {
    if (stage !== "closing") return;
    const id = setTimeout(() => onEnter(), 1800);
    return () => clearTimeout(id);
  }, [stage, onEnter]);

  const orbScale = orbBig ? 1.15 : 1;
  const orbTransition =
    stage === "breathing"
      ? phase === "out"
        ? `transform ${EXHALE}s ease-in-out`
        : phase === "in"
        ? `transform ${INHALE}s ease-in-out`
        : "transform 1.5s ease-out"
      : "transform 0.6s ease-in-out";

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
    guideFade = 900;
  }

  // The orb shows the per-phase countdown during breathing, but stays quiet during the rest.
  const orbLabel =
    stage === "form" && status !== "sending"
      ? "stop the world"
      : stage === "breathing" && phase !== "rest"
      ? String(count)
      : "";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <style>{`
        @keyframes idleBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.012); }
        }
        .idle-orb { animation: idleBreathe 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .idle-orb { animation: none; } }
      `}</style>

      <h1
        className="pointer-events-none absolute top-[22%] left-0 right-0 px-6 text-center text-2xl font-light tracking-tight text-bone transition-opacity duration-[2000ms] sm:text-4xl"
        style={{ opacity: stage === "form" ? 1 : 0 }}
      >
        are you ready to stop the world?
      </h1>

      <button
        onClick={submit}
        disabled={stage !== "form" || status === "sending"}
        aria-label="stop the world"
        className={`${stage === "form" ? "idle-orb" : ""} flex h-44 w-44 items-center justify-center rounded-full font-light tracking-wide text-ink active:scale-95 disabled:cursor-default sm:h-52 sm:w-52 ${stage === "breathing" ? "text-5xl" : "text-sm"}`}
        style={{
          backgroundColor: "#DEDAF0",
          boxShadow: "0 0 70px 12px rgba(222, 218, 240, 0.30), 0 0 110px 24px rgba(222, 218, 240, 0.12)",
          transform: `scale(${orbScale})`,
          transition: orbTransition,
          opacity: stage === "closing" ? 0 : 1,
        }}
      >
        {orbLabel}
      </button>

      <div className="absolute top-[64%] left-0 right-0 flex h-12 items-center justify-center px-6">
        <p
          className="text-center text-base font-light tracking-[0.15em] text-bone/70"
          style={{ opacity: stage === "closing" ? 0 : guideOpacity, transition: `opacity ${guideFade}ms ease-in-out` }}
        >
          {guideText}
        </p>
      </div>

      <div className="absolute top-[74%] left-0 right-0 flex flex-col items-center gap-3 px-6">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-72 border-b border-bone/20 bg-transparent py-2 text-center text-sm font-light tracking-wide text-bone placeholder:text-bone/30 focus:border-bone/50 focus:outline-none transition-opacity duration-[2000ms]"
          style={{ opacity: stage === "form" ? 1 : 0, pointerEvents: stage === "form" ? "auto" : "none" }}
        />
        {status === "error" && stage === "form" && (
          <p className="max-w-xs text-center text-sm font-light text-bone/60">{message}</p>
        )}
      </div>
    </main>
  );
}
