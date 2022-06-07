import { motion } from "framer-motion";
import { Center, Kbd } from "@chakra-ui/react";
import React from "react";

export function HintText({
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
