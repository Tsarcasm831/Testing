import { createGrid } from "./grid.js";

const COLS = 7;
const ROWS = 9;
const gridModel = createGrid(COLS, ROWS);

const container = document.getElementById("grid-container");
const modeSelect = document.getElementById("mode");
const clearBtn = document.getElementById("clear");
const unitInfo = document.getElementById("unit-info");
const enemyInfo = document.getElementById("enemy-info");

let currentMode = modeSelect.value || "topdown";
let labelsVisible = false;

/* helper to render unit info panel for an ally */
function showUnitInfo(data){
  // data: {name, health, initiative, defense, moves:[{name,desc}], portraitUrl, chakra}
  unitInfo.innerHTML = "";
  const title = document.createElement("h2");
  title.innerText = data.name || "Unit";
  unitInfo.appendChild(title);

  const portrait = document.createElement("div");
  portrait.className = "portrait";
  portrait.style.backgroundImage = `url("${data.portraitUrl}")`;
  unitInfo.appendChild(portrait);

  const chakra = document.createElement("div");
  chakra.className = "chakra";
  chakra.innerText = `Chakra: ${data.chakra || "Unknown"}`;
  unitInfo.appendChild(chakra);

  const stats = [
    {k:"Health", v: data.health},
    {k:"Initiative", v: data.initiative},
    {k:"Defense", v: data.defense},
  ];
  stats.forEach(s => {
    const row = document.createElement("div");
    row.className = "stat";
    row.innerHTML = `<span>${s.k}</span><strong>${s.v}</strong>`;
    unitInfo.appendChild(row);
  });

  const movesWrap = document.createElement("div");
  movesWrap.className = "moves";
  data.moves.slice(0,3).forEach(m => {
    const mv = document.createElement("div");
    mv.className = "move";
    mv.innerHTML = `<span>${m.name}</span><small style="opacity:.7">${m.desc || ""}</small>`;
    movesWrap.appendChild(mv);
  });
  unitInfo.appendChild(movesWrap);

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

/* helper to render enemy info panel */
function showEnemyInfo(data) {
  enemyInfo.innerHTML = "";
  const title = document.createElement("h2");
  title.innerText = data.name || "Enemy";
  enemyInfo.appendChild(title);

  const portrait = document.createElement("div");
  portrait.className = "portrait";
  // Obscure portrait slightly
  portrait.style.backgroundImage = `url("${data.portraitUrl}")`;
  portrait.style.filter = "brightness(0.7) blur(1px)";
  enemyInfo.appendChild(portrait);

  const stats = [
    { k: "Health", v: data.health },
    { k: "Initiative", v: data.initiative },
    { k: "Defense", v: data.defense },
  ];
  stats.forEach(s => {
    const row = document.createElement("div");
    row.className = "stat";
    row.innerHTML = `<span>${s.k}</span><strong class="obscured">????</strong>`;
    enemyInfo.appendChild(row);
  });

  const movesWrap = document.createElement("div");
  movesWrap.className = "moves";
  data.moves.slice(0, 3).forEach(m => {
    const mv = document.createElement("div");
    mv.className = "move";
    mv.innerHTML = `<span class="obscured">Unknown Move</span><small class="obscured">????</small>`;
    movesWrap.appendChild(mv);
  });
  enemyInfo.appendChild(movesWrap);

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

/* default sample ally data keyed by grid coordinate (c,r) */
const allyData = {
  "3,5": {
    name: "Ally T",
    health: "85 / 100",
    initiative: 12,
    defense: 8,
    chakra: "Fire",
    portraitUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d7b2e2d6b1f9b9a8f3a1f8d3e9b0a2c", // placeholder image
    moves: [
      {name:"Slash", desc:"Single-target physical"},
      {name:"Burn Slash", desc:"Fire damage + DOT"},
      {name:"Guard Stance", desc:"Increase defense 1 turn"}
    ]
  }
  // future allies can be added here
};

/* default sample enemy data keyed by grid coordinate (c,r) */
const enemyData = {
  "3,3": {
    name: "Wolf",
    health: "?? / ??",
    initiative: "??",
    defense: "??",
    portraitUrl: "https://images.unsplash.com/photo-1591701960374-17c38575691f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=a4e6a8888062b11b15a6114197931c8e", // placeholder
    moves: [
      { name: "Bite", desc: "Physical damage" },
      { name: "Howl", desc: "Intimidates target" },
      { name: "Pounce", desc: "High-damage leap" }
    ]
  }
};

function buildGridElement(){
  container.innerHTML = ""; // clear
  const wrapper = document.createElement("div");
  wrapper.className = currentMode === "isometric" ? "isometric-wrap" : "topdown-wrap";

  const gridEl = document.createElement("div");
  gridEl.className = "grid";
  gridEl.style.gridTemplateColumns = `repeat(${COLS}, auto)`;

  // populate cells row-major so ordering matches topdown grid
  gridModel.forEachCell((cell, r, c) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.dataset.r = r;
    div.dataset.c = c;
    div.id = `cell-${cell.id}`;
    div.title = `c:${c} r:${r}`;

    // label element for easy reference (hidden by default; toggled with 'G')
    const label = document.createElement("span");
    label.className = "cell-label";
    label.innerText = `${c},${r}`;
    div.appendChild(label);

    // Add an ally unit "T" at column 3, row 5 (c=3, r=5)
    if (c === 3 && r === 5) {
      div.classList.add("ally");
      const unit = document.createElement("span");
      unit.className = "unit";
      unit.innerText = "T";
      unit.setAttribute("aria-hidden", "true");
      div.appendChild(unit);
      div.title += " • Ally T";
    }
    
    // add an enemy unit "E" at column 3, row 3 (c=3, r=3)
    if (c === 3 && r === 3) {
      div.classList.add("enemy-unit");
      const enemy = document.createElement("span");
      enemy.className = "unit enemy";
      enemy.innerText = "E";
      enemy.setAttribute("aria-hidden", "true");
      div.appendChild(enemy);
      div.title += " • Enemy (Wolf)";
    }
    
    // highlight a 3x3 block: columns 2-4 and rows 5-7 (c = 2..4, r = 5..7)
    if (c >= 2 && c <= 4 && r >= 5 && r <= 7) {
      div.classList.add("highlight-blue");
    }

    // mark enemy rows (rows 0,1,2,3) with a light red background
    if (r >= 0 && r <= 3) {
      div.classList.add("enemy-red");
    }
    
    if(cell.selected) div.classList.add("selected");

    div.addEventListener("click", (e) => {
      e.preventDefault();
      const updated = gridModel.toggleCell(r, c);
      if(updated.selected) div.classList.add("selected");
      else div.classList.remove("selected");

      // If this tile has an ally, open the info panel with that ally's data
      if (div.classList.contains("ally")) {
        enemyInfo.classList.add("hidden"); // hide enemy panel
        enemyInfo.setAttribute("aria-hidden", "true");
        const key = `${c},${r}`;
        const data = allyData[key];
        if (data) showUnitInfo(data);
        else showUnitInfo({name:`Ally (${c},${r})`, health:"?", initiative:"?", defense:"?", chakra:"?", portraitUrl:"https://via.placeholder.com/400", moves:[{name:"Wait"},{name:"Strike"},{name:"Move"}]});
      } else if (div.classList.contains("enemy-unit")) {
        unitInfo.classList.add("hidden"); // hide ally panel
        unitInfo.setAttribute("aria-hidden", "true");
        const key = `${c},${r}`;
        const data = enemyData[key];
        if (data) showEnemyInfo(data);
      }
      else {
        // clicking non-unit will keep selection behavior but hide panels
        unitInfo.classList.add("hidden");
        unitInfo.setAttribute("aria-hidden", "true");
        enemyInfo.classList.add("hidden");
        enemyInfo.setAttribute("aria-hidden", "true");
      }
    });

    gridEl.appendChild(div);
  });

  wrapper.appendChild(gridEl);
  container.appendChild(wrapper);

  // apply current labelsVisible state (useful when rebuilding)
  if(labelsVisible) container.classList.add("show-labels");
  else container.classList.remove("show-labels");
}

function resizeContainer(){
  // center and limit width for nice layout, minimal logic
  // no-op for now; kept for future adjustments
}

modeSelect.addEventListener("change", (e) => {
  currentMode = e.target.value;
  buildGridElement();
});

clearBtn.addEventListener("click", () => {
  gridModel.clearSelection();
  buildGridElement();
  unitInfo.classList.add("hidden");
  unitInfo.setAttribute("aria-hidden", "true");
  enemyInfo.classList.add("hidden");
  enemyInfo.setAttribute("aria-hidden", "true");
});

// keyboard toggle for labels: press "g" or "G"
window.addEventListener("keydown", (e) => {
  if(e.key === "g" || e.key === "G"){
    labelsVisible = !labelsVisible;
    if(labelsVisible) container.classList.add("show-labels");
    else container.classList.remove("show-labels");
  }
});

// initial render
buildGridElement();
window.addEventListener("resize", resizeContainer);