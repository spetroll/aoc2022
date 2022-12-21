import run from "aocrunner";
import { deflateSync } from "zlib";

type Blueprint = {
  id: number;
  oreRobot: BlueprintCost;
  clayRobot: BlueprintCost;
  obsidianRobot: BlueprintCost;
  geodeRobot: BlueprintCost;
};

type Inventory = {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
};
type Bots = Inventory;
type BlueprintCost = {
  ore: number;
  clay: number;
  obsidian: number;
};
type BotType = "ORE" | "CLAY" | "OBSIDIAN" | "GEODE";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((x) => {
      const match = x.match(numberRegex);
      return match;
    })
    .map((x) => ({
      id: Number(x![0]),
      oreRobot: { ore: Number(x![1]), clay: 0, obsidian: 0 },
      clayRobot: { ore: Number(x![2]), clay: 0, obsidian: 0 },
      obsidianRobot: { ore: Number(x![3]), clay: Number(x![4]), obsidian: 0 },
      geodeRobot: { ore: Number(x![5]), clay: 0, obsidian: Number(x![6]) },
    }));

const numberRegex = /(\d+)/g;

const simulate = (
  bluePrint: Blueprint,
  maxSpend: number[],
  timeRemaining: number,
  path: string[],
  oreRobots: number,
  clayRobots: number,
  obsidianRobots: number,
  geodeRobots: number,
  ore: number,
  clay: number,
  obsidian: number,
  geode: number,
): { total: number; path: string[] } => {
  if (ore < 0 || clay < 0 || obsidian < 0 || geode < 0) {
    console.log(
      "Negative resource",
      path,
      `${ore}|${clay}|${obsidian}|${geode}}`,
    );
    replay(bluePrint, [...path, "WAIT"]);
    throw new Error("Negative resource");
  }

  if (timeRemaining === 0) {
    return { total: geode, path };
  }

  const key = `${timeRemaining},${ore},${clay},${obsidian},${geode},${oreRobots},${clayRobots},${obsidianRobots},${geodeRobots}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const options = [...getOptions(bluePrint, ore, clay, obsidian)];

  ore = ore + oreRobots;
  clay = clay + clayRobots;
  obsidian = obsidian + obsidianRobots;
  geode = geode + geodeRobots;

  const bestOption = [];
  for (let option of options) {
    if (oreRobots < maxSpend[0] && ore >= bluePrint.oreRobot) {
      ore = ore - bluePrint.oreRobot;
      oreRobots++;
    }
    if (ore >= bluePrint.clayRobot && clayRobots < maxSpend[1]) {
      ore = ore - bluePrint.clayRobot;
      clayRobots++;
    }
    if (ore >= bluePrint.obsidianRobot.ore && obsidianRobots < maxSpend[2]) {
      ore = ore - bluePrint.obsidianRobot.ore;
      clay = clay - bluePrint.obsidianRobot.clay;
      obsidianRobots++;
      // console.log("OBSIDIAN", ore, clay, obsidian, geode);
    }
    if (
      ore >= bluePrint.geodeRobot.ore &&
      obsidian >= bluePrint.geodeRobot.obsidian
    ) {
      ore = ore - bluePrint.geodeRobot.ore;
      obsidian = obsidian - bluePrint.geodeRobot.obsidian;
      geodeRobots++;
    }
    const result = simulate(
      bluePrint,
      maxSpend,
      timeRemaining - 1,
      [...path, option],
      oreRobots,
      clayRobots,
      obsidianRobots,
      geodeRobots,
      ore,
      clay,
      obsidian,
      geode,
    );
    bestOption.push(result);
  }

  const value = bestOption.sort((a, b) => b.total - a.total)[0];
  const maxGeodes = Math.max(geode, value.total);
  cache.set(key, { total: maxGeodes, path });

  return { total: maxGeodes, path };
};

const getMaxRequired = (bluePrint: Blueprint): BlueprintCost => {
  return {
    ore: Math.max(
      bluePrint.oreRobot.ore,
      bluePrint.clayRobot.ore,
      bluePrint.geodeRobot.ore,
      bluePrint.obsidianRobot.ore,
    ),
    clay: bluePrint.obsidianRobot.clay,
    obsidian: bluePrint.geodeRobot.obsidian,
  };
};

const getPossibleOptions = (
  bluePrint: Blueprint,
  bots: Bots,
  maxRequired: BlueprintCost,
  inventory: Inventory,
  timeRemaining: number,
): { type: BotType; costs: BlueprintCost }[] => {
  const options: { type: BotType; costs: BlueprintCost }[] = [];
  if (
    bots.ore < maxRequired.ore &&
    timeRequiredWaitingForBot(bluePrint.oreRobot, inventory, bots) <=
      timeRemaining
  ) {
    options.push({ type: "ORE", costs: bluePrint.oreRobot });
  }
  if (
    bots.clay < maxRequired.clay &&
    timeRequiredWaitingForBot(bluePrint.clayRobot, inventory, bots) <=
      timeRemaining
  ) {
    options.push({ type: "CLAY", costs: bluePrint.clayRobot });
  }
  if (
    bots.clay > 0 &&
    bots.obsidian < maxRequired.obsidian &&
    timeRequiredWaitingForBot(bluePrint.obsidianRobot, inventory, bots) <=
      timeRemaining
  ) {
    options.push({ type: "OBSIDIAN", costs: bluePrint.obsidianRobot });
  }
  if (
    bots.obsidian > 0 &&
    timeRequiredWaitingForBot(bluePrint.geodeRobot, inventory, bots) <=
      timeRemaining
  ) {
    options.push({ type: "GEODE", costs: bluePrint.geodeRobot });
  }

  return options;
};

const timeRequiredWaitingForBot = (
  bluePrint: BlueprintCost,
  inventory: Inventory,
  bots: Bots,
) => {
  const missingRessources = {
    ore: Math.max(0, bluePrint.ore - inventory.ore),
    clay: Math.max(0, bluePrint.clay - inventory.clay),
    obsidian: Math.max(0, bluePrint.obsidian - inventory.obsidian),
  };

  const timeRequired = Math.max(
    missingRessources.ore ? Math.ceil(missingRessources.ore / bots.ore) : 0,
    missingRessources.clay ? Math.ceil(missingRessources.clay / bots.clay) : 0,
    missingRessources.obsidian
      ? Math.ceil(missingRessources.obsidian / bots.obsidian)
      : 0,
  );
  return timeRequired + 1;
};

const inventoryAfterWaiting = (
  inventory: Inventory,
  bots: Bots,
  timeRequired: number,
): Inventory => {
  return {
    ore: inventory.ore + bots.ore * timeRequired,
    clay: inventory.clay + bots.clay * timeRequired,
    obsidian: inventory.obsidian + bots.obsidian * timeRequired,
    geode: inventory.geode + bots.geode * timeRequired,
  };
};

const removeCosts = (inventory: Inventory, cost: BlueprintCost) => {
  const newInventory = {
    ore: inventory.ore - cost.ore,
    clay: inventory.clay - cost.clay,
    obsidian: inventory.obsidian - cost.obsidian,
    geode: inventory.geode,
  };
  if (
    newInventory.ore < 0 ||
    newInventory.clay < 0 ||
    newInventory.obsidian < 0
  ) {
    console.log("Negative resource", newInventory);
    throw new Error("Negative resource");
  }
  return newInventory;
};

const addBot = (bots: Bots, type: BotType) => {
  switch (type) {
    case "ORE":
      return { ...bots, ore: bots.ore + 1 };
    case "CLAY":
      return { ...bots, clay: bots.clay + 1 };
    case "OBSIDIAN":
      return { ...bots, obsidian: bots.obsidian + 1 };
    case "GEODE":
      return { ...bots, geode: bots.geode + 1 };
  }
};

const part1 = (rawInput: string) => {
  const blueprints = parseInput(rawInput);

  const result = blueprints.map((blueprint) => {
    const maxRequired = getMaxRequired(blueprint);
    const cache = new Map<string, { total: number; path: string[] }>();
    const inventory = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
    const bots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };

    let bestSoFar = 0;

    const dfs = (
      timeRemaining: number,
      inventory: Inventory,
      bots: Bots,
      path: string[],
    ) => {
      if (timeRemaining === 0) {
        return { total: inventory.geode, path };
      }

      const cacheKey = `${blueprint.id},${timeRemaining}-${JSON.stringify(
        inventory,
      )}-${JSON.stringify(bots)}}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      if (
        inventory.geode +
          bots.geode * timeRemaining +
          triangleNumber(timeRemaining) <=
        bestSoFar
      ) {
        cache.set(cacheKey, { total: 0, path: [] });
        return { total: 0, path: [] };
      }

      const options = [
        ...getPossibleOptions(
          blueprint,
          bots,
          maxRequired,
          inventory,
          timeRemaining,
        ),
      ];

      if (options.length === 0) {
        const totalPossible = inventory.geode + bots.geode * timeRemaining;
        cache.set(cacheKey, { total: totalPossible, path });
        return { total: totalPossible, path };
      }

      const bestOption: { total: number; path: string[] }[] = [];

      for (const { type, costs } of options) {
        const timeRequired = timeRequiredWaitingForBot(costs, inventory, bots);
        if (timeRemaining < timeRequired) {
          continue;
        }

        let newInventory = inventoryAfterWaiting(inventory, bots, timeRequired);

        newInventory = removeCosts(newInventory, costs);

        const newBots = addBot(bots, type);
        const remainingTime = timeRemaining - timeRequired;

        const result = dfs(remainingTime, newInventory, newBots, [
          ...path,
          type,
        ]);
        bestSoFar = Math.max(bestSoFar, result.total);
        bestOption.push(result);
      }

      const best = bestOption.sort((a, b) => b.total - a.total)[0];
      cache.set(cacheKey, best);
      return best;
    };
    const result = dfs(24, inventory, bots, []);
    // replay(blueprint, result.path, 24);
    return result.total * blueprint.id;
  });
  return result.reduce((a, b) => a + b, 0);
};

const triangleNumber = (n: number) => {
  return (n * (n + 1)) / 2;
};

const part2 = (rawInput: string) => {
  const blueprints = parseInput(rawInput);

  const result = blueprints.slice(0, 3).map((blueprint) => {
    const maxRequired = getMaxRequired(blueprint);
    const cache = new Map<string, { total: number; path: string[] }>();
    const inventory = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
    const bots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };

    let bestSoFar = 0;

    const dfs = (
      timeRemaining: number,
      inventory: Inventory,
      bots: Bots,
      path: string[],
    ) => {
      if (timeRemaining === 0) {
        return { total: inventory.geode, path };
      }

      const cacheKey = `${blueprint.id},${timeRemaining}-${JSON.stringify(
        inventory,
      )}-${JSON.stringify(bots)}}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      if (
        inventory.geode +
          bots.geode * timeRemaining +
          triangleNumber(timeRemaining) <=
        bestSoFar
      ) {
        cache.set(cacheKey, { total: 0, path: [] });
        return { total: 0, path: [] };
      }

      const options = [
        ...getPossibleOptions(
          blueprint,
          bots,
          maxRequired,
          inventory,
          timeRemaining,
        ),
      ];

      if (options.length === 0) {
        const totalPossible = inventory.geode + bots.geode * timeRemaining;
        cache.set(cacheKey, { total: totalPossible, path });
        return { total: totalPossible, path };
      }

      const bestOption: { total: number; path: string[] }[] = [];

      for (const { type, costs } of options) {
        const timeRequired = timeRequiredWaitingForBot(costs, inventory, bots);
        if (timeRemaining < timeRequired) {
          continue;
        }

        let newInventory = inventoryAfterWaiting(inventory, bots, timeRequired);

        newInventory = removeCosts(newInventory, costs);

        const newBots = addBot(bots, type);
        const remainingTime = timeRemaining - timeRequired;

        const result = dfs(remainingTime, newInventory, newBots, [
          ...path,
          type,
        ]);
        bestSoFar = Math.max(bestSoFar, result.total);
        bestOption.push(result);
      }

      const best = bestOption.sort((a, b) => b.total - a.total)[0];
      cache.set(cacheKey, best);
      return best;
    };

    const result = dfs(32, inventory, bots, []);
    return result.total;
  });
  return result.reduce((a, b) => a * b, 1);
};

run({
  part1: {
    tests: [
      // {
      //   input: `Blueprint 1:  Each ore robot costs 4 ore.  Each clay robot costs 2 ore.  Each obsidian robot costs 3 ore and 14 clay.Each geode robot costs 2 ore and 7 obsidian.`,
      //   expected: 9,
      // },
      // {
      //   input:
      //     "Blueprint 2:  Each ore robot costs 2 ore.  Each clay robot costs 3 ore.  Each obsidian robot costs 3 ore and 8 clay.  Each geode robot costs 3 ore and 12 obsidian.",
      //   expected: 24,
      // },
      // {
      //   input: `Blueprint 1:  Each ore robot costs 4 ore.  Each clay robot costs 2 ore.  Each obsidian robot costs 3 ore and 14 clay.Each geode robot costs 2 ore and 7 obsidian.
      //   Blueprint 2:  Each ore robot costs 2 ore.  Each clay robot costs 3 ore.  Each obsidian robot costs 3 ore and 8 clay.  Each geode robot costs 3 ore and 12 obsidian.`,
      //   expected: 33,
      // },
    ],
    solution: part1,
  },
  part2: {
    //     tests: [
    //       {
    //         input: `Blueprint 1:  Each ore robot costs 4 ore.  Each clay robot costs 2 ore.  Each obsidian robot costs 3 ore and 14 clay.Each geode robot costs 2 ore and 7 obsidian.
    // Blueprint 2:  Each ore robot costs 2 ore.  Each clay robot costs 3 ore.  Each obsidian robot costs 3 ore and 8 clay.  Each geode robot costs 3 ore and 12 obsidian.`,
    //         expected: 33,
    //       },
    //     ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
