import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const elves = input.split("\n\n");
  const sums = elves.map((e) =>
    e
      .split("\n")
      .map(Number)
      .reduce((a, b) => a + b, 0),
  );
  const max = Math.max(...sums);
  return max;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const elves = input.split("\n\n");
  const sums = elves
    .map((e) =>
      e
        .split("\n")
        .map(Number)
        .reduce((a, b) => a + b, 0),
    )
    .sort((a, b) => b - a);
  return sums.slice(3).reduce((a, b) => a + b, 0);
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
