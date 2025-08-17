// tiers/weaponsTiers.js
export const WEAPON_CLASSES = [
    "Kunai","Shuriken","Fūma Shuriken","Tantō","Ninjatō","Senbon",
    "Wire-Kunai","Chakra Trench Knife","Explosive-Tag Kunai","Kusarigama"
  ];
  
  export const WEAPON_TIERS = [
    { id:1,  labelTemplate:"Academy {weapon}",              rarity:"Common",   missionBands:"D",
      stats:{ dmg:0.60, guard:0.60, handling:0.90, critPct:0,  durability:0.70, chakraEff:0.00, noise:1.00 },
      sealSlots:0, affinities:0 },
  
    { id:2,  labelTemplate:"Genin Field {weapon}",           rarity:"Common",   missionBands:"D–C",
      stats:{ dmg:0.80, guard:0.80, handling:1.00, critPct:2,  durability:0.90, chakraEff:0.05, noise:0.90 },
      sealSlots:0, affinities:0 },
  
    { id:3,  labelTemplate:"Clan Workshop {weapon}",          rarity:"Uncommon", missionBands:"C",
      stats:{ dmg:0.95, guard:0.90, handling:1.05, critPct:4,  durability:1.00, chakraEff:0.10, noise:0.85 },
      sealSlots:0, affinities:0 },
  
    { id:4,  labelTemplate:"Chūnin Patrol {weapon}",          rarity:"Uncommon", missionBands:"C–B",
      stats:{ dmg:1.05, guard:1.05, handling:1.00, critPct:5,  durability:1.20, chakraEff:0.12, noise:0.85 },
      sealSlots:0, affinities:0 },
  
    { id:5,  labelTemplate:"Konoha Masterwork {weapon}",      rarity:"Uncommon", missionBands:"B",
      stats:{ dmg:1.15, guard:1.10, handling:1.10, critPct:6,  durability:1.25, chakraEff:0.15, noise:0.80 },
      sealSlots:0, affinities:0 },
  
    { id:6,  labelTemplate:"Chakra-Conductive {weapon}",      rarity:"Rare",     missionBands:"B",
      stats:{ dmg:1.25, guard:1.15, handling:1.10, critPct:7,  durability:1.30, chakraEff:0.35, noise:0.80 },
      sealSlots:1, affinities:0 },
  
    { id:7,  labelTemplate:"Element-Tuned {weapon}",          rarity:"Rare",     missionBands:"B–A",
      stats:{ dmg:1.30, guard:1.20, handling:1.12, critPct:8,  durability:1.35, chakraEff:0.45, noise:0.78 },
      sealSlots:1, affinities:1, innatePassive:"Minor elemental bonus on hit" },
  
    { id:8,  labelTemplate:"Seal-Ready {weapon}",             rarity:"Rare",     missionBands:"A",
      stats:{ dmg:1.35, guard:1.25, handling:1.12, critPct:9,  durability:1.40, chakraEff:0.50, noise:0.76 },
      sealSlots:2, affinities:1 },
  
    { id:9,  labelTemplate:"Formula-Etched {weapon}",         rarity:"Rare",     missionBands:"A",
      stats:{ dmg:1.40, guard:1.30, handling:1.14, critPct:10, durability:1.45, chakraEff:0.55, noise:0.75 },
      sealSlots:2, affinities:1, innatePassive:"Choose: Impact Tag / Binding Flare / Smoke Burst" },
  
    { id:10, labelTemplate:"ANBU Silent {weapon}",            rarity:"Epic",     missionBands:"A–S",
      stats:{ dmg:1.50, guard:1.35, handling:1.22, critPct:12, durability:1.50, chakraEff:0.60, noise:0.60 },
      sealSlots:2, affinities:1, innatePassive:"Reduced sound; bonus backstab window" },
  
    { id:11, labelTemplate:"Kage Guard {weapon}",             rarity:"Epic",     missionBands:"S",
      stats:{ dmg:1.65, guard:1.50, handling:1.18, critPct:14, durability:1.65, chakraEff:0.65, noise:0.70 },
      sealSlots:3, affinities:1 },
  
    { id:12, labelTemplate:"Sage-Touched {weapon}",           rarity:"Epic",     missionBands:"S",
      stats:{ dmg:1.75, guard:1.60, handling:1.20, critPct:15, durability:1.75, chakraEff:0.70, noise:0.68 },
      sealSlots:3, affinities:1, innatePassive:"Very slow self-mend out of combat" },
  
    { id:13, labelTemplate:"Warring States Relic {weapon}",   rarity:"Legendary", missionBands:"S–SS",
      stats:{ dmg:1.90, guard:1.75, handling:1.15, critPct:16, durability:2.00, chakraEff:0.72, noise:0.72 },
      sealSlots:3, affinities:1 },
  
    { id:14, labelTemplate:"Clan Heirloom {weapon}",          rarity:"Legendary", missionBands:"SS",
      stats:{ dmg:2.00, guard:1.85, handling:1.22, critPct:18, durability:2.10, chakraEff:0.75, noise:0.65 },
      sealSlots:4, affinities:1, innatePassive:"Signature clan technique synergy" },
  
    { id:15, labelTemplate:"Living Chakra {weapon}",          rarity:"Legendary", missionBands:"SS",
      stats:{ dmg:2.10, guard:1.95, handling:1.25, critPct:20, durability:2.20, chakraEff:0.85, noise:0.65 },
      sealSlots:4, affinities:1, innatePassive:"XP-based scaling; minor self-repair" },
  
    { id:16, labelTemplate:"Six Paths Fragment {weapon}",     rarity:"Mythic",    missionBands:"SS–SSS",
      stats:{ dmg:2.25, guard:2.05, handling:1.28, critPct:22, durability:2.35, chakraEff:0.90, noise:0.60 },
      sealSlots:5, affinities:2, innatePassive:"Small bonus vs. bijū/yōkai" },
  
    { id:17, labelTemplate:"Bijū-Attuned {weapon}",           rarity:"Mythic",    missionBands:"SSS",
      stats:{ dmg:2.40, guard:2.15, handling:1.30, critPct:24, durability:2.45, chakraEff:0.92, noise:0.62 },
      sealSlots:5, affinities:2, innatePassive:"Burst mode on full chakra (short)" },
  
    { id:18, labelTemplate:"Dual-Nature {weapon}",            rarity:"Mythic",    missionBands:"SSS",
      stats:{ dmg:2.60, guard:2.30, handling:1.28, critPct:26, durability:2.55, chakraEff:0.94, noise:0.64 },
      sealSlots:5, affinities:2, innatePassive:"Elemental combo finisher bonus" },
  
    { id:19, labelTemplate:"God-Tree Infused {weapon}",       rarity:"Relic",     missionBands:"SSS (quest)",
      stats:{ dmg:2.80, guard:2.50, handling:1.26, critPct:28, durability:2.75, chakraEff:0.96, noise:0.70 },
      sealSlots:6, affinities:2, innatePassive:"Minor life-drain on heavy hit" },
  
    { id:20, labelTemplate:"Ōtsutsuki Relic {weapon}",        rarity:"Relic",     missionBands:"SSS (final arc)",
      stats:{ dmg:3.00, guard:2.70, handling:1.30, critPct:30, durability:3.00, chakraEff:1.00, noise:0.75 },
      sealSlots:6, affinities:3, innatePassive:"Once-per-mission mythic art (GM-gated)" }
  ];
  
  // Helper: build a concrete name
  export function nameFor(tierId, weaponClass){
    const t = WEAPON_TIERS.find(x=>x.id===tierId);
    return t ? t.labelTemplate.replace("{weapon}", weaponClass) : `${weaponClass}`;
  }