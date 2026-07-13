"use client";

import { useState } from "react";
import Gate from "@/components/layout/Gate";
import AudioEngine from "@/components/audio/AudioEngine";
import MovementFooter from "@/components/layout/MovementFooter";

export default function Home() {
  const [inSession, setInSession] = useState(false);
  const [ritualStarted, setRitualStarted] = useState(false);

  // Footer is hidden only during the session/ritual (as before). On the entry
  // screen it is always available — navigation shouldn't be time-gated. Calm is
  // achieved through the footer's low opacity, not by delaying it. The orb still
  // fades in gently (that's content/atmosphere, handled in Gate); the nav simply
  // appears with everything else and stays quiet.
  const footerHidden = inSession || ritualStarted;

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
