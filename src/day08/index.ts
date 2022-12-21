import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type Coord = { x: number; y: number };
const visibleFromTop = (input: string[], reversed = false) => {
  // console.log(input, reversed);
  const visible = new Set<string>();
  const startX = reversed ? input[0].length - 2 : 1;
  const endX = reversed ? 0 : input[0].length - 1;
  const startY = reversed ? input.length - 1 : 0;
  const endY = reversed ? 0 : input.length - 1;

  let x = startX;
  while (x != endX) {
    let currentMax = 0;
    let y = startY;
    while (y != endY) {
      const height = Number(input[x][y]);
      // console.log("testing", x, y, height);
      if (currentMax < height && y !== 0 && y !== input.length - 1) {
        // console.log("added visible", { height, currentMax, x, y });
        visible.add(`${x},${y},${height}`);
      }
      currentMax = Math.max(currentMax, height);

      if (currentMax === 9) {
        break;
      }
      reversed ? y-- : y++;
    }
    reversed ? x-- : x++;
  }

  return visible;
};

const visibleFromLeft = (input: string[], reversed = false) => {
  // console.log(input, reversed);
  const visible = new Set<string>();
  const startX = reversed ? input[0].length - 1 : 0;
  const endX = reversed ? 0 : input[0].length - 1;
  const startY = reversed ? input.length - 2 : 1;
  const endY = reversed ? 0 : input.length - 1;

  let y = startY;
  while (y != endY) {
    let currentMax = 0;
    let x = startX;
    while (x != endX) {
      const height = Number(input[x][y]);
      // console.log("testing", x, y, height);
      if (currentMax < height && x !== 0 && x !== input.length - 1) {
        // console.log("added visible", { height, currentMax, x, y });
        visible.add(`${x},${y},${height}`);
      }
      currentMax = Math.max(currentMax, height);

      if (currentMax === 9) {
        break;
      }
      reversed ? x-- : x++;
    }
    reversed ? y-- : y++;
  }

  return visible;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const baseLine = lines.length * 2 + lines[0].length * 2 - 4;

  const visible1 = visibleFromTop(lines);
  const visible2 = visibleFromTop(lines, true);
  const visible3 = visibleFromLeft(lines);
  const visible4 = visibleFromLeft(lines, true);

  const combinedSet = new Set([
    ...visible1,
    ...visible2,
    ...visible3,
    ...visible4,
  ]);

  return baseLine + combinedSet.size;
};

const getScore = (input: string[], coord: Coord) => {
  // console.log(input, reversed);
  const visible = new Set<string>();
  const originHeight = Number(input[coord.x][coord.y]);

  let scoreUp = 0;
  let y = coord.y;
  let x = coord.x - 1;
  while (x >= 0) {
    // console.log("up", x, y, Number(input[x][y]));
    if (Number(input[x][y]) < originHeight) {
      scoreUp++;
    }
    if (Number(input[x][y]) >= originHeight) {
      scoreUp++;
      break;
    }
    x--;
  }
  // console.log("up", scoreUp);
  let scoreDown = 0;
  y = coord.y;
  x = coord.x + 1;
  while (x < input.length) {
    // console.log("down", x, y, Number(input[x][y]));
    if (Number(input[x][y]) < originHeight) {
      scoreDown++;
    }

    if (Number(input[x][y]) >= originHeight) {
      scoreDown++;
      break;
    }
    x++;
  }
  // console.log("down", scoreDown);
  let scoreLeft = 0;
  y = coord.y - 1;
  x = coord.x;
  while (y >= 0) {
    // console.log("left", x, y, Number(input[x][y]));
    if (Number(input[x][y]) < originHeight) {
      scoreLeft++;
    }
    if (Number(input[x][y]) >= originHeight) {
      scoreLeft++;
      break;
    }
    y--;
  }
  // console.log("left", scoreLeft);
  let scoreRight = 0;
  y = coord.y + 1;
  x = coord.x;
  while (y < input[0].length) {
    // console.log("right", x, y, Number(input[x][y]));
    if (Number(input[x][y]) < originHeight) {
      scoreRight++;
    }
    if (Number(input[x][y]) >= originHeight) {
      scoreRight++;
      break;
    }
    y++;
  }
  // console.log("right", scoreRight);
  // console.log({ scoreUp, scoreDown, scoreLeft, scoreRight });
  return scoreUp * scoreDown * scoreLeft * scoreRight;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  let maxScore = 0;
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[0].length; y++) {
      maxScore = Math.max(maxScore, getScore(input, { x, y }));
    }
  }

  return maxScore;
};

run({
  part1: {
    tests: [
      {
        input: `
        30373
25512
65332
33549
35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
