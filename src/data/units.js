import { CHAKRA_THRESHOLDS } from "../engine/rules.js";

let nextId = 1;

function createUnitId(prefix) {
  const id = `${prefix}-${String(nextId).padStart(3, "0")}`;
  nextId += 1;
  return id;
}

function baseUnit(overrides) {
  return {
    id: createUnitId(overrides.team === "hero" ? "hero" : "enemy"),
    name: "Unknown",
    team: "neutral",
    hp: 30,
    maxHp: 30,
    chakra: 20,
    maxChakra: 50,
    initiative: 5,
    defense: 0,
    attack: 5,
    position: { x: 0, y: 0 },
    traits: [],
    portraitUrl: "",
    ...overrides,
  };
}

export function makeHero(overrides = {}) {
  const hero = baseUnit({
    team: "hero",
    chakra: CHAKRA_THRESHOLDS.BALANCED,
    maxChakra: 100,
    ...overrides,
  });
  hero.id = hero.id.startsWith("hero-") ? hero.id : createUnitId("hero");
  return hero;
}

export function makeEnemy(overrides = {}) {
  const enemy = baseUnit({
    team: "enemy",
    chakra: CHAKRA_THRESHOLDS.DRAINED,
    maxChakra: 60,
    ...overrides,
  });
  enemy.id = enemy.id.startsWith("enemy-") ? enemy.id : createUnitId("enemy");
  return enemy;
}

export const starterParty = [
  makeHero({
    name: "Arashi",
    hp: 60,
    maxHp: 60,
    chakra: 40,
    defense: 4,
    initiative: 9,
    attack: 8,
    position: { x: 2, y: 6 },
    portraitUrl:
      "https://images.unsplash.com/photo-1527258264371-13d02d23d6c5?auto=format&fit=crop&w=256&q=80",
    moves: [
      { name: "Blade Rush", desc: "Dash forward and strike." },
      { name: "Guard Break", desc: "Reduce enemy defense." },
      { name: "Last Light", desc: "Supportive chakra pulse." },
    ],
  }),
  makeHero({
    name: "Kaede",
    hp: 48,
    maxHp: 48,
    chakra: 55,
    defense: 3,
    initiative: 12,
    attack: 6,
    position: { x: 3, y: 6 },
    portraitUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=256&q=80",
    moves: [
      { name: "Wind Kunai", desc: "Ranged chakra-infused strike." },
      { name: "Updraft", desc: "Move an ally out of danger." },
      { name: "Air Step", desc: "Gain initiative next round." },
    ],
  }),
  makeHero({
    name: "Riku",
    hp: 70,
    maxHp: 70,
    chakra: 35,
    defense: 6,
    initiative: 7,
    attack: 9,
    position: { x: 4, y: 6 },
    portraitUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=256&q=80",
    moves: [
      { name: "Stone Fist", desc: "Heavy single-target blow." },
      { name: "Earthen Wall", desc: "Raise cover for allies." },
      { name: "Focus", desc: "Recover chakra steadily." },
    ],
  }),
];

export const enemyBestiary = {
  scout: {
    key: "scout",
    name: "Bandit Scout",
    hp: 32,
    maxHp: 32,
    chakra: 15,
    maxChakra: 40,
    defense: 2,
    attack: 6,
    initiative: 11,
    moves: [
      { name: "Quick Slash", desc: "Light melee attack." },
      { name: "Mark Target", desc: "Expose an enemy." },
      { name: "Fallback", desc: "Retreat safely." },
    ],
    portraitUrl:
      "https://images.unsplash.com/photo-1619689088945-51bf3974f875?auto=format&fit=crop&w=256&q=80",
  },
  brute: {
    key: "brute",
    name: "Steel Brute",
    hp: 60,
    maxHp: 60,
    chakra: 10,
    maxChakra: 35,
    defense: 5,
    attack: 10,
    initiative: 6,
    moves: [
      { name: "Hammer Blow", desc: "Crushing damage." },
      { name: "Shockwave", desc: "Short range cone." },
      { name: "Fortify", desc: "Raise defense." },
    ],
    portraitUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=256&q=80",
  },
  mystic: {
    key: "mystic",
    name: "Mist Mystic",
    hp: 40,
    maxHp: 40,
    chakra: 60,
    maxChakra: 90,
    defense: 1,
    attack: 7,
    initiative: 8,
    moves: [
      { name: "Vapor Bolt", desc: "Ranged chakra strike." },
      { name: "Mist Shroud", desc: "Obscure an area." },
      { name: "Replenish", desc: "Recover chakra." },
    ],
    portraitUrl:
      "https://images.unsplash.com/photo-1545641315-35f6a6d6eb2b?auto=format&fit=crop&w=256&q=80",
  },
  hound: {
    key: "hound",
    name: "Shadow Hound",
    hp: 36,
    maxHp: 36,
    chakra: 20,
    maxChakra: 45,
    defense: 3,
    attack: 8,
    initiative: 13,
    moves: [
      { name: "Pounce", desc: "Leap at adjacent target." },
      { name: "Howl", desc: "Debuff foes." },
      { name: "Shadowmeld", desc: "Gain evasion." },
    ],
    portraitUrl:
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=256&q=80",
  },
  captain: {
    key: "captain",
    name: "Bandit Captain",
    hp: 75,
    maxHp: 75,
    chakra: 45,
    maxChakra: 80,
    defense: 6,
    attack: 11,
    initiative: 10,
    traits: ["last-stand"],
    moves: [
      { name: "Commanding Slash", desc: "Empowered strike." },
      { name: "Rally", desc: "Buff allies." },
      { name: "Desperation", desc: "Last stand attack." },
    ],
    portraitUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=256&q=80",
  },
};
