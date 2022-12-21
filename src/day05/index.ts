import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const readStacks = (input: string) => {
  const reversed = input.split("\n").reverse();
  const numberOfStacks = reversed[0].split(" ").filter((x) => x.length).length;
  const stacks = new Array(numberOfStacks).fill(0).map((): Array<string> => []);

  for (const line of reversed.slice(1)) {
    for (let i = 0; i < numberOfStacks; i++) {
      const char = line[1 + i * 4];

      if (char !== " ") {
        stacks[i].push(char);
      }
    }
  }
  return stacks;
};

const executePlan = (stacks: Array<Array<string>>, plan: string) => {
  const procedures = plan.split("\n");
  procedures.forEach((p) => {
    const [amount, fromStack, toStack] = p
      .split(" ")
      .map(Number)
      .filter((x) => x);
    for (let i = 0; i < amount; i++) {
      const char = stacks[fromStack - 1].pop();
      if (char) {
        stacks[toStack - 1].push(char);
      }
    }
  });
  return stacks;
};

const executePlan9001 = (stacks: Array<Array<string>>, plan: string) => {
  const procedures = plan.split("\n");
  procedures.forEach((p) => {
    const [amount, fromStack, toStack] = p
      .split(" ")
      .map(Number)
      .filter((x) => x);
    const removed = stacks[fromStack - 1].splice(-amount);
    stacks[toStack - 1].push(...removed);
  });
  return stacks;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [startingStacksInput, planInput] = input.split("\n\n");

  const stacks = readStacks(startingStacksInput);
  const result = executePlan(stacks, planInput);
  console.log(result);
  return result.map((s) => s.pop()).join("");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [startingStacksInput, planInput] = input.split("\n\n");

  const stacks = readStacks(startingStacksInput);
  const result = executePlan9001(stacks, planInput);
  console.log(result);
  return result.map((s) => s.pop()).join("");
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
