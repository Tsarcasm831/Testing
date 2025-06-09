// traitUtils.js

/* @tweakable The starting number of points available for selecting traits */
const STARTING_TRAIT_POINTS = 10;

export function updateTraitPoints() {
  const traitCheckboxes = document.querySelectorAll(
    '#char-traits-list .char-sheet-checkbox-item input[type="checkbox"]'
  );
  let availablePoints = STARTING_TRAIT_POINTS;
  traitCheckboxes.forEach(cb => {
    if (cb.checked) {
      availablePoints -= parseInt(cb.dataset.cost) || 0;
      availablePoints += parseInt(cb.dataset.bonusPoints) || 0;
    }
  });
  const display = document.getElementById('trait-points-total');
  if (display) display.textContent = availablePoints;
}