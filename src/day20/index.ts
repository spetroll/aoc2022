import run from "aocrunner";

const parseInput = (rawInput: string): number[] =>
  rawInput.trim().split("\n").map(Number);

const mix = (numbers: number[], times = 1) => {
  const indizes = [...Array(numbers.length).keys()];

  for (let i = 0; i < times; i++) {
    for (const index of Array(numbers.length).keys()) {
      const oldIndex = indizes.indexOf(index);
      indizes.splice(oldIndex, 1);
      const newIndex = (oldIndex + numbers[index]) % indizes.length;
      indizes.splice(newIndex, 0, index);
    }
  }

  const zeroIndex = indizes.indexOf(numbers.indexOf(0));

  const result = [1000, 2000, 3000].map(
    (x) => numbers[indizes[(x + zeroIndex) % indizes.length]],
  );
  return result;
};

const part1 = (input: string) => {
  const numbers = parseInput(input);
  const indizes = mix(numbers);
  return indizes.reduce((a, b) => a + b, 0);
};

const part2 = (input: string) => {
  const numbers = parseInput(input).map((x) => x * 811589153);
  const indizes = mix(numbers, 10);
  return indizes.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `1
2
-3
3
-2
0
4`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1
      2
      -3
      3
      -2
      0
      4`,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
