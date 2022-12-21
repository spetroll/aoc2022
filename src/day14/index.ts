import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const getRocks = (input: string) => {
  const lines = input.split("\n");
  return lines.map((l) => {
    return l.split("->").map((s) => {
      const [xString, yString] = s.split(",");
      return { x: Number(xString), y: Number(yString) };
    });
  });
};

const nextObstacle = (occupied: Map, coords: Coords, floor = -1) => {
  if (occupied[coords.x] === undefined) {
    return floor;
  }

  const column = Object.keys(occupied[coords.x]).map(Number);
  const index = column.find((c) => c >= coords.y);
  return index === -1 ? floor : index ?? floor;
};

type Map = { [key: number]: { [key: number]: boolean } };
type Coords = { x: number; y: number };

const tryLeft = (occupied: Map, coords: Coords) => {
  return (
    nextObstacle(occupied, { x: coords.x - 1, y: coords.y + 1 }) !==
    coords.y + 1
  );
};

const tryRight = (occupied: Map, coords: Coords) => {
  return (
    nextObstacle(occupied, { x: coords.x + 1, y: coords.y + 1 }) !==
    coords.y + 1
  );
};

const blockCoords = (occupied: Map, coords: Coords) => {
  if (occupied[coords.x] === undefined) {
    occupied[coords.x] = {};
  }
  occupied[coords.x][coords.y] = true;
  return occupied;
};

const getOccupied = (rocks: Coords[][]) => {
  let occupied = {} as Map;
  let floor = 2;
  for (const lines of rocks) {
    let index = 0;
    while (index < lines.length - 1) {
      const { x: x1, y: y1 } = lines[index];
      const { x: x2, y: y2 } = lines[index + 1];
      floor = Math.max(floor - 2, y1, y2) + 2;
      if (x1 === x2) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          blockCoords(occupied, { x: x1, y });
        }
      } else {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          blockCoords(occupied, { x, y: y1 });
        }
      }
      index += 1;
    }
  }

  return { occupied, floor };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const rocks = getRocks(input);
  const { occupied } = getOccupied(rocks);
  // console.log(rocks, occupied);
  let coords = { x: 500, y: 0 };
  let count = 0;
  while (true) {
    let obstacle = nextObstacle(occupied, coords);

    if (obstacle === -1) {
      // console.log("Sand fell off the map");
      return count;
    }
    coords = { x: coords.x, y: obstacle - 1 };

    if (tryLeft(occupied, coords)) {
      coords = { x: coords.x - 1, y: coords.y + 1 };
      continue;
    } else if (tryRight(occupied, coords)) {
      coords = { x: coords.x + 1, y: coords.y + 1 };
      continue;
    } else {
      blockCoords(occupied, { x: coords.x, y: coords.y });
      // console.log("Sand rested at ", { x: coords.x, y: coords.y });
      count += 1;
      coords = { x: 500, y: 0 };
      continue;
    }
  }
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const rocks = getRocks(input);
  const { occupied, floor } = getOccupied(rocks);
  // console.log("floor", floor);
  let coords = { x: 500, y: 0 };
  let count = 0;
  while (true) {
    let obstacle = nextObstacle(occupied, coords);

    if (obstacle === -1) {
      blockCoords(occupied, { x: coords.x, y: floor - 1 });
      // console.log("Sand came to rest on the floor");
      count += 1;
    }
    if (obstacle === 0) {
      // console.log("Sand couldn't flow any further");
      return count;
    }
    coords = { x: coords.x, y: obstacle - 1 };

    if (tryLeft(occupied, coords)) {
      coords = { x: coords.x - 1, y: coords.y + 1 };
      continue;
    } else if (tryRight(occupied, coords)) {
      coords = { x: coords.x + 1, y: coords.y + 1 };
      continue;
    } else {
      blockCoords(occupied, { x: coords.x, y: coords.y });
      // console.log("Sand rested at ", { x: coords.x, y: coords.y });
      count += 1;
      coords = { x: 500, y: 0 };
      continue;
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
