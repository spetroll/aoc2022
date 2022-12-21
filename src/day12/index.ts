import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput;
};

type Coord = { x: number; y: number };

const manhattenDistance = (a: Coord, b: Coord) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const reconstructPath = (cameFrom: Map<string, string>, current: string) => {
  let length = 0;
  const totalPath = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    length++;
    totalPath.push(current);
  }
  return length;
};

const getNeighbors = (input: number[][], coord: Coord) => {
  const neighbors = [];
  if (coord.x > 0) {
    neighbors.push({ x: coord.x - 1, y: coord.y });
  }
  if (coord.x < input[0].length - 1) {
    neighbors.push({ x: coord.x + 1, y: coord.y });
  }
  if (coord.y > 0) {
    neighbors.push({ x: coord.x, y: coord.y - 1 });
  }
  if (coord.y < input.length - 1) {
    neighbors.push({ x: coord.x, y: coord.y + 1 });
  }

  const filtered = neighbors.filter(
    (x) => input[x.y][x.x] - input[coord.y][coord.x] <= 1,
  );

  return filtered;
};

const findShortestPath = (input: number[][], start: Coord, end: Coord) => {
  const frontier = [start];
  const cameFrom = new Map<string, string>();
  const costSoFar = new Map<string, number>();
  costSoFar.set(`${start.x}:${start.y}`, 0);

  while (frontier.length > 0) {
    const current = frontier.shift()!;
    if (current.x === end.x && current.y === end.y) {
      return reconstructPath(cameFrom, `${end.x}:${end.y}`);
    }

    const neighbors = getNeighbors(input, current);
    for (const next of neighbors) {
      const newCost = costSoFar.get(`${current.x}:${current.y}`)! + 1;
      if (
        !costSoFar.has(`${next.x}:${next.y}`) ||
        newCost < costSoFar.get(`${next.x}:${next.y}`)!
      ) {
        costSoFar.set(`${next.x}:${next.y}`, newCost);
        frontier.push(next);
        cameFrom.set(`${next.x}:${next.y}`, `${current.x}:${current.y}`);
      }
    }
  }

  return Infinity;
};

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const startY = input
    .map((x) => x.findIndex((y) => y === "S"))
    .findIndex((x) => x !== -1);
  const startX = input[startY].findIndex((x) => x === "S");

  const endY = input
    .map((x) => x.findIndex((y) => y === "E"))
    .findIndex((x) => x !== -1);

  const endX = input[endY].findIndex((x) => x === "E");

  input[startY][startX] = "a";
  input[endY][endX] = "z";

  const heightMap = input.map((x) =>
    x.map((c) => c.charCodeAt(0) - "a".charCodeAt(0)),
  );
  const start = { x: startX, y: startY };
  const end = { x: endX, y: endY };
  console.log(start, end, heightMap);

  const length = findShortestPath(heightMap, start, end);

  return length;
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const endY = input
    .map((x) => x.findIndex((y) => y === "E"))
    .findIndex((x) => x !== -1);

  const endX = input[endY].findIndex((x) => x === "E");

  input[endY][endX] = "z";

  const allStarts = input
    .map((x, i) =>
      x.map((y, j) => (y === "S" || y === "a" ? { x: j, y: i } : null)),
    )
    .flat()
    .filter((x) => x !== null);

  const heightMap = input.map((x) =>
    x.map((c) => c.charCodeAt(0) - "a".charCodeAt(0)),
  );

  const end = { x: endX, y: endY };

  const lengths = allStarts
    .map((start) =>
      start ? findShortestPath(heightMap, start as Coord, end) : null,
    )
    .filter((x) => x !== null) as number[];

  return Math.min(...lengths);
};

run({
  part1: {
    tests: [
      {
        input: `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
