export function getFictionalLocationName(lat, lng) {
  const adjectives = ['Mystic', 'Shadow', 'Crimson', 'Iron', 'Silver', 'Golden', 'Emerald', 'Silent', 'Hidden', 'Radiant'];
  const nouns = ['Haven', 'Valley', 'Outpost', 'Keep', 'Crossing', 'Bastion', 'Harbor', 'Sanctum', 'Frontier', 'Beacon'];
  const seed = Math.abs(Math.floor(lat * 1000) + Math.floor(lng * 1000));
  const adj = adjectives[seed % adjectives.length];
  const noun = nouns[Math.floor(seed / adjectives.length) % nouns.length];
  return `${adj} ${noun}`;
}
