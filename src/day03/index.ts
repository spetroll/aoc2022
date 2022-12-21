import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const getPriority = (char: string) => {
  if (char.charCodeAt(0) >= "a".charCodeAt(0)) {
    return char.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }
  if (char.charCodeAt(0) >= "A".charCodeAt(0)) {
    return char.charCodeAt(0) - "A".charCodeAt(0) + 27;
  }
  return 0;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const rucksacks = input
    .split("\n")
    .map((r) => {
      const length = r.length;
      const firstHalf = new Set(r.slice(0, length / 2));
      const secondHalf = new Set(r.slice(length / 2));

      return new Set([...firstHalf].filter((x) => secondHalf.has(x)));
    })
    .map((x) => x.values().next().value)
    .map(getPriority);

  const result = rucksacks.reduce((a, b) => a + b, 0);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  let result = 0;
  let index = 0;
  while (index < lines.length) {
    const first = new Set(lines[index]);
    const second = new Set(lines[index + 1]);
    const third = new Set(lines[index + 2]);

    const intersection = new Set(
      [...first].filter((x) => second.has(x) && third.has(x)),
    );
    const value = getPriority(intersection.values().next().value);
    result += value;
    index += 3;
  }

  return result;
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
