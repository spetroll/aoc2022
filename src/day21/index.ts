import run from "aocrunner";

type Operation = (a: number, b: number) => number;
const add = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;
const divide = (a: number, b: number) => a / b;
const subtract = (a: number, b: number) => a - b;

const parseInput = (rawInput: string) => {
  const known = new Map<string, number>();
  const unknown = new Map<
    string,
    { numbers: string[]; operation: Operation }
  >();

  rawInput.split("\n").map((x) => {
    const [name, problem] = x.split(": ");
    if (problem.includes("+")) {
      unknown.set(name, {
        numbers: problem.split(" + ").map((x) => x.trim()),
        operation: add,
      });
    } else if (problem.includes("*")) {
      unknown.set(name, {
        numbers: problem.split(" * ").map((x) => x.trim()),
        operation: multiply,
      });
    } else if (problem.includes("/")) {
      unknown.set(name, {
        numbers: problem.split(" / ").map((x) => x.trim()),
        operation: divide,
      });
    } else if (problem.includes("-")) {
      unknown.set(name, {
        numbers: problem.split(" - ").map((x) => x.trim()),
        operation: subtract,
      });
    } else {
      known.set(name, Number(problem));
    }
  });

  return { known, unknown };
};

const calculateRoot = (
  known: Map<string, number>,
  unknown: Map<string, { numbers: string[]; operation: Operation }>,
) => {
  while (unknown.has("root")) {
    for (const [name, { numbers, operation }] of unknown) {
      const values = numbers.map((x) => known.get(x));
      if (values.every((x) => x !== undefined)) {
        known.set(name, operation(values[0]!, values[1]!));
        unknown.delete(name);
      }
    }
  }
  const root = known.get("root")!;
  return root;
};

const part1 = (rawInput: string) => {
  const { known, unknown } = parseInput(rawInput);

  return calculateRoot(known, unknown);
};
const clean = (rawInput: string) => {
  const { known, unknown } = parseInput(rawInput);
  known.delete("humn");
  const numbers = unknown.get("root")!.numbers;
  unknown.set("root", {
    numbers,
    operation: (a, b) => a - b,
  });

  const cleanedKnown = new Map<string, number>(known);
  const cleanedUnknown = new Map<
    string,
    { numbers: string[]; operation: Operation }
  >(unknown);
  return { known: cleanedKnown, unknown: cleanedUnknown };
};
const part2 = (rawInput: string) => {
  const binarySearch = (min: number, max: number): number => {
    const { known, unknown } = clean(rawInput);
    const human = Math.floor((min + max) / 2);
    known.set("humn", human);
    const root = calculateRoot(known, unknown);

    console.log("Calculate with human", human, "=", root);
    if (root === 0) {
      return human;
    }
    if (root < 0) {
      return binarySearch(min, human);
    }
    return binarySearch(human, max);
  };

  return binarySearch(-1000000000000000, 1000000000000000);
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
