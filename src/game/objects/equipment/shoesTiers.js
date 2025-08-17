// tiers/shoesTiers.js
export const FOOTWEAR_CLASSES = [
    "Tabi Sandals — Leaf",
    "Tabi Sandals — Sand",
    "Tabi Sandals — Mist",
    "Reinforced Shinobi Tabi",
    "ANBU Silent Tabi",
    "Hunter-nin Field Boots",
    "Samurai Suneate Greaves",
    "Sensor Field Boots",
    "Medical Corps Boots",
    "Akatsuki Sandals"
  ];
  
  export const FOOTWEAR_TIERS = [
    { id:1,  labelTemplate:"Academy {footwear}",              rarity:"Common",   missionBands:"D",
      stats:{ def:0.50, stability:0.60, mobility:0.98, evasionPct:0,  traction:0.85, durability:0.70, chakraEff:0.00, noise:1.00 },
      sealSlots:0, affinities:0 },
  
    { id:2,  labelTemplate:"Genin Field {footwear}",           rarity:"Common",   missionBands:"D–C",
      stats:{ def:0.65, stability:0.75, mobility:1.00, evasionPct:2,  traction:0.90, durability:0.88, chakraEff:0.05, noise:0.95 },
      sealSlots:0, affinities:0 },
  
    { id:3,  labelTemplate:"Clan Workshop {footwear}",         rarity:"Uncommon", missionBands:"C",
      stats:{ def:0.80, stability:0.88, mobility:1.02, evasionPct:4,  traction:0.95, durability:1.00, chakraEff:0.10, noise:0.90 },
      sealSlots:0, affinities:0 },
  
    { id:4,  labelTemplate:"Chūnin Patrol {footwear}",         rarity:"Uncommon", missionBands:"C–B",
      stats:{ def:0.90, stability:1.00, mobility:1.03, evasionPct:5,  traction:1.00, durability:1.18, chakraEff:0.12, noise:0.88 },
      sealSlots:0, affinities:0 },
  
    { id:5,  labelTemplate:"Konoha Masterwork {footwear}",     rarity:"Uncommon", missionBands:"B",
      stats:{ def:1.00, stability:1.08, mobility:1.04, evasionPct:6,  traction:1.02, durability:1.25, chakraEff:0.15, noise:0.86 },
      sealSlots:0, affinities:0 },
  
    { id:6,  labelTemplate:"Chakra-Conductive {footwear}",     rarity:"Rare",     missionBands:"B",
      stats:{ def:1.10, stability:1.15, mobility:1.06, evasionPct:7,  traction:1.06, durability:1.30, chakraEff:0.35, noise:0.84 },
      sealSlots:1, affinities:0 },
  
    { id:7,  labelTemplate:"Element-Tuned {footwear}",         rarity:"Rare",     missionBands:"B–A",
      stats:{ def:1.18, stability:1.22, mobility:1.08, evasionPct:8,  traction:1.08, durability:1.35, chakraEff:0.45, noise:0.82 },
      sealSlots:1, affinities:1, innatePassive:"Minor elemental terrain resist (pick one)" },
  
    { id:8,  labelTemplate:"Seal-Ready {footwear}",            rarity:"Rare",     missionBands:"A",
      stats:{ def:1.26, stability:1.28, mobility:1.10, evasionPct:9,  traction:1.10, durability:1.40, chakraEff:0.50, noise:0.80 },
      sealSlots:2, affinities:1 },
  
    { id:9,  labelTemplate:"Formula-Etched {footwear}",        rarity:"Rare",     missionBands:"A",
      stats:{ def:1.34, stability:1.34, mobility:1.12, evasionPct:10, traction:1.12, durability:1.45, chakraEff:0.55, noise:0.78 },
      sealSlots:2, affinities:1, innatePassive:"Choose: Anti-shock soles / Heat-dampen / Hemostatic wrap" },
  
    { id:10, labelTemplate:"ANBU Silent {footwear}",           rarity:"Epic",     missionBands:"A–S",
      stats:{ def:1.46, stability:1.46, mobility:1.15, evasionPct:12, traction:1.15, durability:1.55, chakraEff:0.60, noise:0.62 },
      sealSlots:2, affinities:1, innatePassive:"Silent Step: heavily reduced footfall noise; bonus backstab window" },
  
    { id:11, labelTemplate:"Kage Guard {footwear}",            rarity:"Epic",     missionBands:"S",
      stats:{ def:1.60, stability:1.58, mobility:1.18, evasionPct:14, traction:1.18, durability:1.70, chakraEff:0.65, noise:0.68 },
      sealSlots:3, affinities:1 },
  
    { id:12, labelTemplate:"Sage-Touched {footwear}",          rarity:"Epic",     missionBands:"S",
      stats:{ def:1.72, stability:1.70, mobility:1.20, evasionPct:15, traction:1.20, durability:1.80, chakraEff:0.70, noise:0.66 },
      sealSlots:3, affinities:1, innatePassive:"Slow self-mend (soles) out of combat" },
  
    { id:13, labelTemplate:"Warring States Relic {footwear}",  rarity:"Legendary", missionBands:"S–SS",
      stats:{ def:1.86, stability:1.82, mobility:1.22, evasionPct:16, traction:1.22, durability:2.00, chakraEff:0.72, noise:0.70 },
      sealSlots:3, affinities:1 },
  
    { id:14, labelTemplate:"Clan Heirloom {footwear}",         rarity:"Legendary", missionBands:"SS",
      stats:{ def:2.00, stability:1.94, mobility:1.24, evasionPct:18, traction:1.24, durability:2.10, chakraEff:0.75, noise:0.66 },
      sealSlots:4, affinities:1, innatePassive:"Signature clan technique synergy (movement)" },
  
    { id:15, labelTemplate:"Living Chakra {footwear}",         rarity:"Legendary", missionBands:"SS",
      stats:{ def:2.10, stability:2.02, mobility:1.26, evasionPct:20, traction:1.26, durability:2.20, chakraEff:0.85, noise:0.64 },
      sealSlots:4, affinities:1, innatePassive:"Learns gait; minor mobility/evasion scaling" },
  
    { id:16, labelTemplate:"Six Paths Fragment {footwear}",    rarity:"Mythic",    missionBands:"SS–SSS",
      stats:{ def:2.22, stability:2.12, mobility:1.28, evasionPct:22, traction:1.28, durability:2.35, chakraEff:0.90, noise:0.62 },
      sealSlots:5, affinities:2, innatePassive:"Firm step: bonus stability on water/tree-walk" },
  
    { id:17, labelTemplate:"Bijū-Attuned {footwear}",          rarity:"Mythic",    missionBands:"SSS",
      stats:{ def:2.35, stability:2.22, mobility:1.30, evasionPct:24, traction:1.30, durability:2.45, chakraEff:0.92, noise:0.62 },
      sealSlots:5, affinities:2, innatePassive:"Burst Step: short sprint/air-dodge on full chakra (cooldown)" },
  
    { id:18, labelTemplate:"Dual-Nature {footwear}",           rarity:"Mythic",    missionBands:"SSS",
      stats:{ def:2.50, stability:2.32, mobility:1.30, evasionPct:26, traction:1.32, durability:2.55, chakraEff:0.94, noise:0.64 },
      sealSlots:5, affinities:2, innatePassive:"Elemental pathing: resist two terrain hazards" },
  
    { id:19, labelTemplate:"God-Tree Infused {footwear}",      rarity:"Relic",     missionBands:"SSS (quest)",
      stats:{ def:2.60, stability:2.45, mobility:1.30, evasionPct:28, traction:1.34, durability:2.65, chakraEff:0.96, noise:0.70 },
      sealSlots:6, affinities:2, innatePassive:"Life-ward stride: very low chance to ignore fall/terrain lethal" },
  
    { id:20, labelTemplate:"Ōtsutsuki Relic {footwear}",       rarity:"Relic",     missionBands:"SSS (final arc)",
      stats:{ def:2.75, stability:2.60, mobility:1.30, evasionPct:30, traction:1.35, durability:2.80, chakraEff:1.00, noise:0.75 },
      sealSlots:6, affinities:3, innatePassive:"Once-per-mission mythic step (air step / blink dash)" }
  ];
  
  // Helper: build a concrete name
  export function nameFootwear(tierId, footwearClass){
    const t = FOOTWEAR_TIERS.find(x=>x.id===tierId);
    return t ? t.labelTemplate.replace("{footwear}", footwearClass) : `${footwearClass}`;
  }