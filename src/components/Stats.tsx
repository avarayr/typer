import { Center } from "@chakra-ui/react";
import { motion } from "framer-motion";
import GaugeChart from "react-gauge-chart";
import React from "react";

export function Stats({ wpm, accuracy }: { wpm: number; accuracy: number }) {
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
          percent={Math.min(1, wpm / 120)}
        />
        <GaugeChart
          style={{ width: "400px", paddingTop: "50px" }}
          id="gauge-chart3"
          nrOfLevels={20}
          formatTextValue={(_) =>
            `${Math.round(Number(accuracy * 100)).toString()}% accuracy`
          }
          textColor="black"
          animDelay={0}
          fontSize="23"
          colors={["#f00", "#ff0"]}
          arcWidth={0.2}
          percent={Math.min(1, accuracy)}
        />
      </motion.div>
    </Center>
  );
}
