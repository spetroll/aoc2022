import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let a = 4;
  while (a < input.length) {
    if (new Set(input.slice(a - 4, a)).size === 4) {
      return a;
    }
    a++;
  }

  // while (d < input.length) {
  //   if (new Set(input[a] + input[b] + input[c] + input[d]).size === 4) {
  //     return d + 1;
  //   }
  //   a++;
  //   b++;
  //   c++;
  //   d++;
  // }

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let a = 14;

  while (a < input.length) {
    if (new Set(input.slice(a - 14, a)).size === 14) {
      return a;
    }
    a++;
  }

  return;
};

run({
  part1: {
    tests: [
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
