"use client";

import { useState, useEffect } from "react";
import Gate from "@/components/layout/Gate";
import AudioEngine from "@/components/audio/AudioEngine";
import MovementFooter from "@/components/layout/MovementFooter";

export default function Home() {
  const [inSession, setInSession] = useState(false);
  const [ritualStarted, setRitualStarted] = useState(false);

  // Footer fades IN a beat after the orb settles, so the entrance is sequenced:
  // orb first, then the nav arrives beneath it.
  const [footerReady, setFooterReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFooterReady(true), 4000); // orb fades in over 2s, then footer follows 2s later (total 4s)
    return () => clearTimeout(t);
  }, []);

  // Hidden during session/ritual (as before), and until the entrance delay passes.
  const footerHidden = inSession || ritualStarted || !footerReady;

  return (
    <>
      {inSession ? (
        <AudioEngine tier="AWARE" />
      ) : (
        <Gate onEnter={() => setInSession(true)} onBegin={() => setRitualStarted(true)} />
      )}
      <MovementFooter hidden={footerHidden} />
    </>
  );
}
