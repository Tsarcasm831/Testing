import { settings, DEFAULTS } from './settings.js';

export function initSettingsUI() {
    const renderDistanceSlider = document.getElementById('render-distance-slider');
    const renderDistanceValue = document.getElementById('render-distance-value');
    const shadowQualitySelect = document.getElementById('shadow-quality-select');
    const grassDensitySlider = document.getElementById('grass-density-slider');
    const grassDensityValue = document.getElementById('grass-density-value');
    const rockDensitySlider = document.getElementById('rock-density-slider');
    const rockDensityValue = document.getElementById('rock-density-value');
    const scatterRockDensitySlider = document.getElementById('scatter-rock-density-slider');
    const scatterRockDensityValue = document.getElementById('scatter-rock-density-value');
    const treeDensitySlider = document.getElementById('tree-density-slider');
    const treeDensityValue = document.getElementById('tree-density-value');
    const mouseSensitivitySlider = document.getElementById('mouse-sensitivity-slider');
    const mouseSensitivityValue = document.getElementById('mouse-sensitivity-value');
    const sprintSpeedSlider = document.getElementById('sprint-speed-slider');
    const sprintSpeedValue = document.getElementById('sprint-speed-value');
    const biomeFogToggle = document.getElementById('biome-fog-toggle');

    // Adjust ranges for mobile
    if (settings.isMobile) {
        renderDistanceSlider.max = 10;
        grassDensitySlider.max = 0.5;
        rockDensitySlider.max = 0.02;
        scatterRockDensitySlider.max = 0.04;
        treeDensitySlider.max = 0.008;
    }

    // ---- Initialize UI with current settings ----
    const currentRenderDistance = settings.get('renderDistance') ?? DEFAULTS.renderDistance;
    renderDistanceSlider.value = currentRenderDistance;
    renderDistanceValue.textContent = currentRenderDistance;

    shadowQualitySelect.value = settings.get('shadowQuality') ?? DEFAULTS.shadowQuality;

    const currentGrassDensity = settings.get('grassDensity') ?? DEFAULTS.grassDensity;
    grassDensitySlider.value = currentGrassDensity;
    grassDensityValue.textContent = currentGrassDensity;

    const currentRockDensity = settings.get('rockDensity') ?? DEFAULTS.rockDensity;
    rockDensitySlider.value = currentRockDensity;
    rockDensityValue.textContent = Number(currentRockDensity).toFixed(3);

    const currentScatterRockDensity = settings.get('scatterRockDensity') ?? DEFAULTS.scatterRockDensity;
    scatterRockDensitySlider.value = currentScatterRockDensity;
    scatterRockDensityValue.textContent = Number(currentScatterRockDensity).toFixed(3);

    const currentTreeDensity = settings.get('treeDensity') ?? DEFAULTS.treeDensity;
    treeDensitySlider.value = currentTreeDensity;
    treeDensityValue.textContent = Number(currentTreeDensity).toFixed(4);

    const currentMouseSensitivity = settings.get('mouseSensitivity') ?? DEFAULTS.mouseSensitivity;
    mouseSensitivitySlider.value = currentMouseSensitivity;
    mouseSensitivityValue.textContent = Number(currentMouseSensitivity).toFixed(1);

    const currentSprintSpeed = settings.get('sprintSpeed') ?? DEFAULTS.sprintSpeed;
    sprintSpeedSlider.value = currentSprintSpeed;
    sprintSpeedValue.textContent = Number(currentSprintSpeed).toFixed(1);

    biomeFogToggle.checked = settings.get('biomeFog') ?? DEFAULTS.biomeFog;

    // ---- Add event listeners ----
    renderDistanceSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        settings.set('renderDistance', value);
        renderDistanceValue.textContent = value;
    });

    shadowQualitySelect.addEventListener('change', (e) => {
        settings.set('shadowQuality', e.target.value);
    });
    
    grassDensitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        settings.set('grassDensity', value);
        grassDensityValue.textContent = value;
    });

    rockDensitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        settings.set('rockDensity', value);
        rockDensityValue.textContent = Number(value).toFixed(3);
    });
    
    scatterRockDensitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        settings.set('scatterRockDensity', value);
        scatterRockDensityValue.textContent = Number(value).toFixed(3);
    });

    treeDensitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        settings.set('treeDensity', value);
        treeDensityValue.textContent = Number(value).toFixed(4);
    });

    mouseSensitivitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        settings.set('mouseSensitivity', value);
        mouseSensitivityValue.textContent = Number(value).toFixed(1);
    });

    sprintSpeedSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        settings.set('sprintSpeed', value);
        sprintSpeedValue.textContent = Number(value).toFixed(1);
    });

    biomeFogToggle.addEventListener('change', (e) => {
        settings.set('biomeFog', e.target.checked);
    });
}