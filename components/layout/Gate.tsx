"use client";

import { useEffect, useRef, useState } from "react";

const INHALE = 4;
const HOLD = 7;
const EXHALE = 8;
const CYCLE = INHALE + HOLD + EXHALE;
const BREATHS = 2;

const FADE_IN = 3000;
const HOLD_MS = 6000;
const FADE_OUT = 5000;
const SENTENCE_TOTAL = FADE_IN + HOLD_MS + FADE_OUT;
const PRE_PAUSE = 4000; // still beat after the press before the first words

type Stage = "form" | "warning" | "begin" | "breathing" | "closing";
type Phase = "in" | "hold" | "out" | "again";

const WARNINGS = ["sit comfortably", "never force the breath", "if you feel unwell, simply stop"];

const PHASE_TEXT: Record<Phase, string> = {
  in: "breathe in through your nose",
  hold: "and hold",
  out: "breathe out through your mouth",
  again: "breathe in through your nose",
};

export default function Gate({ onEnter, onBegin }: { onEnter: () => void; onBegin?: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [warnIdx, setWarnIdx] = useState(0);
  const [warnOpacity, setWarnOpacity] = useState(0);
  const [beginOpacity, setBeginOpacity] = useState(0);
  const [phase, setPhase] = useState<Phase>("in");
  const [orbBig, setOrbBig] = useState(false);
  const [phaseOpacity, setPhaseOpacity] = useState(0);
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

  useEffect(() => {
    if (stage !== "warning") return;
    if (warnIdx >= WARNINGS.length) {
      setStage("begin");
      return;
    }
    // A still pause before the very first sentence, so the user settles first.
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
      const breathNo = Math.floor(elapsed / CYCLE);
      let next: Phase;
      if (t < INHALE) {
        next = "in";
        setOrbBig(true);
      } else if (t < INHALE + HOLD) {
        next = "hold";
        setOrbBig(true);
      } else {
        next = "out";
        setOrbBig(false);
      }
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
        : phase === "in" || phase === "again"
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
  } else if (stage === "begin") {
    guideText = "let's begin";
    guideOpacity = beginOpacity;
    guideFade = 2000;
  } else if (stage === "breathing") {
    guideText = PHASE_TEXT[phase];
    guideOpacity = phaseOpacity;
    guideFade = phase === "hold" ? 2800 : 1500;
  }

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
        className={`${stage === "form" || stage === "warning" ? "idle-orb" : ""} flex h-44 w-44 items-center justify-center rounded-full text-sm font-light tracking-wide text-ink active:scale-95 disabled:cursor-default sm:h-52 sm:w-52`}
        style={{
          backgroundColor: "#DEDAF0",
          boxShadow: "0 0 70px 12px rgba(222, 218, 240, 0.30), 0 0 110px 24px rgba(222, 218, 240, 0.12)",
          transform: `scale(${orbScale})`,
          transition: orbTransition,
          opacity: stage === "closing" ? 0 : 1,
        }}
      >
        {stage === "form" && status !== "sending" ? "stop the world" : ""}
      </button>

      <div className="absolute top-[64%] left-0 right-0 flex h-8 items-center justify-center px-6">
        <p
          className="text-center text-base font-light tracking-[0.2em] text-bone/70"
          style={{ opacity: stage === "closing" ? 0 : guideOpacity, transition: `opacity ${guideFade}ms ease-in-out` }}
        >
          {guideText}
        </p>
      </div>

      <div className="absolute top-[72%] left-0 right-0 flex flex-col items-center gap-3 px-6">
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

      <p
        className="absolute bottom-10 left-0 right-0 px-6 text-center text-xs font-light tracking-wide text-bone/30 transition-opacity duration-1000"
        style={{ opacity: stage !== "form" && stage !== "closing" ? 1 : 0 }}
      >
        sit comfortably. never force the breath. if you feel unwell, stop.
      </p>
    </main>
  );
}
