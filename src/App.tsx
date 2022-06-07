// Typing speed test game for React

import { Box, Container, Input } from "@chakra-ui/react";
import randomWords from "random-words";

import { useState, memo, useEffect } from "react";

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
        setTimeElapsed((t: number) => t + 1);
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

const words: IWord[] = randomWords({ exactly: 10 }).map((word) => ({
  word,
  correct: null,
}));

function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [startCounting, setStartCounting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startCounting) {
      console.log("startCounting");
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

      {isFinished && <Stats wpm={wpm} />}
    </Container>
  );
}

function Stats({ wpm }: { wpm: number }) {
  return (
    <Box
      bg="text.primary"
      p={4}
      fontSize="2xl"
      fontWeight="bold"
      textAlign="center"
    >
      {wpm} words per minute
    </Box>
  );
}

export default App;
