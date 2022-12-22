import run from "aocrunner";

const parseInput = (
  rawInput: string,
): { map: string[][]; instructions: (number | string)[] } => {
  let [mapStr, instStr] = rawInput.split("\n\n");
  const map = mapStr.split("\n").map((line) => line.split(""));
  const instructions = instStr
    .match(/(\d+)|([A-Z]+)/gi)!
    .map((inst) => (/\d+/.test(inst) ? parseInt(inst, 10) : inst));
  return { map, instructions };
};

const printMap = (map: string[][], path: number[][], x: number, y: number) => {
  const newMap = map.map((row) => row.map((x) => x));
  newMap[y][x] = "X";
  path.forEach(([x, y]) => {
    newMap[y][x] = "O";
  });
  console.log(newMap.map((x) => x.join("")).join("\n"));
};
const moveRight = (map: string[][], x: number, y: number) => {
  let nextX = x + 1;
  const nextY = y;
  if (nextX < map[nextY].length && map[nextY][nextX] === "#") {
    return [x, y];
  }
  if (nextX < map[nextY].length && map[nextY][nextX] === ".") {
    return [nextX, nextY];
  } else {
    nextX = 0;
    while (map[nextY][nextX] === " ") {
      nextX++;
    }
    if (map[nextY][nextX] === "#") {
      return [x, y];
    }
    return [nextX, nextY];
  }
};

const moveLeft = (map: string[][], x: number, y: number) => {
  let nextX = x - 1;
  let nextY = y;
  if (nextX >= 0 && map[nextY][nextX] === "#") {
    return [x, y];
  }
  if (nextX >= 0 && map[nextY][nextX] === ".") {
    return [nextX, nextY];
  } else {
    nextX = map[nextY].length - 1;
    while (map[nextY][nextX] === " ") {
      nextX--;
    }

    if (map[nextY][nextX] === "#") {
      return [x, y];
    }
    return [nextX, nextY];
  }
};

const moveDown = (map: string[][], x: number, y: number) => {
  let nextX = x;
  let nextY = y + 1;
  if (nextY < map.length && map[nextY][nextX] === "#") {
    return [x, y];
  }
  if (nextY < map.length && map[nextY][nextX] === ".") {
    return [nextX, nextY];
  } else {
    nextY = 0;
    while (map[nextY][nextX] === " ") {
      nextY++;
    }

    if (map[nextY][nextX] === "#") {
      return [x, y];
    }
    return [nextX, nextY];
  }
};

const moveUp = (map: string[][], x: number, y: number) => {
  let nextX = x;
  let nextY = y - 1;
  if (nextY >= 0 && map[nextY][nextX] === "#") {
    return [x, y];
  }
  if (nextY >= 0 && map[nextY][nextX] === ".") {
    return [nextX, nextY];
  } else {
    nextY = map.length - 1;
    while (map[nextY][nextX] === " ") {
      nextY--;
    }
    if (map[nextY][nextX] === "#") {
      return [x, y];
    }
    return [nextX, nextY];
  }
};

const findNextNumber = (description: string, index: number) => {
  let nextNumber = "";
  while (
    description[index] !== "L" &&
    description[index] !== "R" &&
    index < description.length
  ) {
    nextNumber += description[index];
    index++;
  }
  return [Number(nextNumber), index];
};

const getNewDirection = (direction: string, turn: string) => {
  if (direction === "R") {
    if (turn === "L") {
      return "U";
    } else {
      return "D";
    }
  } else if (direction === "L") {
    if (turn === "L") {
      return "D";
    } else {
      return "U";
    }
  } else if (direction === "U") {
    if (turn === "L") {
      return "L";
    } else {
      return "R";
    }
  } else if (direction === "D") {
    if (turn === "L") {
      return "R";
    } else {
      return "L";
    }
  }
  throw new Error("Invalid direction");
};

const part1 = (rawInput: string) => {
  let { map, instructions } = parseInput(rawInput);
  console.log(instructions);
  const biggestX = map.reduce((acc, l) => Math.max(acc, l.length), 0);
  map = map.map((l) => l.concat(Array(biggestX - l.length).fill(" ")));

  let x = map[0].findIndex((x) => x === ".");
  let y = 0;
  let direction = "R";
  let curr = 0;
  const path = [[x, y]];

  // x = 2;
  // y = 5;
  // for (let i = 0; i < 10; i++) {
  //   [x, y] = moveRight(map, x, y);
  //   path.push([x, y]);
  // }
  while (curr < instructions.length) {
    const steps = instructions[curr];
    console.log(`Going ${direction} for ${steps} steps`);
    if (direction === "R") {
      for (let i = 0; i < steps; i++) {
        [x, y] = moveRight(map, x, y);
        path.push([x, y]);
      }
    } else if (direction === "L") {
      for (let i = 0; i < steps; i++) {
        [x, y] = moveLeft(map, x, y);
        path.push([x, y]);
      }
    } else if (direction === "U") {
      for (let i = 0; i < steps; i++) {
        [x, y] = moveUp(map, x, y);
        path.push([x, y]);
      }
    } else if (direction === "D") {
      for (let i = 0; i < steps; i++) {
        [x, y] = moveDown(map, x, y);
        path.push([x, y]);
      }
    }
    curr++;
    if (curr < instructions.length) {
      direction = getNewDirection(
        direction,
        instructions[curr] as unknown as string,
      );
    }
    curr++;
  }

  printMap(map, path, x, y);
  console.log(x, y, direction);
  const directionScore =
    direction === "R" ? 0 : direction === "L" ? 2 : direction === "U" ? 3 : 1;
  return 1000 * (y + 1) + (x + 1) * 4 + directionScore;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#.... 
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`,
        expected: 6032,
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
  trimTestInputs: false,
  onlyTests: false,
});
