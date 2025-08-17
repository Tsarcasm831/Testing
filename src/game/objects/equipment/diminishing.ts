// stats/diminishing.ts
// Smooth knee after softCap, asymptote at hardCap.
// k controls how "harsh" the bend is (higher = harsher).
export function bend(v: number, opts: {softCap: number; hardCap: number; k?: number}) {
    const { softCap, hardCap, k = 2.0 } = opts;
    if (v <= softCap) return v;
    const span = Math.max(1e-9, hardCap - softCap);
    const over = v - softCap;
    // Exponential ease: fast early progress, then flatten
    const eased = 1 - Math.exp(-(k * over) / span);          // 0..1
    return softCap + span * Math.min(1, eased);
  }
  
  // Convenience for multiplier stats (e.g., critDmg = 1.62)
  export function bendMult(m: number, softCap: number, hardCap: number, k = 2.0) {
    // Convert to "+%" space, bend, convert back
    return 1 + bend(m - 1, { softCap: softCap - 1, hardCap: hardCap - 1, k });
  }
  
  // Canonical soft-cap rules (matches the ranges I gave you)
  export const SOFTCAP_RULES: Record<
    string,
    { softCap: number; hardCap: number; k?: number; type?: "mult" | "ratio" }
  > = {
    critRate:        { softCap: 0.40, hardCap: 1.00, k: 2.2, type: "ratio" },
    critDmg:         { softCap: 2.50, hardCap: 3.00, k: 2.0, type: "mult"  },
    control:         { softCap: 0.40, hardCap: 0.60, k: 2.0, type: "ratio" },
    controlRes:      { softCap: 0.40, hardCap: 0.80, k: 2.0, type: "ratio" },
    critRes:         { softCap: 0.30, hardCap: 0.80, k: 2.0, type: "ratio" },
    hit:             { softCap: 1.10, hardCap: 1.25, k: 1.5, type: "ratio" },
    dodge:           { softCap: 0.35, hardCap: 0.60, k: 1.8, type: "ratio" },
    dmgReduction:    { softCap: 0.50, hardCap: 0.80, k: 2.0, type: "ratio" },
    healBonus:       { softCap: 0.50, hardCap: 1.00, k: 1.5, type: "ratio" },
    recovery:        { softCap: 0.30, hardCap: 1.00, k: 1.8, type: "ratio" },
    dmgBonus:        { softCap: 0.50, hardCap: 2.00, k: 1.4, type: "ratio" },
    phyDmg:          { softCap: 0.50, hardCap: 2.00, k: 1.4, type: "ratio" },
    skillDmg:        { softCap: 0.50, hardCap: 2.00, k: 1.4, type: "ratio" },
    phyDr:           { softCap: 0.50, hardCap: 0.80, k: 2.0, type: "ratio" },
    magDr:           { softCap: 0.50, hardCap: 0.80, k: 2.0, type: "ratio" }
  };
  
  // Apply softcaps to a SpecialStats object in-place-safe
  export function applySoftCaps<T extends Record<string, number>>(special: T): T {
    const out = { ...special };
    for (const [key, rule] of Object.entries(SOFTCAP_RULES)) {
      const v = out[key as keyof T] as unknown as number | undefined;
      if (typeof v !== "number") continue;
      out[key as keyof T] =
        rule.type === "mult"
          ? (bendMult(v, rule.softCap, rule.hardCap, rule.k) as unknown as T[keyof T])
          : (bend(v, rule) as unknown as T[keyof T]);
    }
    return out;
  }
  
  // Optional: multiplicative DR stack (safer than raw add + clamp)
  export function stackDR(drValues: number[], hardCap = 0.80) {
    const combined = 1 - drValues.reduce((m, v) => m * (1 - Math.max(0, v)), 1);
    return Math.min(hardCap, combined);
  }