import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const manhattanDistance = (a: Coord, b: Coord) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getSensors = (input: string) => {
  const sensors = input
    .split("\n")
    .map((l) => l.split(":")[0].split(","))
    .map((l) => l.map((x) => x.split("=")[1]).map(Number))
    .map((x) => ({ x: x[0], y: x[1] }))
    .sort((a, b) => a.y - b.y);
  return sensors;
};

const getBeacons = (input: string) => {
  const beacons = input
    .split("\n")
    .map((l) => l.split(":")[1].split(","))
    .map((l) => l.map((x) => x.split("=")[1]).map(Number))
    .map((x) => ({ x: x[0], y: x[1] }))
    .sort((a, b) => a.y - b.y);

  return beacons;
};
type Coord = { x: number; y: number };

let allDistances = new Map<Coord, { distance: number; beacon: Coord }[]>();

const buildAllDistance = (sensors: Coord[], beacons: Coord[]) => {
  sensors.map((s) => {
    const distances = beacons.map((b) => ({
      distance: manhattanDistance(s, b),
      beacon: b,
    }));
    allDistances.set(
      s,
      distances.sort((a, b) => a.distance - b.distance),
    );
  });
  return allDistances;
};

const getDistance = (sensor: Coord, beacons: Coord[]) => {
  return allDistances.get(sensor);
};

const nearestBeacon = (sensor: Coord) => {
  return allDistances.get(sensor)?.[0];
};

const hasNearerBeacon = (point: Coord) => {
  for (const [sensor, distances] of allDistances.entries()) {
    const { beacon, distance } = distances[0];
    if (sensor.x === point.x && sensor.y === point.y) {
      return [true, 1];
    }

    if (beacon.x === point.x && beacon.y === point.y) {
      // console.log(
      //   "Might be the beacon",
      //   `${point.x},${point.y}`,
      //   `${beacon.x},${beacon.y}`,
      // );
      return [true, 1];
    }
    const distanceToSensor = manhattanDistance(sensor, point);
    const nearestBeaconFromSensor = distance;

    if (distanceToSensor <= nearestBeaconFromSensor) {
      // console.log(
      //   "Nearest beacon",
      //   `${point.x},${point.y}`,
      //   `${sensor.x},${sensor.y}`,
      //   distanceToSensor,
      //   nearestBeaconFromSensor,
      // );
      return [
        true,
        Math.max(nearestBeaconFromSensor - distanceToSensor - 1, 1),
      ];
    }
    // console.log(
    //   "Sensor not near enough",
    //   `${point.x},${point.y}`,
    //   `${sensor.x},${sensor.y}`,
    //   distanceToSensor,
    //   nearestBeaconFromSensor,
    // );
  }
  // console.log("Possible point", { point });
  return [false, -1];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sensors = getSensors(input);
  const beacons = getBeacons(input);

  buildAllDistance(sensors, beacons);
  const all = [...sensors, ...beacons];

  const nearest = sensors.map((s) => {
    return { s, b: nearestBeacon(s) };
  });

  console.log(nearest);

  const minX = Math.min(
    ...sensors.map((x) => x.x - (allDistances.get(x)?.[0].distance ?? 0)),
  );
  const maxX = Math.max(
    ...sensors.map((x) => x.x + (allDistances.get(x)?.[0].distance ?? 0)),
  );

  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    const [hasNearest] = hasNearerBeacon({ x, y: 10 });
    if (hasNearest) {
      count = count + 1;
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sensors = getSensors(input);
  const beacons = getBeacons(input);

  buildAllDistance(sensors, beacons);
  const all = [...sensors, ...beacons];

  const nearest = sensors.map((s) => {
    return { s, b: nearestBeacon(s) };
  });

  console.log(nearest);

  const minX = Math.min(
    ...sensors.map((x) => x.x - (allDistances.get(x)?.[0].distance ?? 0)),
  );
  const maxX = Math.max(
    ...sensors.map((x) => x.x + (allDistances.get(x)?.[0].distance ?? 0)),
  );

  const minY = Math.min(
    ...sensors.map((x) => x.y - (allDistances.get(x)?.[0].distance ?? 0)),
  );

  const maxY = Math.max(
    ...sensors.map((x) => x.y + (allDistances.get(x)?.[0].distance ?? 0)),
  );

  const max_search = 4000000;
  let x = Math.max(minX, 0);
  let y = Math.max(minY, 0);

  while (x <= Math.min(maxX, max_search)) {
    while (y <= Math.min(maxY, max_search)) {
      const point = { x, y };

      const [hasNearest, skip] = hasNearerBeacon(point);
      if (hasNearest) {
        // console.log("skip", skip);
        y = y + (skip as number);
      } else if (!hasNearest) {
        console.log("Found point", point);
        return point.x * 4000000 + point.y;
      }
    }
    x = x + 1;
    y = Math.max(minY, 0);
    if (x % 1000 === 0) {
      console.log("Nothing until row ", x, "of", Math.min(maxX, max_search));
    }
  }
};

run({
  //   part1: {
  //     tests: [
  //       {
  //         input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  // Sensor at x=9, y=16: closest beacon is at x=10, y=16
  // Sensor at x=13, y=2: closest beacon is at x=15, y=3
  // Sensor at x=12, y=14: closest beacon is at x=10, y=16
  // Sensor at x=10, y=20: closest beacon is at x=10, y=16
  // Sensor at x=14, y=17: closest beacon is at x=10, y=16
  // Sensor at x=8, y=7: closest beacon is at x=2, y=10
  // Sensor at x=2, y=0: closest beacon is at x=2, y=10
  // Sensor at x=0, y=11: closest beacon is at x=2, y=10
  // Sensor at x=20, y=14: closest beacon is at x=25, y=17
  // Sensor at x=17, y=20: closest beacon is at x=21, y=22
  // Sensor at x=16, y=7: closest beacon is at x=15, y=3
  // Sensor at x=14, y=3: closest beacon is at x=15, y=3
  // Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
  //         expected: 26,
  //       },
  //     ],
  //     solution: part1,
  //   },
  part2: {
    tests: [
      // {
      //   input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      // Sensor at x=9, y=16: closest beacon is at x=10, y=16
      // Sensor at x=13, y=2: closest beacon is at x=15, y=3
      // Sensor at x=12, y=14: closest beacon is at x=10, y=16
      // Sensor at x=10, y=20: closest beacon is at x=10, y=16
      // Sensor at x=14, y=17: closest beacon is at x=10, y=16
      // Sensor at x=8, y=7: closest beacon is at x=2, y=10
      // Sensor at x=2, y=0: closest beacon is at x=2, y=10
      // Sensor at x=0, y=11: closest beacon is at x=2, y=10
      // Sensor at x=20, y=14: closest beacon is at x=25, y=17
      // Sensor at x=17, y=20: closest beacon is at x=21, y=22
      // Sensor at x=16, y=7: closest beacon is at x=15, y=3
      // Sensor at x=14, y=3: closest beacon is at x=15, y=3
      // Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
      //   expected: 56000011,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
