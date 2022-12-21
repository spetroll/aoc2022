import run from "aocrunner";
import { isNativeError } from "util/types";

const parseInput = (rawInput: string) => rawInput;

type OpponentShape = "A" | "B" | "C";
type MyShape = "X" | "Y" | "Z";
type Outcome = "W" | "L" | "D";

const getOutcomeFromShape = (shape: MyShape): Outcome => {
  return { X: "L", Y: "D", Z: "W" }[shape] as Outcome;
};

const getGameScore = (opponentShape: OpponentShape, myShape: MyShape) => {
  const mappings = {
    ["A X"]: 3 + 1,
    ["B Y"]: 3 + 2,
    ["C Z"]: 3 + 3,
    ["A Y"]: 6 + 2,
    ["A Z"]: 0 + 3,
    ["B X"]: 0 + 1,
    ["B Z"]: 6 + 3,
    ["C X"]: 6 + 1,
    ["C Y"]: 0 + 2,
  } as const;
  return mappings[`${opponentShape} ${myShape}`] || 0;
};
const chooseShapeForOutcome = (
  opponentShape: OpponentShape,
  desiredOutCome: Outcome,
) => {
  const mappings = {
    D: { A: "X", B: "Y", C: "Z" },
    W: { A: "Y", B: "Z", C: "X" },
    L: { A: "Z", B: "X", C: "Y" },
  };
  return mappings[desiredOutCome][opponentShape];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const rounds = lines.map((line) => {
    const [opponentShape, myShape] = line.split(" ");
    return getGameScore(opponentShape as OpponentShape, myShape as MyShape);
  });

  return rounds.reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const rounds = lines.map((line) => {
    const [opponentShape, outcome] = line.split(" ");
    const mappedOutcome = getOutcomeFromShape(outcome as MyShape);
    const symbol = chooseShapeForOutcome(
      opponentShape as OpponentShape,
      mappedOutcome as Outcome,
    );
    return getGameScore(opponentShape as OpponentShape, symbol as MyShape);
  });

  return rounds.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
