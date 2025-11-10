import {
  canAct,
  isAlive,
  isAdjacent,
  applyDamage,
  regenerateChakra,
  inBounds,
} from "./rules.js";

function resolveUnit(state, ref) {
  if (!ref) return undefined;
  if (typeof ref === "string") {
    return state.units?.find((u) => u.id === ref);
  }
  return ref;
}

function isOccupied(state, position, ignoreId) {
  return state.units?.some(
    (unit) =>
      unit.id !== ignoreId &&
      isAlive(unit) &&
      unit.position?.x === position.x &&
      unit.position?.y === position.y
  );
}

export function tryMove(state, unitRef, destination) {
  const unit = resolveUnit(state, unitRef);
  if (!unit || !destination) return false;
  if (!canAct(unit)) return false;
  if (!unit.position) return false;
  if (unit.position.x === destination.x && unit.position.y === destination.y) {
    return false;
  }
  if (!inBounds(state, destination)) {
    return false;
  }
  if (isOccupied(state, destination, unit.id)) {
    return false;
  }
  unit.position = { x: destination.x, y: destination.y };
  unit.hasMoved = true;
  return true;
}

export function tryAttack(state, attackerRef, defenderRef) {
  const attacker = resolveUnit(state, attackerRef);
  const defender = resolveUnit(state, defenderRef);
  if (!attacker || !defender) return null;
  if (!canAct(attacker)) return null;
  if (!isAlive(defender)) return null;
  if (!isAdjacent(attacker.position, defender.position)) {
    return null;
  }
  const baseDamage = attacker.attack ?? 5;
  const result = applyDamage(attacker, defender, baseDamage);
  attacker.hasActed = true;
  return result;
}

export function rest(state, unitRef, amount = 10) {
  const unit = resolveUnit(state, unitRef);
  if (!unit) return 0;
  if (!canAct(unit)) return 0;
  const regenerated = regenerateChakra(unit, amount);
  unit.hasActed = true;
  return regenerated;
}

export function endOfUnitTurn(state, unitRef) {
  const unit = resolveUnit(state, unitRef);
  if (!unit) return false;
  unit.exhausted = true;
  unit.hasMoved = false;
  unit.hasActed = false;
  return true;
}
