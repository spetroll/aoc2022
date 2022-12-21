import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const assignments = input.split("\n");
  const result = assignments
    .map((a): number => {
      const [firstPair, secondPair] = a.split(",");

      const [firstMin, firstMax] = firstPair.split("-").map(Number);
      const firsSet = new Set();
      for (let i = firstMin; i <= firstMax; i++) {
        firsSet.add(i);
      }

      const [secondMin, secondMax] = secondPair.split("-").map(Number);
      const secondSet = new Set();
      for (let i = secondMin; i <= secondMax; i++) {
        secondSet.add(i);
      }

      const largestSet =
        firsSet.size > secondSet.size ? firsSet.size : secondSet.size;

      const combined = new Set([...firsSet, ...secondSet]);
      const contained = largestSet === combined.size;
      // console.log(smallestSet, largestSet, combined, contained);
      return contained ? 1 : 0;
    })
    .reduce((a, b) => a + b, 0);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const assignments = input.split("\n");
  const result = assignments
    .map((a): number => {
      const [firstPair, secondPair] = a.split(",");

      const [firstMin, firstMax] = firstPair.split("-").map(Number);
      const firsSet = new Set();
      for (let i = firstMin; i <= firstMax; i++) {
        firsSet.add(i);
      }

      const [secondMin, secondMax] = secondPair.split("-").map(Number);
      const secondSet = new Set();
      for (let i = secondMin; i <= secondMax; i++) {
        secondSet.add(i);
      }

      const largestSet =
        firsSet.size > secondSet.size ? firsSet.size : secondSet.size;

      const combined = new Set([...firsSet, ...secondSet]);
      const contained = firsSet.size + secondSet.size !== combined.size;
      // console.log(smallestSet, largestSet, combined, contained);
      return contained ? 1 : 0;
    })
    .reduce((a, b) => a + b, 0);

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 2,
      },
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
