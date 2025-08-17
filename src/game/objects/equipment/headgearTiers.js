// tiers/headgearTiers.js
export const HEADGEAR_CLASSES = [
    "Forehead Protector — Leaf",
    "Forehead Protector — Sand",
    "Forehead Protector — Mist",
    "Shinobi Hood",
    "ANBU Animal Mask",
    "Hunter-nin Mask",
    "Samurai Kabuto",
    "Menpō Face Guard",
    "Sensor Headband",
    "Chakra Visor Goggles"
  ];
  
  export const HEADGEAR_TIERS = [
    { id:1,  labelTemplate:"Academy {headgear}",              rarity:"Common",   missionBands:"D",
      stats:{ def:0.60, stability:0.60, focus:0.80, critProtPct:0,  durability:0.70, chakraEff:0.00, perception:0.80, noise:1.00 },
      sealSlots:0, affinities:0 },
  
    { id:2,  labelTemplate:"Genin Field {headgear}",           rarity:"Common",   missionBands:"D–C",
      stats:{ def:0.80, stability:0.80, focus:0.90, critProtPct:2,  durability:0.90, chakraEff:0.05, perception:0.90, noise:0.92 },
      sealSlots:0, affinities:0 },
  
    { id:3,  labelTemplate:"Clan Workshop {headgear}",         rarity:"Uncommon", missionBands:"C",
      stats:{ def:0.95, stability:0.90, focus:0.95, critProtPct:4,  durability:1.00, chakraEff:0.10, perception:1.00, noise:0.88 },
      sealSlots:0, affinities:0 },
  
    { id:4,  labelTemplate:"Chūnin Patrol {headgear}",         rarity:"Uncommon", missionBands:"C–B",
      stats:{ def:1.05, stability:1.05, focus:1.00, critProtPct:5,  durability:1.20, chakraEff:0.12, perception:1.05, noise:0.86 },
      sealSlots:0, affinities:0 },
  
    { id:5,  labelTemplate:"Konoha Masterwork {headgear}",     rarity:"Uncommon", missionBands:"B",
      stats:{ def:1.15, stability:1.10, focus:1.05, critProtPct:6,  durability:1.25, chakraEff:0.15, perception:1.10, noise:0.84 },
      sealSlots:0, affinities:0 },
  
    { id:6,  labelTemplate:"Chakra-Conductive {headgear}",     rarity:"Rare",     missionBands:"B",
      stats:{ def:1.25, stability:1.15, focus:1.10, critProtPct:7,  durability:1.30, chakraEff:0.35, perception:1.15, noise:0.82 },
      sealSlots:1, affinities:0 },
  
    { id:7,  labelTemplate:"Element-Tuned {headgear}",         rarity:"Rare",     missionBands:"B–A",
      stats:{ def:1.30, stability:1.20, focus:1.15, critProtPct:8,  durability:1.35, chakraEff:0.45, perception:1.18, noise:0.80 },
      sealSlots:1, affinities:1, innatePassive:"Minor elemental resist (pick one)" },
  
    { id:8,  labelTemplate:"Seal-Ready {headgear}",            rarity:"Rare",     missionBands:"A",
      stats:{ def:1.35, stability:1.25, focus:1.18, critProtPct:9,  durability:1.40, chakraEff:0.50, perception:1.20, noise:0.78 },
      sealSlots:2, affinities:1 },
  
    { id:9,  labelTemplate:"Formula-Etched {headgear}",        rarity:"Rare",     missionBands:"A",
      stats:{ def:1.40, stability:1.30, focus:1.20, critProtPct:10, durability:1.45, chakraEff:0.55, perception:1.25, noise:0.76 },
      sealSlots:2, affinities:1, innatePassive:"Choose: Smoke filter / Flash-dampen / Shock padding" },
  
    { id:10, labelTemplate:"ANBU Silent {headgear}",           rarity:"Epic",     missionBands:"A–S",
      stats:{ def:1.55, stability:1.40, focus:1.30, critProtPct:12, durability:1.55, chakraEff:0.60, perception:1.30, noise:0.62 },
      sealSlots:2, affinities:1, innatePassive:"Muffled breath & step; improved backstab stealth window" },
  
    { id:11, labelTemplate:"Kage Guard {headgear}",            rarity:"Epic",     missionBands:"S",
      stats:{ def:1.70, stability:1.55, focus:1.35, critProtPct:14, durability:1.70, chakraEff:0.65, perception:1.35, noise:0.68 },
      sealSlots:3, affinities:1 },
  
    { id:12, labelTemplate:"Sage-Touched {headgear}",          rarity:"Epic",     missionBands:"S",
      stats:{ def:1.85, stability:1.65, focus:1.45, critProtPct:15, durability:1.80, chakraEff:0.70, perception:1.45, noise:0.66 },
      sealSlots:3, affinities:1, innatePassive:"Very slow head-slot self-mend out of combat" },
  
    { id:13, labelTemplate:"Warring States Relic {headgear}",  rarity:"Legendary", missionBands:"S–SS",
      stats:{ def:2.00, stability:1.80, focus:1.55, critProtPct:16, durability:2.00, chakraEff:0.72, perception:1.50, noise:0.70 },
      sealSlots:3, affinities:1 },
  
    { id:14, labelTemplate:"Clan Heirloom {headgear}",         rarity:"Legendary", missionBands:"SS",
      stats:{ def:2.15, stability:1.90, focus:1.65, critProtPct:18, durability:2.10, chakraEff:0.75, perception:1.60, noise:0.66 },
      sealSlots:4, affinities:1, innatePassive:"Signature clan technique synergy (head-slot)" },
  
    { id:15, labelTemplate:"Living Chakra {headgear}",         rarity:"Legendary", missionBands:"SS",
      stats:{ def:2.25, stability:2.00, focus:1.75, critProtPct:20, durability:2.20, chakraEff:0.85, perception:1.70, noise:0.64 },
      sealSlots:4, affinities:1, innatePassive:"Learns wearer; minor focus/perception scaling" },
  
    { id:16, labelTemplate:"Six Paths Fragment {headgear}",    rarity:"Mythic",    missionBands:"SS–SSS",
      stats:{ def:2.40, stability:2.10, focus:1.90, critProtPct:22, durability:2.35, chakraEff:0.90, perception:1.85, noise:0.60 },
      sealSlots:5, affinities:2, innatePassive:"Small bonus vs. bijū/yōkai illusions" },
  
    { id:17, labelTemplate:"Bijū-Attuned {headgear}",          rarity:"Mythic",    missionBands:"SSS",
      stats:{ def:2.55, stability:2.20, focus:2.00, critProtPct:24, durability:2.45, chakraEff:0.92, perception:1.95, noise:0.62 },
      sealSlots:5, affinities:2, innatePassive:"Short burst: overwhelm fear/terror effects" },
  
    { id:18, labelTemplate:"Dual-Nature {headgear}",           rarity:"Mythic",    missionBands:"SSS",
      stats:{ def:2.70, stability:2.30, focus:2.10, critProtPct:26, durability:2.55, chakraEff:0.94, perception:2.05, noise:0.64 },
      sealSlots:5, affinities:2, innatePassive:"Elemental sight cues (trace heat, airflow, or static)" },
  
    { id:19, labelTemplate:"God-Tree Infused {headgear}",      rarity:"Relic",     missionBands:"SSS (quest)",
      stats:{ def:2.85, stability:2.45, focus:2.20, critProtPct:28, durability:2.75, chakraEff:0.96, perception:2.20, noise:0.70 },
      sealSlots:6, affinities:2, innatePassive:"Minor life-ward: chance to negate killing blow (very low)" },
  
    { id:20, labelTemplate:"Ōtsutsuki Relic {headgear}",       rarity:"Relic",     missionBands:"SSS (final arc)",
      stats:{ def:3.00, stability:2.60, focus:2.30, critProtPct:30, durability:3.00, chakraEff:1.00, perception:2.40, noise:0.75 },
      sealSlots:6, affinities:3, innatePassive:"Once-per-mission mythic insight (reveal, cleanse, or foresee)" }
  ];
  
  // Helper: build a concrete name
  export function nameHeadgear(tierId, headgearClass){
    const t = HEADGEAR_TIERS.find(x=>x.id===tierId);
    return t ? t.labelTemplate.replace("{headgear}", headgearClass) : `${headgearClass}`;
  }