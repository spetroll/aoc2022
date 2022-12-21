import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

type Cube = { x: number; y: number; z: number };

const getBoundary = (cubes: Set<string>) => {
  const min = { x: 0, y: 0, z: 0 };
  const max = { x: 0, y: 0, z: 0 };
  for (const cube of cubes) {
    const [x, y, z] = cube.split(",").map(Number);
    if (x < min.x) {
      min.x = x;
    }
    if (x > max.x) {
      max.x = x;
    }
    if (y < min.y) {
      min.y = y;
    }
    if (y > max.y) {
      max.y = y;
    }
    if (z < min.z) {
      min.z = z;
    }
    if (z > max.z) {
      max.z = z;
    }
  }
  return { min, max };
};

const printCubes = (cubes: Set<string>) => {
  const { min, max } = getBoundary(cubes);
  for (let z = min.z; z <= max.z; z++) {
    console.log(`z=${z}`);
    for (let y = min.y; y <= max.y; y++) {
      let line = "";
      for (let x = min.x; x <= max.x; x++) {
        if (cubes.has(`${x},${y},${z}`)) {
          line += "#";
        } else {
          line += ".";
        }
      }
      console.log(line);
    }
  }
};

const getAdjacentNeighbours = (cube: string) => {
  const [x, y, z] = cube.split(",").map(Number);
  const neighbours: string[] = [];
  neighbours.push(`${x - 1},${y},${z}`);
  neighbours.push(`${x + 1},${y},${z}`);
  neighbours.push(`${x},${y - 1},${z}`);
  neighbours.push(`${x},${y + 1},${z}`);
  neighbours.push(`${x},${y},${z - 1}`);
  neighbours.push(`${x},${y},${z + 1}`);

  return neighbours;
};

const countExposedSides = (cube: string, cubes: Set<string>) => {
  const neighbours = getAdjacentNeighbours(cube);
  let exposed = 6;
  for (const neighbour of neighbours) {
    if (cubes.has(neighbour)) {
      exposed--;
    }
  }
  return exposed;
};

const part1 = (rawInput: string) => {
  const cubes = new Set(parseInput(rawInput));
  const result: { [key: string]: number } = {};
  for (const cube of cubes) {
    result[cube] = countExposedSides(cube, cubes);
  }
  // console.log(result);

  return Object.values(result).reduce((a, b) => a + b);
};

const expandBoundary = ({ min, max }: { min: Cube; max: Cube }) => {
  return {
    min: { x: min.x - 1, y: min.y - 1, z: min.z - 1 },
    max: { x: max.x + 1, y: max.y + 1, z: max.z + 1 },
  };
};

const fill = (cubes: Set<string>, { min, max }: { min: Cube; max: Cube }) => {
  const queue = [`${min.x},${min.y},${min.z}`];
  const visited = new Set<string>();
  const water = new Set<string>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    const [x, y, z] = current.split(",").map(Number);
    if (
      x < min.x ||
      x > max.x ||
      y < min.y ||
      y > max.y ||
      z < min.z ||
      z > max.z
    ) {
      continue;
    }
    if (cubes.has(current)) {
      continue;
    }
    water.add(current);
    queue.push(...getAdjacentNeighbours(current));
  }
  return water;
};

const part2 = (rawInput: string) => {
  const cubes = new Set(parseInput(rawInput));
  const result: { [key: string]: number } = {};

  const { min, max } = expandBoundary(getBoundary(cubes));
  console.log(min, max);
  const water = fill(cubes, { min, max });
  // console.log(water);
  const adjacentToWater = [...cubes].map((cube) => {
    const neighbors = getAdjacentNeighbours(cube);
    const noWater = neighbors.filter((n) => water.has(n)).length;
    console.log(cube, noWater, neighbors.filter((n) => water.has(n)).length);
    return noWater;
  });
  return adjacentToWater.reduce((a, b) => a + b);
};

run({
  part1: {
    tests: [
      {
        input: `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
