import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

export const Timer = ({
  startCounting,
  correctWords,
  onStatsUpdate,
}: {
  startCounting: boolean;
  correctWords: number;
  onStatsUpdate: ({ wpm }: { wpm: number }) => void;
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [wpm, setWpm] = useState(0);

  useEffect(() => {
    if (startCounting && !intervalId) {
      const interval = setInterval(() => {
        setTimeElapsed((t: number) => t + 1);
      }, 1000);
      setIntervalId(interval);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [startCounting, intervalId]);

  const minutesPassed = timeElapsed / 60;
  const speed =
    minutesPassed !== 0 ? Math.round(correctWords / minutesPassed) : 0;

  useEffect(() => {
    setWpm(speed);
    onStatsUpdate({ wpm });
  }, [speed, wpm, onStatsUpdate]);

  return <Box pt={5}>{speed} words per minute</Box>;
};
