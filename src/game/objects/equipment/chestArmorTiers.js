// tiers/chestArmorTiers.js
export const CHEST_ARMOR_CLASSES = [
    "Chakra Mesh Undershirt",
    "Flak Vest — Leaf",
    "Flak Vest — Sand",
    "Flak Vest — Mist",
    "ANBU Tactical Cuirass",
    "Hunter-nin Mantle",
    "Samurai Dō Cuirass",
    "Sensor Harness",
    "Medical Corps Coat",
    "Akatsuki Cloak"
  ];
  
  export const CHEST_ARMOR_TIERS = [
    { id:1,  labelTemplate:"Academy {armor}",              rarity:"Common",   missionBands:"D",
      stats:{ def:0.70, stability:0.65, guard:0.60, critProtPct:0,  durability:0.70, chakraEff:0.00, stamina:0.85, noise:1.00 },
      sealSlots:0, affinities:0 },
  
    { id:2,  labelTemplate:"Genin Field {armor}",           rarity:"Common",   missionBands:"D–C",
      stats:{ def:0.85, stability:0.80, guard:0.80, critProtPct:2,  durability:0.90, chakraEff:0.05, stamina:0.95, noise:0.94 },
      sealSlots:0, affinities:0 },
  
    { id:3,  labelTemplate:"Clan Workshop {armor}",          rarity:"Uncommon", missionBands:"C",
      stats:{ def:1.00, stability:0.92, guard:0.90, critProtPct:4,  durability:1.00, chakraEff:0.10, stamina:1.00, noise:0.90 },
      sealSlots:0, affinities:0 },
  
    { id:4,  labelTemplate:"Chūnin Patrol {armor}",          rarity:"Uncommon", missionBands:"C–B",
      stats:{ def:1.10, stability:1.05, guard:1.05, critProtPct:5,  durability:1.20, chakraEff:0.12, stamina:1.05, noise:0.88 },
      sealSlots:0, affinities:0 },
  
    { id:5,  labelTemplate:"Konoha Masterwork {armor}",      rarity:"Uncommon", missionBands:"B",
      stats:{ def:1.20, stability:1.12, guard:1.10, critProtPct:6,  durability:1.25, chakraEff:0.15, stamina:1.10, noise:0.86 },
      sealSlots:0, affinities:0 },
  
    { id:6,  labelTemplate:"Chakra-Conductive {armor}",      rarity:"Rare",     missionBands:"B",
      stats:{ def:1.30, stability:1.18, guard:1.15, critProtPct:7,  durability:1.30, chakraEff:0.35, stamina:1.15, noise:0.84 },
      sealSlots:1, affinities:0 },
  
    { id:7,  labelTemplate:"Element-Tuned {armor}",          rarity:"Rare",     missionBands:"B–A",
      stats:{ def:1.38, stability:1.24, guard:1.20, critProtPct:8,  durability:1.35, chakraEff:0.45, stamina:1.20, noise:0.82 },
      sealSlots:1, affinities:1, innatePassive:"Minor elemental resist (pick one)" },
  
    { id:8,  labelTemplate:"Seal-Ready {armor}",             rarity:"Rare",     missionBands:"A",
      stats:{ def:1.46, stability:1.30, guard:1.24, critProtPct:9,  durability:1.40, chakraEff:0.50, stamina:1.22, noise:0.80 },
      sealSlots:2, affinities:1 },
  
    { id:9,  labelTemplate:"Formula-Etched {armor}",         rarity:"Rare",     missionBands:"A",
      stats:{ def:1.54, stability:1.36, guard:1.28, critProtPct:10, durability:1.45, chakraEff:0.55, stamina:1.25, noise:0.78 },
      sealSlots:2, affinities:1, innatePassive:"Choose: Shock padding / Fire-retard / Hemostatic weave" },
  
    { id:10, labelTemplate:"ANBU Silent {armor}",            rarity:"Epic",     missionBands:"A–S",
      stats:{ def:1.68, stability:1.48, guard:1.36, critProtPct:12, durability:1.55, chakraEff:0.60, stamina:1.30, noise:0.70 },
      sealSlots:2, affinities:1, innatePassive:"Reduced rustle & impact noise; bonus backstab stealth window" },
  
    { id:11, labelTemplate:"Kage Guard {armor}",             rarity:"Epic",     missionBands:"S",
      stats:{ def:1.85, stability:1.62, guard:1.50, critProtPct:14, durability:1.70, chakraEff:0.65, stamina:1.35, noise:0.72 },
      sealSlots:3, affinities:1 },
  
    { id:12, labelTemplate:"Sage-Touched {armor}",           rarity:"Epic",     missionBands:"S",
      stats:{ def:2.00, stability:1.72, guard:1.60, critProtPct:15, durability:1.80, chakraEff:0.70, stamina:1.45, noise:0.70 },
      sealSlots:3, affinities:1, innatePassive:"Very slow self-mend out of combat (torso slot)" },
  
    { id:13, labelTemplate:"Warring States Relic {armor}",   rarity:"Legendary", missionBands:"S–SS",
      stats:{ def:2.15, stability:1.86, guard:1.70, critProtPct:16, durability:2.00, chakraEff:0.72, stamina:1.55, noise:0.72 },
      sealSlots:3, affinities:1 },
  
    { id:14, labelTemplate:"Clan Heirloom {armor}",          rarity:"Legendary", missionBands:"SS",
      stats:{ def:2.30, stability:1.98, guard:1.82, critProtPct:18, durability:2.10, chakraEff:0.75, stamina:1.65, noise:0.68 },
      sealSlots:4, affinities:1, innatePassive:"Signature clan technique synergy (torso)" },
  
    { id:15, labelTemplate:"Living Chakra {armor}",          rarity:"Legendary", missionBands:"SS",
      stats:{ def:2.40, stability:2.05, guard:1.92, critProtPct:20, durability:2.20, chakraEff:0.85, stamina:1.80, noise:0.66 },
      sealSlots:4, affinities:1, innatePassive:"Learns wearer; minor stamina scaling" },
  
    { id:16, labelTemplate:"Six Paths Fragment {armor}",     rarity:"Mythic",    missionBands:"SS–SSS",
      stats:{ def:2.55, stability:2.18, guard:2.05, critProtPct:22, durability:2.35, chakraEff:0.90, stamina:1.95, noise:0.62 },
      sealSlots:5, affinities:2, innatePassive:"Small bonus vs. bijū/yōkai (torso damage reduction)" },
  
    { id:17, labelTemplate:"Bijū-Attuned {armor}",           rarity:"Mythic",    missionBands:"SSS",
      stats:{ def:2.70, stability:2.28, guard:2.16, critProtPct:24, durability:2.45, chakraEff:0.92, stamina:2.05, noise:0.64 },
      sealSlots:5, affinities:2, innatePassive:"Short burst: damage reduction on full chakra (cooldown)" },
  
    { id:18, labelTemplate:"Dual-Nature {armor}",            rarity:"Mythic",    missionBands:"SSS",
      stats:{ def:2.85, stability:2.38, guard:2.26, critProtPct:26, durability:2.55, chakraEff:0.94, stamina:2.15, noise:0.66 },
      sealSlots:5, affinities:2, innatePassive:"Elemental resist combo (two natures)" },
  
    { id:19, labelTemplate:"God-Tree Infused {armor}",       rarity:"Relic",     missionBands:"SSS (quest)",
      stats:{ def:2.95, stability:2.50, guard:2.40, critProtPct:28, durability:2.75, chakraEff:0.96, stamina:2.25, noise:0.72 },
      sealSlots:6, affinities:2, innatePassive:"Minor life-ward: low chance to negate lethal hit" },
  
    { id:20, labelTemplate:"Ōtsutsuki Relic {armor}",        rarity:"Relic",     missionBands:"SSS (final arc)",
      stats:{ def:3.10, stability:2.65, guard:2.55, critProtPct:30, durability:3.00, chakraEff:1.00, stamina:2.40, noise:0.75 },
      sealSlots:6, affinities:3, innatePassive:"Once-per-mission mythic art (torso)" }
  ];
  
  // Helper: build a concrete name
  export function nameChestArmor(tierId, armorClass){
    const t = CHEST_ARMOR_TIERS.find(x=>x.id===tierId);
    return t ? t.labelTemplate.replace("{armor}", armorClass) : `${armorClass}`;
  }
  