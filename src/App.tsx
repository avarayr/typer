// Typing speed test game for React

import { Box, Center, Container, Input, Kbd } from "@chakra-ui/react";
import randomWords from "random-words";
import { motion } from "framer-motion";

import { useState, memo, useEffect } from "react";
import GaugeChart from "react-gauge-chart";

import "./App.css";

interface IWord {
  word: string;
  correct: boolean | null;
}
const Word = memo(
  ({
    word,
    active,
    correct,
    incorrect,
  }: {
    word: string;
    active: boolean;
    correct: boolean;
    incorrect: boolean;
  }) => {
    word = word.trim() + " ";
    if (correct) {
      return (
        <Box className="word" bg="lime" color="black">
          {word}
        </Box>
      );
    }
    if (incorrect) {
      return (
        <Box className="word" bg="red" color="black">
          {word}
        </Box>
      );
    }
    if (active) {
      return (
        <Box className="word" color="black" fontWeight="bold">
          {word}
        </Box>
      );
    }
    return (
      <Box className="word" color="black">
        {word}
      </Box>
    );
  }
);
const Timer = ({
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
        setTimeElapsed((t: number) => {
          console.log(t + 1);
          return t + 1;
        });
      }, 1000);
      setIntervalId(interval);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
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

  return <Box>{speed} words per minute</Box>;
};

const WordList = ({
  words,
  currentWordIndex,
}: {
  words: IWord[];
  currentWordIndex: number;
}) => {
  return (
    <Box>
      {words.map((word, index) => (
        <Word
          key={index}
          word={word.word}
          active={index === currentWordIndex}
          correct={word.correct === true}
          incorrect={word.correct === false}
        />
      ))}
    </Box>
  );
};

let words: IWord[] = randomWords({ exactly: 4 }).map((word) => ({
  word,
  correct: null,
}));

function RefreshWords() {
  words = randomWords({ exactly: 4 }).map((word) => ({
    word,
    correct: null,
  }));
}

function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [startCounting, setStartCounting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [round, setRound] = useState(0);
  const [wpm, setWpm] = useState(0);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (key === " " && !isFinished) {
      const { value } = e.currentTarget;

      const currentWord = words[currentWordIndex];
      if (value.trim() === currentWord.word.trim()) {
        currentWord.correct = true;
      } else {
        currentWord.correct = false;
      }
      setInputValue("");
      setCurrentWordIndex((c) => c + 1);
      // check if we have reached the end of the list
      if (currentWordIndex >= words.length - 1) {
        setIsFinished(true);
        setStartCounting(false);
      }
    } else if (key === "Enter" && isFinished) {
      // We use the round variable to force-refresh the timer
      setRound((r) => r + 1);
      setIsFinished(false);
      RefreshWords();
      setCurrentWordIndex(0);
      setStartCounting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startCounting) {
      setStartCounting(true);
    }
    setInputValue(e.currentTarget.value);
  };

  const handleStatsUpdate = ({ wpm }: { wpm: number }) => {
    setWpm(wpm);
  };

  return (
    <Container mt="50px">
      <Box>
        <Timer
          key={round}
          startCounting={startCounting}
          correctWords={words.filter((word) => word.correct === true).length}
          onStatsUpdate={handleStatsUpdate}
        />
      </Box>
      <Box bg="text.primary" p={4}>
        <WordList words={words} currentWordIndex={currentWordIndex} />
      </Box>
      {/* input */}
      <Input
        placeholder="Type here"
        onKeyUp={handleKeyUp}
        autoFocus
        onChange={handleInputChange}
        value={inputValue}
      />
      <HintText isFinished={isFinished} isStarted={startCounting} />
      {isFinished && <Stats wpm={wpm} />}
    </Container>
  );
}
function HintText({
  isStarted,
  isFinished,
}: {
  isStarted: boolean;
  isFinished: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isFinished && (
        <Center mt={10} fontSize={20}>
          Press&nbsp;<Kbd>Enter</Kbd>&nbsp;to restart
        </Center>
      )}
      {!isFinished && !isStarted && (
        <Center mt={10} fontSize={20}>
          Start typing...
        </Center>
      )}
    </motion.div>
  );
}

function Stats({ wpm }: { wpm: number }) {
  return (
    <Center bg="text.primary" pt={20}>
      <motion.div
        // slide down and fade in
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GaugeChart
          style={{ width: "400px" }}
          id="gauge-chart3"
          nrOfLevels={20}
          formatTextValue={(_) => `${Math.round(Number(wpm)).toString()} WPM`}
          textColor="black"
          animDelay={0}
          fontSize="23"
          colors={["#f00", "#0f0"]}
          arcWidth={0.2}
          percent={Math.min(1, wpm / 130)}
        />
      </motion.div>
    </Center>
  );
}

export default App;
