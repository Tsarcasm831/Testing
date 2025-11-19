import { DEFAULT_MODEL } from '../user-defaults.js';

const W = 1018;
const H = 968;

function getActiveModel() {
  try {
    const local = localStorage.getItem('konoha-map-v2');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && (parsed.lands || parsed.districts)) {
        if (!parsed.lands && parsed.districts) parsed.lands = parsed.districts;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load local model:', e);
  }
  return DEFAULT_MODEL;
}

const ACTIVE_MODEL = getActiveModel();

const fallbackRangers = [
  { code: 'A', name: 'Azura Squad', detail: 'Patrolling borderlines and relay towers.' },
  { code: 'B', name: 'Beacon Team', detail: 'Signals intel and long-range scans.' },
  { code: 'C', name: 'Crimson Watch', detail: 'Shadows operating near waterways.' }
];

const fallbackNinjas = [
  { name: 'Raikiri', detail: 'Seen near canyon ridge checkpoints.', village: 'Unknown origin' },
  { name: 'Silent Gale', detail: 'Expert in soundless infiltration.', village: 'Unknown origin' },
  { name: 'Obsidian Kunoichi', detail: 'Poison specialist with stealth tactics.', village: 'Unknown origin' },
  { name: 'Red Fang', detail: 'Reported around supply convoys.', village: 'Unknown origin' },
  { name: 'Ghost Runner', detail: 'Vanishing after dusk; likely local.', village: 'Unknown origin' }
];

const fallbackFacts = [
  { title: 'Terrain Pulse', detail: 'Rolling landscapes spotted with hideouts. Keep scouts mobile and rotate vantage points every 3 hours.' },
  { title: 'Allied Signals', detail: 'Nearest friendly post is two valleys away. Use blue flares to request backup or evacuation.' },
  { title: 'Supply Notes', detail: 'Rations cached along the northern ridge. Approaching storms may affect access routes.' }
];

function getLandId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || document.body.dataset.landId || null;
}

function normalizeRangers(landName, rangers = []) {
  if (Array.isArray(rangers) && rangers.length > 0) {
    return rangers.map((item, index) => ({
      code: item.code || String.fromCharCode(65 + index),
      name: item.name || `Sentinel ${String.fromCharCode(65 + index)}`,
      detail: item.detail || `Scouting routes near ${landName}.`
    }));
  }

  return fallbackRangers.map((item, index) => ({
    ...item,
    detail: `${item.detail} (${landName})`
  }));
}

function normalizeNinjas(landName, ninjas = []) {
  if (Array.isArray(ninjas) && ninjas.length > 0) {
    return ninjas.map((item) => ({
      name: item.name || 'Unidentified ninja',
      detail: item.detail || `Activity tracked around ${landName}.`,
      village: item.village || 'Unknown origin',
      image: item.image || null
    }));
  }

  return fallbackNinjas.map((item) => ({
    ...item,
    detail: `${item.detail} (${landName})`
  }));
}

function normalizeFacts(landName, facts = [], landDesc = '') {
  if (Array.isArray(facts) && facts.length > 0) {
    return facts.map((item, index) => ({
      title: item.title || `Key fact ${index + 1}`,
      detail: item.detail || `Field intel recorded for ${landName}.`
    }));
  }

  if (landDesc) {
    return [
      { title: 'Report Summary', detail: landDesc },
      ...fallbackFacts.slice(1)
    ];
  }

  return fallbackFacts;
}

function renderList(containerId, items, renderer, emptyMessage, placeholderClass = 'stacked-item') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (!items || items.length === 0) {
    const placeholder = document.createElement('li');
    placeholder.className = placeholderClass;
    placeholder.textContent = emptyMessage || 'No data available.';
    container.appendChild(placeholder);
    return;
  }

  for (const item of items) {
    container.appendChild(renderer(item));
  }
}

function renderRangers(rangers) {
  renderList(
    'rangerList',
    rangers,
    (item) => {
      const li = document.createElement('li');
      li.className = 'stacked-item';

      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = item.code || '•';

      const body = document.createElement('div');
      body.className = 'item-body';

      const strong = document.createElement('strong');
      strong.textContent = item.name;

      const span = document.createElement('span');
      span.textContent = item.detail;

      body.appendChild(strong);
      body.appendChild(span);
      li.appendChild(pill);
      li.appendChild(body);

      return li;
    },
    'No ranger teams reported.'
  );
}

function getBingoModalElements() {
  return {
    root: document.getElementById('bingoModal'),
    backdrop: document.getElementById('bingoModalBackdrop'),
    closeBtn: document.getElementById('bingoModalClose'),
    name: document.getElementById('bingoName'),
    village: document.getElementById('bingoVillage'),
    detail: document.getElementById('bingoDetail'),
    image: document.getElementById('bingoImage')
  };
}

function slugifyName(name = '') {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'unknown-ninja';
}

function getNinjaImage(item) {
  if (item.image) return item.image;
  return `../assets/characters/${slugifyName(item.name)}.png`;
}

function showBingoModal(item) {
  const modal = getBingoModalElements();
  if (!modal.root) return;

  modal.name.textContent = item.name;
  modal.village.textContent = item.village || 'Unknown origin';
  modal.detail.textContent = item.detail;
  modal.image.src = getNinjaImage(item);
  modal.image.alt = `${item.name} portrait`;

  modal.root.classList.remove('hidden');
  modal.root.setAttribute('aria-hidden', 'false');
}

function hideBingoModal() {
  const modal = getBingoModalElements();
  if (!modal.root) return;

  modal.root.classList.add('hidden');
  modal.root.setAttribute('aria-hidden', 'true');
}

function wireModalEvents() {
  const modal = getBingoModalElements();
  if (!modal.root) return;

  modal.backdrop?.addEventListener('click', hideBingoModal);
  modal.closeBtn?.addEventListener('click', hideBingoModal);
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && !modal.root.classList.contains('hidden')) {
      hideBingoModal();
    }
  });
}

function renderBingoBook(ninjas) {
  renderList(
    'ninjaList',
    ninjas,
    (item) => {
      const li = document.createElement('li');
      li.className = 'check-item bingo-card';
      li.setAttribute('role', 'button');
      li.tabIndex = 0;

      const icon = document.createElement('span');
      icon.className = 'check-icon';

      const body = document.createElement('div');
      body.className = 'item-body';

      const strong = document.createElement('strong');
      strong.textContent = item.name;

      const meta = document.createElement('span');
      meta.className = 'item-meta';
      meta.textContent = item.village || 'Unknown origin';

      const span = document.createElement('span');
      span.textContent = item.detail;

      body.appendChild(strong);
      body.appendChild(meta);
      body.appendChild(span);
      li.appendChild(icon);
      li.appendChild(body);

      const openModal = () => showBingoModal(item);
      li.addEventListener('click', openModal);
      li.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          openModal();
        }
      });

      return li;
    },
    'No bingo book records found.',
    'check-item'
  );
}

function renderFacts(facts) {
  const container = document.getElementById('factsGrid');
  container.innerHTML = '';

  if (!facts || facts.length === 0) {
    const placeholder = document.createElement('article');
    placeholder.className = 'detail-card';

    const h3 = document.createElement('h3');
    h3.textContent = 'No intel available';

    const p = document.createElement('p');
    p.textContent = 'Details are missing for this territory.';

    placeholder.appendChild(h3);
    placeholder.appendChild(p);
    container.appendChild(placeholder);
    return;
  }

  for (const fact of facts) {
    const card = document.createElement('article');
    card.className = 'detail-card';

    const h3 = document.createElement('h3');
    h3.textContent = fact.title;

    const p = document.createElement('p');
    p.textContent = fact.detail;

    card.appendChild(h3);
    card.appendChild(p);
    container.appendChild(card);
  }
}

function renderSymbol(symbolText) {
  const symbolEl = document.getElementById('symbolNote');
  symbolEl.textContent = symbolText || 'Land symbol (if available)';
}

function renderNotFound() {
  document.getElementById('landName').textContent = 'Land not found';
  document.getElementById('landDesc').textContent = 'We could not locate intel for this territory.';
  renderRangers([]);
  renderBingoBook([]);
  renderFacts([]);
  renderSymbol('No symbol available');

  const svg = document.getElementById('landSvg');
  if(svg) {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  }
}

function renderLand() {
  const landId = getLandId();
  // Use ACTIVE_MODEL to support edits, fallback to DEFAULT_MODEL only if missing
  const land = landId ? (ACTIVE_MODEL.lands[landId] || DEFAULT_MODEL.lands[landId]) : null;

  if (!land) {
    renderNotFound();
    return;
  }

  const landName = land.name || land.id;
  const landDesc = land.desc || '';

  document.getElementById('landName').textContent = landName;
  document.getElementById('landDesc').textContent = landDesc || 'No description available.';
  document.title = land.name || land.id;

  const rangers = normalizeRangers(landName, land.rangers);
  const ninjas = normalizeNinjas(landName, land.ninjaRisks);
  const facts = normalizeFacts(landName, land.facts, landDesc);

  renderRangers(rangers);
  renderBingoBook(ninjas);
  renderFacts(facts);
  renderSymbol(land.symbol);

  const svg = document.getElementById('landSvg');
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  if (!Array.isArray(land.points) || land.points.length === 0) {
    return;
  }

  const points = land.points
    .map(([x, y]) => [x * W / 100, y * H / 100].join(','))
    .join(' ');
  const color = land.color || '#22d3ee';

  let minX = 100;
  let maxX = 0;
  let minY = 100;
  let maxY = 0;
  for (const [x, y] of land.points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const padX = width * 0.15;
  const padY = height * 0.15;

  const vbX = Math.max(0, (minX - padX) * W / 100);
  const vbY = Math.max(0, (minY - padY) * H / 100);
  const vbW = Math.min(W, (width + 2 * padX) * W / 100);
  const vbH = Math.min(H, (height + 2 * padY) * H / 100);

  svg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);

  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('class', 'land');
  polygon.setAttribute('points', points);
  polygon.setAttribute('fill', color);
  polygon.setAttribute('fill-opacity', '0.6');
  polygon.setAttribute('stroke', color);

  svg.appendChild(polygon);
}

wireModalEvents();
renderLand();
