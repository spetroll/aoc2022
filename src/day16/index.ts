import run from "aocrunner";
import assert from "assert";
import { readFileSync } from "fs";

type Valve = { name: string; flowRate: number; tunnels: string[] };

const regexValve =
  /Valve (\w+) has flow rate=(\d+); tunnels{0,1} leads{0,1} to valves{0,1} (\w+(, \w+)*)/;

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    let [, valve, flowRate, tunnels] = regexValve.exec(line) ?? [];
    var parsedTunnels = tunnels.split(", ");
    // console.log(match);
    return {
      name: valve,
      flowRate: Number(flowRate),
      tunnels: parsedTunnels,
    };
  });

type DistancesMap = { [key: string]: { [key2: string]: number } };

const findDistances = (valves: Map<string, Valve>) => {
  const distances: DistancesMap = {};
  const keyRooms = [...valves]
    .filter(([, { flowRate }]) => flowRate > 0)
    .map(([key]) => key);
  keyRooms.push("AA");
  for (const key of keyRooms) {
    const queue = [key];
    const visited = new Set<string>(key);
    const distMap = { [key]: 0 };
    while (queue.length > 0) {
      const current = queue.shift()!;
      const { tunnels } = valves.get(current as string)!;
      for (const tunnel of tunnels) {
        if (!visited.has(tunnel)) {
          visited.add(tunnel as string);
          distMap[tunnel] = distMap[current] + 1;
          queue.push(tunnel);
        }
      }
    }
    distances[key] = distMap;
  }
  return { distances, keyRooms: keyRooms.filter((k) => k !== "AA").sort() };
};

const bestOptionMap = new Map<string, { flow: number; path: string[] }>();

const findBestTotalFlow = (
  distances: DistancesMap,
  valves: Map<string, Valve>,
  valve: string,
  time: number,
  targets: string[],
  path: string[],
  pathFlow: number,
): { flow: number; path: string[] } => {
  const newTargets = [...targets].filter((target) => !path.includes(target));

  const results = [];
  for (const target of newTargets) {
    const timeLeft = time - distances[valve][target] - 1;
    if (timeLeft > 0) {
      let targetFlow = valves.get(target)!.flowRate * timeLeft;
      const option = findBestTotalFlow(
        distances,
        valves,
        target,
        timeLeft,
        newTargets,
        [...path, target],
        pathFlow + targetFlow,
      );
      results.push(option);
    }
  }

  const pathkey = path.sort().join(",");
  const bestOption = results.sort((a, b) => b.flow - a.flow)[0] ?? {
    flow: pathFlow,
    path: path,
  };
  bestOptionMap.get(pathkey);
  if (bestOption.flow > (bestOptionMap.get(pathkey)?.flow ?? 0)) {
    bestOptionMap.set(pathkey, bestOption);
    return bestOption;
  } else {
    return bestOptionMap.get(pathkey)!;
  }
};

const extendBestOptionMap = (targets: string[]) => {
  const pathKey = targets.sort().join(",");
  if (!bestOptionMap.has(pathKey)) {
    const results = [];
    for (const target of targets) {
      const remaining = targets.filter((t) => t !== target);
      results.push(extendBestOptionMap(remaining));
    }
    const bestOption = results.sort((a, b) => b.flow - a.flow)[0];
    bestOptionMap.set(pathKey, bestOption);
  }
  return bestOptionMap.get(pathKey)!;
};

const part1 = (rawInput: string) => {
  const valves = new Map(parseInput(rawInput).map((x) => [x.name, x]));
  const start = "AA";
  const { distances, keyRooms } = findDistances(valves);
  const { flow, path } = findBestTotalFlow(
    distances,
    valves,
    start,
    30,
    keyRooms,
    [],
    0,
  );
  return flow;
};

const part2 = (rawInput: string) => {
  const valves = new Map(parseInput(rawInput).map((x) => [x.name, x]));
  const start = "AA";
  bestOptionMap.clear();
  // bestOptionMap.set("", { flow: 0, path: [] });
  const { distances, keyRooms } = findDistances(valves);
  const { flow, path } = findBestTotalFlow(
    distances,
    valves,
    start,
    26,
    keyRooms,
    [],
    0,
  );
  extendBestOptionMap(keyRooms);
  let answers = [];
  for (let human of bestOptionMap.keys()) {
    const elephant = keyRooms.filter((k) => !human.includes(k));
    const elephantKey = elephant.sort().join(",");
    answers.push([
      human,
      elephantKey,
      bestOptionMap.get(human)!.flow + bestOptionMap.get(elephantKey)!.flow,
      bestOptionMap.get(human)!.flow,
      bestOptionMap.get(elephantKey)!.flow,
    ]);
  }
  const answer = answers.sort((a, b) => b[2]!.flow - a[2]!.flow).slice(0, 10);
  console.log("empty", bestOptionMap.get(""));
  console.log(answer);
  return answer[0][2];
};

run({
  part1: {
    tests: [
      {
        input: `Valve VR has flow rate=11; tunnels lead to valves LH, KV, BP
Valve UV has flow rate=0; tunnels lead to valves GH, RO
Valve OH has flow rate=0; tunnels lead to valves AJ, NY
Valve GD has flow rate=0; tunnels lead to valves TX, PW
Valve NS has flow rate=0; tunnels lead to valves AJ, AA
Valve KZ has flow rate=18; tunnels lead to valves KO, VK, PJ
Valve AH has flow rate=0; tunnels lead to valves ZP, DI
Valve SA has flow rate=0; tunnels lead to valves VG, JF
Valve VK has flow rate=0; tunnels lead to valves RO, KZ
Valve GB has flow rate=0; tunnels lead to valves XH, AA
Valve AJ has flow rate=6; tunnels lead to valves IC, OH, ZR, NS, EM
Valve PJ has flow rate=0; tunnels lead to valves KZ, SP
Valve KO has flow rate=0; tunnels lead to valves KZ, LE
Valve AA has flow rate=0; tunnels lead to valves TW, GB, TI, NS, UL
Valve TW has flow rate=0; tunnels lead to valves TU, AA
Valve VG has flow rate=25; tunnel leads to valve SA
Valve BP has flow rate=0; tunnels lead to valves RO, VR
Valve XH has flow rate=0; tunnels lead to valves GB, RI
Valve TX has flow rate=0; tunnels lead to valves RI, GD
Valve IR has flow rate=10; tunnels lead to valves TN, NY, JF
Valve TU has flow rate=0; tunnels lead to valves JD, TW
Valve KC has flow rate=0; tunnels lead to valves SP, RO
Valve LN has flow rate=0; tunnels lead to valves EM, RI
Valve HD has flow rate=0; tunnels lead to valves FE, SC
Valve KE has flow rate=0; tunnels lead to valves OM, RI
Valve VY has flow rate=0; tunnels lead to valves PW, BS
Valve LH has flow rate=0; tunnels lead to valves OM, VR
Valve EM has flow rate=0; tunnels lead to valves AJ, LN
Valve SO has flow rate=22; tunnels lead to valves ZP, FE
Valve EC has flow rate=0; tunnels lead to valves OM, UL
Valve KV has flow rate=0; tunnels lead to valves SP, VR
Valve FE has flow rate=0; tunnels lead to valves SO, HD
Valve TI has flow rate=0; tunnels lead to valves AA, PW
Valve SC has flow rate=14; tunnel leads to valve HD
Valve ZP has flow rate=0; tunnels lead to valves SO, AH
Valve RO has flow rate=19; tunnels lead to valves UV, BP, VK, KC
Valve ZR has flow rate=0; tunnels lead to valves OM, AJ
Valve JL has flow rate=21; tunnels lead to valves GN, TN
Valve PW has flow rate=9; tunnels lead to valves TI, GN, VY, GD, IC
Valve UL has flow rate=0; tunnels lead to valves EC, AA
Valve GN has flow rate=0; tunnels lead to valves JL, PW
Valve TN has flow rate=0; tunnels lead to valves JL, IR
Valve NV has flow rate=0; tunnels lead to valves RI, JD
Valve DI has flow rate=23; tunnels lead to valves LE, AH
Valve IC has flow rate=0; tunnels lead to valves PW, AJ
Valve JF has flow rate=0; tunnels lead to valves SA, IR
Valve LE has flow rate=0; tunnels lead to valves DI, KO
Valve BS has flow rate=0; tunnels lead to valves JD, VY
Valve JD has flow rate=15; tunnels lead to valves NV, TU, BS
Valve SP has flow rate=24; tunnels lead to valves KC, KV, PJ
Valve NY has flow rate=0; tunnels lead to valves IR, OH
Valve OM has flow rate=7; tunnels lead to valves EC, GH, KE, ZR, LH
Valve GH has flow rate=0; tunnels lead to valves OM, UV
Valve RI has flow rate=3; tunnels lead to valves NV, KE, LN, XH, TX`,
        expected: 1880,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Valve VR has flow rate=11; tunnels lead to valves LH, KV, BP
Valve UV has flow rate=0; tunnels lead to valves GH, RO
Valve OH has flow rate=0; tunnels lead to valves AJ, NY
Valve GD has flow rate=0; tunnels lead to valves TX, PW
Valve NS has flow rate=0; tunnels lead to valves AJ, AA
Valve KZ has flow rate=18; tunnels lead to valves KO, VK, PJ
Valve AH has flow rate=0; tunnels lead to valves ZP, DI
Valve SA has flow rate=0; tunnels lead to valves VG, JF
Valve VK has flow rate=0; tunnels lead to valves RO, KZ
Valve GB has flow rate=0; tunnels lead to valves XH, AA
Valve AJ has flow rate=6; tunnels lead to valves IC, OH, ZR, NS, EM
Valve PJ has flow rate=0; tunnels lead to valves KZ, SP
Valve KO has flow rate=0; tunnels lead to valves KZ, LE
Valve AA has flow rate=0; tunnels lead to valves TW, GB, TI, NS, UL
Valve TW has flow rate=0; tunnels lead to valves TU, AA
Valve VG has flow rate=25; tunnel leads to valve SA
Valve BP has flow rate=0; tunnels lead to valves RO, VR
Valve XH has flow rate=0; tunnels lead to valves GB, RI
Valve TX has flow rate=0; tunnels lead to valves RI, GD
Valve IR has flow rate=10; tunnels lead to valves TN, NY, JF
Valve TU has flow rate=0; tunnels lead to valves JD, TW
Valve KC has flow rate=0; tunnels lead to valves SP, RO
Valve LN has flow rate=0; tunnels lead to valves EM, RI
Valve HD has flow rate=0; tunnels lead to valves FE, SC
Valve KE has flow rate=0; tunnels lead to valves OM, RI
Valve VY has flow rate=0; tunnels lead to valves PW, BS
Valve LH has flow rate=0; tunnels lead to valves OM, VR
Valve EM has flow rate=0; tunnels lead to valves AJ, LN
Valve SO has flow rate=22; tunnels lead to valves ZP, FE
Valve EC has flow rate=0; tunnels lead to valves OM, UL
Valve KV has flow rate=0; tunnels lead to valves SP, VR
Valve FE has flow rate=0; tunnels lead to valves SO, HD
Valve TI has flow rate=0; tunnels lead to valves AA, PW
Valve SC has flow rate=14; tunnel leads to valve HD
Valve ZP has flow rate=0; tunnels lead to valves SO, AH
Valve RO has flow rate=19; tunnels lead to valves UV, BP, VK, KC
Valve ZR has flow rate=0; tunnels lead to valves OM, AJ
Valve JL has flow rate=21; tunnels lead to valves GN, TN
Valve PW has flow rate=9; tunnels lead to valves TI, GN, VY, GD, IC
Valve UL has flow rate=0; tunnels lead to valves EC, AA
Valve GN has flow rate=0; tunnels lead to valves JL, PW
Valve TN has flow rate=0; tunnels lead to valves JL, IR
Valve NV has flow rate=0; tunnels lead to valves RI, JD
Valve DI has flow rate=23; tunnels lead to valves LE, AH
Valve IC has flow rate=0; tunnels lead to valves PW, AJ
Valve JF has flow rate=0; tunnels lead to valves SA, IR
Valve LE has flow rate=0; tunnels lead to valves DI, KO
Valve BS has flow rate=0; tunnels lead to valves JD, VY
Valve JD has flow rate=15; tunnels lead to valves NV, TU, BS
Valve SP has flow rate=24; tunnels lead to valves KC, KV, PJ
Valve NY has flow rate=0; tunnels lead to valves IR, OH
Valve OM has flow rate=7; tunnels lead to valves EC, GH, KE, ZR, LH
Valve GH has flow rate=0; tunnels lead to valves OM, UV
Valve RI has flow rate=3; tunnels lead to valves NV, KE, LN, XH, TX`,
        expected: 2520,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
