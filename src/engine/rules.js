export const CHAKRA_THRESHOLDS = Object.freeze({
  OVERFLOW: 90,
  SURGING: 60,
  BALANCED: 30,
  DRAINED: 10,
});

export function isHero(unit) {
  return unit?.team === "hero";
}

export function isEnemy(unit) {
  return unit?.team === "enemy";
}

export function isAlive(unit) {
  return !!unit && unit.hp > 0;
}

export function isExhausted(unit) {
  return !!unit?.exhausted;
}

export function canAct(unit) {
  return isAlive(unit) && !isExhausted(unit);
}

export function canSpendChakra(unit, cost) {
  const current = unit?.chakra ?? 0;
  return current >= cost;
}

export function spendChakra(unit, cost) {
  if (!canSpendChakra(unit, cost)) {
    return false;
  }
  unit.chakra = (unit.chakra ?? 0) - cost;
  return true;
}

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function regenerateChakra(unit, amount) {
  if (!unit) return 0;
  const cap = unit.maxChakra ?? 100;
  const before = unit.chakra ?? 0;
  const after = clampValue(before + amount, 0, cap);
  unit.chakra = after;
  return after - before;
}

export function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function isAdjacent(posA, posB) {
  return manhattan(posA, posB) === 1;
}

export function applyDamage(source, target, baseDamage) {
  if (!isAlive(target)) {
    return { taken: 0, remainingHp: target?.hp ?? 0 };
  }
  const defense = target.defense ?? 0;
  const mitigated = Math.max(0, baseDamage - defense);
  const before = target.hp;
  target.hp = Math.max(0, before - mitigated);
  const took = before - target.hp;
  const fell = !isAlive(target);
  if (fell) {
    maybeTriggerLastStand(target);
  }
  return { taken: took, remainingHp: target.hp, knockedOut: !isAlive(target) };
}

export function applyHealing(target, amount) {
  if (!target) return 0;
  const cap = target.maxHp ?? target.hp;
  const before = target.hp;
  target.hp = clampValue(before + amount, 0, cap);
  return target.hp - before;
}

export function inBounds(state, pos) {
  if (!state?.bounds) return true;
  const { width, height } = state.bounds;
  return pos.x >= 0 && pos.y >= 0 && pos.x < width && pos.y < height;
}

export function maybeTriggerLastStand(unit) {
  if (!unit) return false;
  const hasTrait = unit.traits?.includes("last-stand");
  if (!hasTrait || unit.lastStandTriggered) {
    return false;
  }
  if (unit.hp > 0) {
    return false;
  }
  unit.hp = 1;
  unit.lastStandTriggered = true;
  return true;
}

export function isLastStand(unit) {
  if (!unit) return false;
  if (!unit.traits?.includes("last-stand")) return false;
  return unit.lastStandTriggered === true && unit.hp === 1;
}
