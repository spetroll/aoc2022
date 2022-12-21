import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let cycle = 0;
  let register = 1;
  const values: { [key: number]: number } = {};
  for (let line of input) {
    // console.log(cycle, register, line);
    let addCycle = 0;
    let callback = (x: number) => x;
    const [instruction, value] = line.split(" ");
    if (instruction === "addx") {
      callback = addxCallback(Number(value));
      addCycle = 2;
    } else if (instruction === "noop") {
      addCycle = 1;
    }

    for (let i = 0; i < addCycle; i++) {
      cycle++;
      if (cycle === 20 || (cycle - 20) % 40 === 0) {
        values[cycle] = register;
      }
    }
    register = callback(register);
  }
  // console.log(values);
  return Object.entries(values).reduce(
    (acc, [key, val]) => acc + Number(key) * val,
    0,
  );
};

const addxCallback = (value: number) => (register: number) => register + value;

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let cycle = 0;
  let register = 1;
  const output: Array<Array<string>> = [[], [], [], [], [], []];
  const values: { [key: number]: number } = {};
  for (let line of input) {
    // console.log(cycle, register, line);
    let addCycle = 0;
    let callback = (x: number) => x;
    const [instruction, value] = line.split(" ");
    if (instruction === "addx") {
      callback = addxCallback(Number(value));
      addCycle = 2;
    } else if (instruction === "noop") {
      addCycle = 1;
    }

    for (let i = 0; i < addCycle; i++) {
      const pixel = cycle % 40;
      const row = Math.floor(cycle / 40);
      if (pixel >= register - 1 && pixel <= register + 1) {
        output[row][pixel] = "#";
      } else {
        output[row][pixel] = ".";
      }
      cycle++;
    }
    register = callback(register);
  }
  const result = output.map((x) => x.join("")).join("\n");
  console.log(result);
  return result;
};

run({
  part1: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
