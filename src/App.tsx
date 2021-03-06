import { Box, Center, Container, Input } from "@chakra-ui/react";
import randomWords from "random-words";

import React, { useState } from "react";

import "./App.css";
import { Timer } from "./components/Timer";
import { IWord } from "./interfaces/IWord";
import { WordList } from "./components/WordList";
import { HintText } from "./components/HintText";
import { Stats } from "./components/Stats";
import TyperConfig from "./config/TyperConfig";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

let words: IWord[] = [];

function RefreshWords() {
  words = randomWords({ exactly: TyperConfig.wordCount }).map((word) => ({
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
  const [countdownKey, setCountdownKey] = useState(1000);
  const [wpm, setWpm] = useState(0);
  const [remainingTime, setRemainingTime] = useState(
    TyperConfig.countdownSeconds
  );

  const restartGame = () => {
    // We use the keys to refresh the game timer and countdown
    setInputValue("");
    setRound((r) => r + 1);
    setCountdownKey((c) => c + 1);
    setIsFinished(false);
    RefreshWords();
    setCurrentWordIndex(0);
    setStartCounting(false);
    setRemainingTime(TyperConfig.countdownSeconds);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (key === " " && !isFinished) {
      const { value } = e.currentTarget;

      const currentWord = words[currentWordIndex];
      currentWord.correct = value.trim() === currentWord.word.trim();
      setInputValue("");
      setCurrentWordIndex((c) => c + 1);
      // check if we have reached the end of the list
      if (currentWordIndex >= words.length - 1) {
        setIsFinished(true);
        setStartCounting(false);
      }
    } else if (key === "Enter" && isFinished) {
      restartGame();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return false;

    if (!startCounting) {
      setStartCounting(true);
    }
    setInputValue(e.currentTarget.value);
  };

  const handleStatsUpdate = ({ wpm }: { wpm: number }) => {
    setWpm(wpm);
  };

  const handleCountdownComplete = () => {
    setStartCounting(false);
    setIsFinished(true);
  };

  return (
    <Container mt="50px">
      <Box>
        <Center flexDir="column">
          <CountdownCircleTimer
            key={countdownKey}
            isPlaying={startCounting}
            duration={remainingTime}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[7, 5, 2, 0]}
            onComplete={handleCountdownComplete}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>

          <Timer
            key={round}
            startCounting={startCounting}
            correctWords={words.filter((word) => word.correct === true).length}
            onStatsUpdate={handleStatsUpdate}
          />
        </Center>
      </Box>
      <Box bg="text.primary" p={4}>
        <WordList words={words} currentWordIndex={currentWordIndex} />
      </Box>

      <Input
        placeholder="Type here"
        onKeyUp={handleKeyUp}
        autoFocus
        onChange={handleInputChange}
        value={inputValue}
      />
      <HintText isFinished={isFinished} isStarted={startCounting} />
      {isFinished && (
        <Stats
          wpm={wpm}
          accuracy={
            words.filter((word) => word.correct === true).length / words.length
          }
        />
      )}
    </Container>
  );
}

RefreshWords();
export default App;
