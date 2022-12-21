import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const compare = (a: any, b: any): boolean | undefined => {
  if (typeof b === "undefined") {
    // console.log("right is undefined, false", a, b);
    return false;
  }
  if (typeof a === "undefined") {
    // console.log("left is undefined, correct", a, b);
    return true;
  }

  if (typeof a === "number" && typeof b === "number") {
    if (a === b) {
      return undefined;
    }
    // console.log("Compare number", a, b, a <= b);
    return a < b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      // console.log("Compare array index", i, a[i], b[i]);
      const comp = compare(a[i], b[i]);
      if (comp !== undefined) {
        // console.log("returned array index", i, a[i], b[i]);
        return comp;
      }
    }

    return undefined;
  }

  if (typeof a === "number" && Array.isArray(b)) {
    // console.log("Compare number to array", a, b);
    return compare([a], b);
  }

  if (Array.isArray(a) && typeof b === "number") {
    // console.log("Compare array to number", a, b);
    return compare(a, [b]);
  }
  return true;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const packets = input.split("\n\n");
  const result = packets.map((p) => {
    const [first, second] = p.split("\n").map((x) => JSON.parse(x));
    return { value: compare(first, second), p };
  });
  // console.log(result);
  return result.map((x, i) => (x.value ? i + 1 : 0)).reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const packets = input.split("\n\n");
  const divider1 = [[2]];
  const divider2 = [[6]];
  const allPackets = [
    ...packets
      .map((p) => {
        return p.split("\n").map((x) => JSON.parse(x));
      })
      .flat(),
    divider1,
    divider2,
  ];
  const sorted = allPackets.sort((a, b) => {
    const comp = compare(a, b);
    if (comp === undefined) {
      return 0;
    }
    return comp ? -1 : 1;
  });
  console.log(sorted);
  const a = sorted.findIndex((x) => x === divider1) + 1;
  const b = sorted.findIndex((x) => x === divider2) + 1;
  console.log(a, b);
  return a * b;
};

run({
  part1: {
    tests: [
      {
        input: `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
