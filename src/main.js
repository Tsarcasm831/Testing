import { starterParty, enemyBestiary, makeEnemy } from "./data/units.js";
import { encounter01 } from "./data/spawns.js";
import {
  tryMove,
  tryAttack,
  rest as restAction,
  endOfUnitTurn,
} from "./engine/actions.js";
import { buildInitiative } from "./engine/turnSystem.js";
import { aiTakeTurn } from "./engine/ai.js";
import {
  isHero,
  isEnemy,
  isAlive,
  canAct,
  regenerateChakra,
} from "./engine/rules.js";

const GRID_WIDTH = 7;
const GRID_HEIGHT = 9;
const PLACEMENT_ROWS = { min: 5, max: 8 };
const PASSIVE_CHAKRA_REGEN = 5;

const container = document.getElementById("grid-container");
const modeSelect = document.getElementById("mode");
const actionBtn = document.getElementById("start-battle");
const unitInfo = document.getElementById("unit-info");
const enemyInfo = document.getElementById("enemy-info");
const footerNote = document.querySelector("footer small");
const phaseBadge = document.getElementById("phase");

const restBtn = document.getElementById("action-rest");
const skipBtn = document.getElementById("action-skip");

let currentMode = modeSelect.value || "topdown";
let labelsVisible = false;

const state = {
  bounds: { width: GRID_WIDTH, height: GRID_HEIGHT },
  phase: "placement",
  units: cloneParty(starterParty),
  heldUnitId: null,
  initiative: [],
  turnIndex: 0,
  round: 1,
  waveIndex: 0,
};

function deepClone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function cloneParty(party) {
  return party.map((unit) => ({
    ...deepClone(unit),
    exhausted: false,
    hasMoved: false,
    hasActed: false,
  }));
}

function heroesRemaining() {
  return getAliveUnits().some((unit) => isHero(unit));
}

function getAliveUnits() {
  return state.units.filter((unit) => isAlive(unit));
}

function getReadyUnits() {
  return getAliveUnits().filter((unit) => !unit.exhausted);
}

function findUnitById(id) {
  return state.units.find((unit) => unit.id === id);
}

function findUnitAtPosition(x, y) {
  return getAliveUnits().find(
    (unit) => unit.position?.x === x && unit.position?.y === y
  );
}

function isPlacementRow(y) {
  return y >= PLACEMENT_ROWS.min && y <= PLACEMENT_ROWS.max;
}

function resetSidebars() {
  unitInfo.classList.add("hidden");
  unitInfo.setAttribute("aria-hidden", "true");
  enemyInfo.classList.add("hidden");
  enemyInfo.setAttribute("aria-hidden", "true");
}

function showUnitInfo(unit) {
  if (!unit) {
    resetSidebars();
    return;
  }
  enemyInfo.classList.add("hidden");
  enemyInfo.setAttribute("aria-hidden", "true");
  unitInfo.innerHTML = "";

  const title = document.createElement("h2");
  title.innerText = unit.name;
  unitInfo.appendChild(title);

  if (unit.portraitUrl) {
    const portrait = document.createElement("div");
    portrait.className = "portrait";
    portrait.style.backgroundImage = `url("${unit.portraitUrl}")`;
    unitInfo.appendChild(portrait);
  }

  const chakra = document.createElement("div");
  chakra.className = "chakra";
  chakra.innerText = `Chakra: ${unit.chakra} / ${unit.maxChakra}`;
  unitInfo.appendChild(chakra);

  const stats = [
    { label: "Health", value: `${unit.hp} / ${unit.maxHp}` },
    { label: "Initiative", value: unit.initiative ?? "-" },
    { label: "Attack", value: unit.attack ?? "-" },
    { label: "Defense", value: unit.defense ?? "-" },
  ];

  stats.forEach((stat) => {
    const row = document.createElement("div");
    row.className = "stat";
    row.innerHTML = `<span>${stat.label}</span><strong>${stat.value}</strong>`;
    unitInfo.appendChild(row);
  });

  if (Array.isArray(unit.moves)) {
    const movesWrap = document.createElement("div");
    movesWrap.className = "moves";
    unit.moves.slice(0, 3).forEach((move) => {
      const mv = document.createElement("div");
      mv.className = "move";
      mv.innerHTML = `<span>${move.name}</span><small style="opacity:.7">${
        move.desc ?? ""
      }</small>`;
      movesWrap.appendChild(mv);
    });
    unitInfo.appendChild(movesWrap);
  }

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-btn";
  closeBtn.innerText = "Close";
  closeBtn.addEventListener("click", () => {
    unitInfo.classList.add("hidden");
    unitInfo.setAttribute("aria-hidden", "true");
  });
  unitInfo.appendChild(closeBtn);

  unitInfo.classList.remove("hidden");
  unitInfo.setAttribute("aria-hidden", "false");
}

function showEnemyInfo(unit) {
  if (!unit) {
    resetSidebars();
    return;
  }
  unitInfo.classList.add("hidden");
  unitInfo.setAttribute("aria-hidden", "true");
  enemyInfo.innerHTML = "";

  const title = document.createElement("h2");
  title.innerText = unit.name;
  enemyInfo.appendChild(title);

  if (unit.portraitUrl) {
    const portrait = document.createElement("div");
    portrait.className = "portrait";
    portrait.style.backgroundImage = `url("${unit.portraitUrl}")`;
    portrait.style.filter = "brightness(0.7) blur(1px)";
    enemyInfo.appendChild(portrait);
  }

  const stats = [
    { label: "Health", value: `${unit.hp} / ${unit.maxHp}` },
    { label: "Initiative", value: unit.initiative ?? "-" },
    { label: "Defense", value: unit.defense ?? "-" },
  ];

  stats.forEach((stat) => {
    const row = document.createElement("div");
    row.className = "stat";
    row.innerHTML = `<span>${stat.label}</span><strong class="obscured">????</strong>`;
    enemyInfo.appendChild(row);
  });

  if (Array.isArray(unit.moves)) {
    const movesWrap = document.createElement("div");
    movesWrap.className = "moves";
    unit.moves.slice(0, 3).forEach(() => {
      const mv = document.createElement("div");
      mv.className = "move";
      mv.innerHTML = `<span class="obscured">Unknown Move</span><small class="obscured">????</small>`;
      movesWrap.appendChild(mv);
    });
    enemyInfo.appendChild(movesWrap);
  }

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-btn";
  closeBtn.innerText = "Close";
  closeBtn.addEventListener("click", () => {
    enemyInfo.classList.add("hidden");
    enemyInfo.setAttribute("aria-hidden", "true");
  });
  enemyInfo.appendChild(closeBtn);

  enemyInfo.classList.remove("hidden");
  enemyInfo.setAttribute("aria-hidden", "false");
}

function spawnNextWave() {
  if (state.waveIndex >= encounter01.length) {
    return false;
  }
  const wave = encounter01[state.waveIndex];
  wave.units.forEach((entry) => {
    const blueprint = enemyBestiary[entry.blueprint];
    if (!blueprint) return;
    const enemy = makeEnemy({
      ...deepClone(blueprint),
      position: { ...entry.position },
      exhausted: false,
      hasMoved: false,
      hasActed: false,
    });
    const occupying = findUnitAtPosition(enemy.position.x, enemy.position.y);
    if (occupying) {
      return;
    }
    state.units.push(enemy);
  });
  state.waveIndex += 1;
  return true;
}

function recomputeInitiative() {
  const ready = getReadyUnits();
  state.initiative = buildInitiative(ready);
  if (state.turnIndex >= state.initiative.length) {
    state.turnIndex = 0;
  }
}

function getActiveUnit() {
  return state.initiative[state.turnIndex] ?? null;
}

function refreshRound() {
  state.units.forEach((unit) => {
    if (isAlive(unit)) {
      unit.exhausted = false;
      unit.hasMoved = false;
      unit.hasActed = false;
    }
  });
  spawnNextWave();
  recomputeInitiative();
  state.turnIndex = 0;
  updateFooter();
}

function updateFooter() {
  if (!footerNote) return;
  if (state.phase === "placement") {
    footerNote.textContent =
      "Placement: drag heroes within rows 5–8, then start the battle.";
  } else {
    footerNote.textContent = `Round ${state.round} • Heroes hold the line.`;
  }
}

function updateControls() {
  const phaseLabel =
    state.phase === "placement" ? "Placement" : "Battle";
  if (phaseBadge) {
    phaseBadge.textContent = `Phase: ${phaseLabel}`;
  }
  if (state.phase === "placement") {
    if (actionBtn) {
      actionBtn.textContent = "Start Battle";
    }
    if (restBtn) {
      restBtn.disabled = true;
    }
    if (skipBtn) {
      skipBtn.disabled = true;
    }
  } else {
    if (actionBtn) {
      actionBtn.textContent = "Reset";
    }
    const active = getActiveUnit();
    const canUseButtons = !!active && isHero(active) && canAct(active);
    if (restBtn) {
      restBtn.disabled = !canUseButtons;
    }
    if (skipBtn) {
      skipBtn.disabled = !canUseButtons;
    }
  }
}

function ensureActiveUnit() {
  recomputeInitiative();
  if (!state.initiative.length) {
    return;
  }
  if (state.turnIndex >= state.initiative.length) {
    state.turnIndex = 0;
  }
}

function passiveRegen(unit) {
  if (!unit) return;
  regenerateChakra(unit, PASSIVE_CHAKRA_REGEN);
}

function finishTurn(unit) {
  if (!unit) return;
  passiveRegen(unit);
  endOfUnitTurn(state, unit);
  recomputeInitiative();
  if (state.initiative.length === 0) {
    state.round += 1;
    refreshRound();
  }
}

function processAutoTurns(limit = 32) {
  updateControls();
  let iterations = 0;
  while (iterations < limit) {
    if (!heroesRemaining()) {
      break;
    }
    ensureActiveUnit();
    const active = getActiveUnit();
    if (!active) {
      break;
    }
    if (!isAlive(active)) {
      active.exhausted = true;
      recomputeInitiative();
      iterations += 1;
      continue;
    }
    if (isHero(active)) {
      break;
    }
    if (!canAct(active)) {
      active.exhausted = true;
      recomputeInitiative();
      iterations += 1;
      continue;
    }
    aiTakeTurn(state, active);
    finishTurn(active);
    iterations += 1;
  }
  renderGrid();
  updateControls();
}

function startBattle() {
  state.phase = "battle";
  state.round = 1;
  state.waveIndex = 0;
  state.heldUnitId = null;
  spawnNextWave();
  state.units.forEach((unit) => {
    unit.exhausted = false;
  });
  recomputeInitiative();
  state.turnIndex = 0;
  processAutoTurns();
  updateFooter();
}

function resetBattle() {
  state.phase = "placement";
  state.units = cloneParty(starterParty);
  state.heldUnitId = null;
  state.round = 1;
  state.waveIndex = 0;
  state.initiative = [];
  state.turnIndex = 0;
  resetSidebars();
  renderGrid();
  updateFooter();
  updateControls();
}

function handlePlacementClick(x, y) {
  const occupant = findUnitAtPosition(x, y);
  if (occupant && isHero(occupant)) {
    state.heldUnitId = occupant.id;
    showUnitInfo(occupant);
    renderGrid();
    return;
  }

  if (!state.heldUnitId) {
    return;
  }

  if (!isPlacementRow(y)) {
    return;
  }

  const occupying = findUnitAtPosition(x, y);
  if (occupying && occupying.id !== state.heldUnitId) {
    return;
  }

  const held = findUnitById(state.heldUnitId);
  if (!held) return;
  held.position = { x, y };
  state.heldUnitId = null;
  renderGrid();
}

function handleBattleClick(x, y) {
  const active = getActiveUnit();
  if (!active || !isHero(active) || !canAct(active)) {
    const occupant = findUnitAtPosition(x, y);
    if (occupant) {
      occupant.team === "enemy" ? showEnemyInfo(occupant) : showUnitInfo(occupant);
    } else {
      resetSidebars();
    }
    return;
  }

  const occupant = findUnitAtPosition(x, y);
  if (occupant) {
    if (occupant.id === active.id) {
      showUnitInfo(active);
      return;
    }
    if (isEnemy(occupant)) {
      const result = tryAttack(state, active, occupant);
      if (result) {
        showEnemyInfo(occupant);
        finishTurn(active);
        processAutoTurns();
      }
    } else if (isHero(occupant)) {
      showUnitInfo(occupant);
    }
    renderGrid();
    return;
  }

  const moved = tryMove(state, active, { x, y });
  if (moved) {
    finishTurn(active);
    processAutoTurns();
  }
  renderGrid();
}

function handleCellClick(event) {
  event.preventDefault();
  const cell = event.currentTarget;
  const x = Number(cell.dataset.c);
  const y = Number(cell.dataset.r);

  if (state.phase === "placement") {
    handlePlacementClick(x, y);
  } else {
    handleBattleClick(x, y);
  }
}

function renderGrid() {
  container.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = currentMode === "isometric" ? "isometric-wrap" : "topdown-wrap";

  const gridEl = document.createElement("div");
  gridEl.className = "grid";
  gridEl.style.gridTemplateColumns = `repeat(${GRID_WIDTH}, auto)`;

  for (let y = 0; y < GRID_HEIGHT; y += 1) {
    for (let x = 0; x < GRID_WIDTH; x += 1) {
      const div = document.createElement("div");
      div.className = "cell";
      div.dataset.r = y;
      div.dataset.c = x;
      div.id = `cell-${x}-${y}`;
      const label = document.createElement("span");
      label.className = "cell-label";
      label.innerText = `${x},${y}`;
      div.appendChild(label);

      if (state.phase === "placement" && isPlacementRow(y)) {
        div.classList.add("highlight-blue");
      }
      if (y <= 3) {
        div.classList.add("enemy-red");
      }

      const occupant = findUnitAtPosition(x, y);
      if (occupant) {
        const unitEl = document.createElement("span");
        unitEl.className = "unit";
        unitEl.innerText = occupant.name?.charAt(0) ?? "?";
        unitEl.setAttribute("aria-hidden", "true");
        if (isHero(occupant)) {
          div.classList.add("ally");
          unitEl.classList.add("ally-unit");
        } else if (isEnemy(occupant)) {
          div.classList.add("enemy-unit");
          unitEl.classList.add("enemy");
        }
        const active = getActiveUnit();
        if (state.phase === "battle" && active && active.id === occupant.id) {
          div.classList.add("active-turn");
        }
        if (state.phase === "placement" && state.heldUnitId === occupant.id) {
          div.classList.add("selected");
        }
        div.appendChild(unitEl);
        div.title = `${occupant.name}`;
      }

      div.addEventListener("click", handleCellClick);
      gridEl.appendChild(div);
    }
  }

  wrapper.appendChild(gridEl);
  container.appendChild(wrapper);

  if (labelsVisible) {
    container.classList.add("show-labels");
  } else {
    container.classList.remove("show-labels");
  }
}

function handleRest() {
  const active = getActiveUnit();
  if (!active || !isHero(active) || !canAct(active)) {
    return;
  }
  restAction(state, active, 25);
  finishTurn(active);
  processAutoTurns();
}

function handleSkip() {
  const active = getActiveUnit();
  if (!active || !isHero(active)) {
    return;
  }
  finishTurn(active);
  processAutoTurns();
}

modeSelect.addEventListener("change", (event) => {
  currentMode = event.target.value;
  renderGrid();
});

if (actionBtn) {
  actionBtn.addEventListener("click", () => {
    if (state.phase === "placement") {
      startBattle();
    } else {
      resetBattle();
    }
  });
}

if (restBtn) {
  restBtn.addEventListener("click", handleRest);
}
if (skipBtn) {
  skipBtn.addEventListener("click", handleSkip);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "g" || event.key === "G") {
    labelsVisible = !labelsVisible;
    if (labelsVisible) {
      container.classList.add("show-labels");
    } else {
      container.classList.remove("show-labels");
    }
  }
});

updateFooter();
renderGrid();
updateControls();
