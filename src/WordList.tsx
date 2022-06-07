import {IWord} from "./IWord";
import {Box} from "@chakra-ui/react";
import {Word} from "./Word";

export const WordList = ({
                             words,
                             currentWordIndex,
                         }: {
    words: IWord[];
    currentWordIndex: number;
}) => {
    return (
        <Box padding="10px 15px" backgroundColor="yellow.100" data-testid="word-list">
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