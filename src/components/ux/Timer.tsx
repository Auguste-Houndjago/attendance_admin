"use client";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function AnimatedTimer() {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={60}
      colors={["#4CAF50", "#FFC107", "#F44336"]}
      colorsTime={[40, 20, 0]}
    >
      {({ remainingTime }) => <div className="text-xl font-bold">{remainingTime} sec</div>}
    </CountdownCircleTimer>
  );
}
