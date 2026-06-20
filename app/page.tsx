"use client";

import { useState } from "react";
import Gate from "@/components/layout/Gate";
import AudioEngine from "@/components/audio/AudioEngine";
import MovementFooter from "@/components/layout/MovementFooter";

export default function Home() {
  const [inSession, setInSession] = useState(false);
  const [ritualStarted, setRitualStarted] = useState(false);

  return (
    <>
      {inSession ? (
        <AudioEngine tier="AWARE" />
      ) : (
        <Gate onEnter={() => setInSession(true)} onBegin={() => setRitualStarted(true)} />
      )}
      <MovementFooter hidden={inSession || ritualStarted} />
    </>
  );
}
