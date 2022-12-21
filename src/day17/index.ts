import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type Coord = { x: number; y: number };

const shapes = [
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  [[1], [1], [1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
];

const nextShape = (rockCount: number) => {
  return shapes[rockCount % 5];
};

const moveLeft = (coord: Coord, shape: number[][], grid: number[][]) => {
  // console.log("move left", coord);
  if (coord.x > 0) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (shape[y][x] === 1 && grid[coord.y + y][coord.x + x - 1] === 1) {
          return coord;
        }
      }
    }
    return { x: coord.x - 1, y: coord.y };
  }
  return coord;
};

const moveRight = (coord: Coord, shape: number[][], grid: number[][]) => {
  // console.log("move right", coord);
  if (coord.x < grid[0].length - shape[0].length) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (shape[y][x] === 1 && grid[coord.y + y][coord.x + x + 1] === 1) {
          return coord;
        }
      }
    }
    return { x: coord.x + 1, y: coord.y };
  }
  return coord;
};

const moveDown = (coord: Coord, shape: number[][], grid: number[][]) => {
  // console.log("move down", coord);
  if (coord.y >= 1) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        if (shape[y][x] === 1 && grid[coord.y + y - 1][coord.x + x] === 1) {
          // console.log("hit different rock", {
          //   x: coord.x + x,
          //   y: coord.y + y - 1,
          // });
          return coord;
        }
      }
    }
    return { x: coord.x, y: coord.y - 1 };
  }
  // console.log("early exit", coord.y, shape.length - 1);
  return coord;
};

const applyToGrid = (coord: Coord, shape: number[][], grid: number[][]) => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[0].length; x++) {
      if (shape[y][x] === 1) {
        grid[coord.y + y][coord.x + x] = 1;
      }
    }
  }
};

const printGridAndShape = (
  coord: Coord,
  shape: number[][],
  grid: number[][],
) => {
  for (let y = grid.length - 1; y >= 0; y--) {
    let line = y.toString().padEnd(4 + 2, " ") + "|";
    for (let x = 0; x < grid[0].length; x++) {
      if (y >= coord.y && y < coord.y + shape.length) {
        if (x >= coord.x && x < coord.x + shape[0].length) {
          line += shape[y - coord.y][x - coord.x] === 1 ? "@" : ".";
          continue;
        }
      }

      line += grid[y][x] === 1 ? "#" : ".";
    }
    line += "|";
    console.log(line);
  }
  console.log("     ", "".padEnd(grid[0].length + 2, "-"));
};

const getHighestY = (grid: number[][]) => {
  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 1) {
        return y + 1;
      }
    }
  }
  return 0;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let grid = new Array(20).fill(0).map(() => new Array(7).fill(0));

  const jetCount = input.length;

  let count = 0;
  let command = 0;
  let start = 3;
  while (count < 2022) {
    let shape = nextShape(count);

    if (grid.length < start + shape.length) {
      grid = [
        ...grid,
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
      ];
    }

    let position = { x: 2, y: start };

    // printGridAndShape(position, shape, grid);
    while (true) {
      position =
        rawInput[command % jetCount] === "<"
          ? moveLeft(position, shape, grid)
          : moveRight(position, shape, grid);

      command++;
      const down = moveDown(position, shape, grid);
      if (down.y === position.y) {
        applyToGrid(position, shape, grid);
        break;
      }
      position = down;
    }
    start = getHighestY(grid) + 3;
    count++;
  }

  // printGridAndShape({ x: 0, y: 0 }, [], grid);
  return getHighestY(grid);
};

const getHeightMapFromY = (grid: number[][]) => {
  const heightMap = new Array(grid[0].length).fill(0);
  let maxY = 0;
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y][x] === 1) {
        heightMap[x] = y + 1;
        maxY = Math.max(maxY, y + 1);
        break;
      }
    }
  }
  return heightMap.map((y) => maxY - y).join(" ");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let grid = new Array(20).fill(0).map(() => new Array(7).fill(0));

  const jetCount = input.length;
  const heightProfiles = new Set<string>();
  const heightsByCount = new Map<number, number>();

  let count = 0;
  let command = 0;
  let start = 3;
  let found = 0;
  let cycleStart = 0;
  let cycleEnd = 0;
  while (count < 100000) {
    let shape = nextShape(count);

    if (grid.length < start + shape.length) {
      grid = [
        ...grid,
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
      ];
    }

    let position = { x: 2, y: start };

    // printGridAndShape(position, shape, grid);
    while (true) {
      position =
        rawInput[command % jetCount] === "<"
          ? moveLeft(position, shape, grid)
          : moveRight(position, shape, grid);

      command++;
      const down = moveDown(position, shape, grid);
      if (down.y === position.y) {
        applyToGrid(position, shape, grid);
        break;
      }
      position = down;
    }

    count++;
    start = getHighestY(grid) + 3;

    const profile = getHeightMapFromY(grid);
    const shapeIndex = count % 5;
    const commandIndex = command % jetCount;
    const combinedKey = `${profile} ${shapeIndex} ${commandIndex}`;
    heightsByCount.set(count, getHighestY(grid));
    if (heightProfiles.has(combinedKey)) {
      console.log("found it", combinedKey, count);
      found++;
      if (found === 2) {
        cycleEnd = count;
        break;
      }
      cycleStart = count;
      heightProfiles.clear();
    }
    heightProfiles.add(combinedKey);
  }

  console.log("Found cycle after turn ", count);
  const size = cycleEnd - cycleStart;
  console.log("Cycle start", cycleStart, "cycle end", cycleEnd, size);
  const difference =
    heightsByCount.get(cycleEnd)! - heightsByCount.get(cycleStart)!;
  console.log("Height difference is  ", difference);
  const fullCycles = Math.floor((1000000000000 - cycleStart) / size);
  const remainder = (1000000000000 - cycleStart) % size;
  const countFullCycles = difference * fullCycles;
  const countRemainder =
    heightsByCount.get(cycleStart + remainder)! -
    heightsByCount.get(cycleStart)!;
  console.log("Full cycles", fullCycles, "remainder", remainder);
  console.log(
    "Full cycles height",
    countFullCycles,
    "remainder height",
    countRemainder,
  );
  console.log("Total", countFullCycles + countRemainder);

  return heightsByCount.get(cycleStart)! + countFullCycles + countRemainder;
};

run({
  part1: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
