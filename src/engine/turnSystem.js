function teamPriority(team) {
  if (team === "hero") return 0;
  if (team === "enemy") return 1;
  return 2;
}

export function buildInitiative(units) {
  return [...(units ?? [])].sort((a, b) => {
    if ((b.initiative ?? 0) !== (a.initiative ?? 0)) {
      return (b.initiative ?? 0) - (a.initiative ?? 0);
    }
    if ((b.hp ?? 0) !== (a.hp ?? 0)) {
      return (b.hp ?? 0) - (a.hp ?? 0);
    }
    const teamA = teamPriority(a.team);
    const teamB = teamPriority(b.team);
    if (teamA !== teamB) {
      return teamA - teamB;
    }
    const idA = String(a.id ?? "");
    const idB = String(b.id ?? "");
    return idA.localeCompare(idB);
  });
}
