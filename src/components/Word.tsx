import { memo } from "react";
import { Box } from "@chakra-ui/react";

export const Word = memo(
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
