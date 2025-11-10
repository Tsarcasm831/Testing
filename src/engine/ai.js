import { isHero, canAct, isAlive, manhattan, isAdjacent } from "./rules.js";
import { tryAttack, tryMove, rest } from "./actions.js";

function resolveUnit(state, ref) {
  if (!ref) return undefined;
  if (typeof ref === "string") {
    return state.units?.find((u) => u.id === ref);
  }
  return ref;
}

function getHeroes(state) {
  return state.units?.filter((unit) => isHero(unit) && isAlive(unit)) ?? [];
}

function chooseAdjacentTarget(state, unit) {
  const heroes = getHeroes(state);
  return heroes.find((hero) => isAdjacent(unit.position, hero.position));
}

function findNearestHero(state, unit) {
  const heroes = getHeroes(state);
  let best = null;
  let bestDistance = Infinity;
  for (const hero of heroes) {
    const distance = manhattan(unit.position, hero.position);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = hero;
    }
  }
  return best;
}

function stepToward(unit, target) {
  if (!target) return null;
  const dx = target.position.x - unit.position.x;
  const dy = target.position.y - unit.position.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return { x: unit.position.x + Math.sign(dx), y: unit.position.y };
  }
  if (dy !== 0) {
    return { x: unit.position.x, y: unit.position.y + Math.sign(dy) };
  }
  if (dx !== 0) {
    return { x: unit.position.x + Math.sign(dx), y: unit.position.y };
  }
  return null;
}

export function aiTakeTurn(state, unitRef) {
  const unit = resolveUnit(state, unitRef);
  if (!unit || !canAct(unit)) {
    return { action: "idle" };
  }

  const adjacentTarget = chooseAdjacentTarget(state, unit);
  if (adjacentTarget) {
    const result = tryAttack(state, unit, adjacentTarget);
    return { action: "attack", target: adjacentTarget?.id, result };
  }

  const nearest = findNearestHero(state, unit);
  if (nearest) {
    const destination = stepToward(unit, nearest);
    if (destination && tryMove(state, unit, destination)) {
      return { action: "move", destination };
    }
  }

  const regenerated = rest(state, unit);
  return { action: "rest", chakra: regenerated };
}
