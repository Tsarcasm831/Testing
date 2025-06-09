export function getFictionalLocationName(lat, lng) {
  // Pick an orientation label based on hemisphere for extra flavor
  const orientationMap = {
    '++': 'Northeastern',
    '+-': 'Northwestern',
    '-+': 'Southeastern',
    '--': 'Southwestern'
  };
  const orientationKey = `${lat >= 0 ? '+' : '-'}${lng >= 0 ? '+' : '-'}`;
  const orientation = orientationMap[orientationKey];

  // Deterministic pseudo-random generator from coordinates
  const seed = Math.floor(Math.abs(lat * 10000) + Math.abs(lng * 10000));
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(seed);

  const adjectives = [
    'Crimson', 'Verdant', 'Obsidian', 'Azure', 'Golden', 'Umbral',
    'Radiant', 'Celestial', 'Shattered', 'Boreal', 'Silent', 'Hidden',
    'Titanic', 'Iron', 'Silver'
  ];
  const terrains = [
    'Ridge', 'Hollow', 'Harbor', 'Sanctuary', 'Vale', 'Outpost',
    'Bastion', 'Crossing', 'Frontier', 'Beacon', 'Watch', 'Gate',
    'Run', 'Vault', 'Spire'
  ];

  const adj = adjectives[Math.floor(rand() * adjectives.length)];
  const terrain = terrains[Math.floor(rand() * terrains.length)];
  return `${orientation} ${adj} ${terrain}`;
}
