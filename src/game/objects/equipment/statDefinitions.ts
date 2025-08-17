// stats/statDefinitions.ts
// All percent-like fields use 0–1 internally (e.g., 0.06 = 6%).

export const STAT_DEFINITIONS = {
    basic: [
      {
        key: "ATK",
        unit: "flat",
        range: { min: 40, max: 2400 },         // global design envelope
        desc: "Offensive power. Feeds physical and skill damage before multipliers."
      },
      {
        key: "DEF",
        unit: "flat",
        range: { min: 5, max: 360 },
        desc: "Mitigation stat. Reduces incoming damage through ATK vs DEF contest."
      },
      {
        key: "HP",
        unit: "flat",
        range: { min: 300, max: 24000 },
        desc: "Health pool. Final survivability after DR and reductions."
      },
      {
        key: "SPD",
        unit: "flat",
        range: { min: 55, max: 130 },
        desc: "Turn/initiative pacing and minor animation timing; can gate combo windows."
      }
    ],
  
    special: [
      {
        key: "critRate",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.40, hardCap: 1.00 },
        desc: "Chance to crit. Contested vs defender critRes."
      },
      {
        key: "critDmg",
        unit: "multiplier",
        range: { min: 1.25, softCap: 2.50, hardCap: 3.00 }, // 125%–300%
        desc: "Critical damage multiplier applied on crit."
      },
      {
        key: "control",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.40, hardCap: 0.60 },
        desc: "Chance for your CC (stun, bind, etc.) to take hold; opposed by controlRes."
      },
      {
        key: "controlRes",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.40, hardCap: 0.80 },
        desc: "Chance to resist incoming CC."
      },
      {
        key: "critRes",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.30, hardCap: 0.80 },
        desc: "Reduces attacker crit chance (critRate − critRes)."
      },
      {
        key: "hit",
        unit: "ratio",
        range: { min: 0.85, softCap: 1.10, hardCap: 1.25 },
        desc: "Base accuracy before dodge contest. After contest, clamp at 10%–100%."
      },
      {
        key: "dodge",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.35, hardCap: 0.60 },
        desc: "Evasion against hit. Effective acc = clamp(hit − dodge, 0.10..1.00)."
      },
      {
        key: "dmgReduction",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.50, hardCap: 0.80 },
        desc: "Global DR applied after ATK vs DEF and before typed DR."
      },
      {
        key: "healBonus",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.50, hardCap: 1.00 },
        desc: "Outgoing healing multiplier."
      },
      {
        key: "recovery",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.30, hardCap: 1.00 },
        desc: "Self-regen & post-combat recovery multiplier."
      },
      {
        key: "dmgBonus",
        unit: "ratio",
        range: { min: -0.50, softCap: 0.50, hardCap: 2.00 },
        desc: "Global outgoing damage bonus (after ATK vs DEF). Can be negative."
      },
      {
        key: "phyDmg",
        unit: "ratio",
        range: { min: -0.50, softCap: 0.50, hardCap: 2.00 },
        desc: "Physical-only outgoing damage bonus."
      },
      {
        key: "skillDmg",
        unit: "ratio",
        range: { min: -0.50, softCap: 0.50, hardCap: 2.00 },
        desc: "Jutsu/skill-only outgoing damage bonus."
      },
      {
        key: "phyDr",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.50, hardCap: 0.80 },
        desc: "Physical-only damage reduction."
      },
      {
        key: "magDr",
        unit: "ratio",
        range: { min: 0.00, softCap: 0.50, hardCap: 0.80 },
        desc: "Ninjutsu/Genjutsu (magical) damage reduction."
      }
    ],
  
    bonusLines: [
      {
        key: "groupSkillLevel_Genjutsu",
        unit: "level",
        range: { min: 0, max: 20 },
        desc: "Account/party-wide Genjutsu skill level that scales related abilities."
      },
      {
        key: "groupPvpLevel_Genjutsu",
        unit: "level",
        range: { min: 0, max: 20 },
        desc: "PVP-only Genjutsu scaling track for matchmaking balance."
      },
      {
        key: "windEmblemLevel",
        unit: "level",
        range: { min: 0, max: 10 },
        desc: "Wind emblem progression that unlocks minor passives and sockets."
      },
      {
        key: "hourglassInfusionStage",
        unit: "stage",
        range: { min: 0, max: 10 },
        desc: "Infusion track that adds % resource efficiency or cooldown tweaks."
      }
    ]
  } as const;