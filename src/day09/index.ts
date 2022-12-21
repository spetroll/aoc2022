import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

type Coord = { x: number; y: number };

const isAdjacent = (a: Coord, b: Coord) => {
  return (
    (Math.abs(a.y - b.y) === 1 || Math.abs(a.y - b.y) === 0) &&
    (Math.abs(a.x - b.x) === 1 || Math.abs(a.x - b.x) === 0)
  );
};

const moveTail = (head: Coord, tail: Coord) => {
  if (isAdjacent(head, tail)) {
    return;
  }

  if (head.x === tail.x) {
    if (head.y > tail.y) {
      tail.y++;
    } else {
      tail.y--;
    }
  } else if (head.y === tail.y) {
    if (head.x > tail.x) {
      tail.x++;
    } else {
      tail.x--;
    }
  } else {
    if (head.x > tail.x) {
      tail.x++;
    } else {
      tail.x--;
    }
    if (head.y > tail.y) {
      tail.y++;
    } else {
      tail.y--;
    }
  }
};

const simulateMove = (head: Coord, tail: Coord, direction: string) => {
  switch (direction) {
    case "U":
      head.y++;
      // console.log("move up", head);
      moveTail(head, tail);
      break;
    case "D":
      head.y--;

      // console.log("move down", head);
      moveTail(head, tail);
      break;
    case "L":
      head.x--;

      // console.log("move left", head);
      moveTail(head, tail);
      break;
    case "R":
      head.x++;

      // console.log("move right", head);
      moveTail(head, tail);
      break;
  }
  return [head, tail];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let head = { x: 0, y: 0 };
  let tail = { x: 0, y: 0 };
  const positions = new Set<string>();
  for (let line of input) {
    const [direction, steps] = line.split(" ");

    for (let i = 0; i < Number(steps); i++) {
      // console.log(head, tail);
      [head, tail] = simulateMove(head, tail, direction);
      positions.add(`${tail.x},${tail.y}`);
    }
    // console.log(head, tail);
  }
  return positions.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let knots = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  console.log(knots);
  const positions = new Set<string>();
  for (let line of input) {
    const [direction, steps] = line.split(" ");
    for (let i = 0; i < Number(steps); i++) {
      // console.log(head, tail);

      simulateMove(knots[0], knots[1], direction);
      for (let x = 2; x < knots.length; x++) {
        moveTail(knots[x - 1], knots[x]);
        if (x === knots.length - 1) {
          positions.add(`${knots[x].x},${knots[x].y}`);
        }
      }
    }
    // console.log(knots);
  }
  return positions.size;
};

run({
  part1: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
