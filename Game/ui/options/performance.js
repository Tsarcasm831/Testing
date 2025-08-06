import * as THREE from 'three';

export function applyPerformanceMode(ui, enabled) {
    const shadowSelect = document.getElementById('shadow-quality');
    const viewDistanceSlider = document.getElementById('view-distance');
    const viewDistanceValue = document.getElementById('view-distance-value');

    if (enabled) {
        if (!ui.prePerformanceSettings) {
            ui.prePerformanceSettings = {
                shadowQuality: shadowSelect.value,
                viewDistance: viewDistanceSlider.value
            };
        }
        applyShadowQuality(ui, 'off');
        shadowSelect.value = 'off';
        shadowSelect.disabled = true;

        const performanceViewDistance = 75;
        ui.playerControls.camera.far = performanceViewDistance;
        ui.playerControls.camera.updateProjectionMatrix();
        viewDistanceSlider.value = performanceViewDistance;
        viewDistanceSlider.disabled = true;
        viewDistanceValue.textContent = performanceViewDistance;

    } else {
        if (ui.prePerformanceSettings) {
            applyShadowQuality(ui, ui.prePerformanceSettings.shadowQuality);
            shadowSelect.value = ui.prePerformanceSettings.shadowQuality;

            const restoredViewDistance = parseInt(ui.prePerformanceSettings.viewDistance);
            ui.playerControls.camera.far = restoredViewDistance;
            ui.playerControls.camera.updateProjectionMatrix();
            viewDistanceSlider.value = restoredViewDistance;
            viewDistanceValue.textContent = restoredViewDistance;

            ui.prePerformanceSettings = null;
        }
        shadowSelect.disabled = false;
        viewDistanceSlider.disabled = false;
    }
}

export function applyShadowQuality(ui, quality) {
    if (!ui.renderer || !ui.dirLight) return;

    switch (quality) {
        case 'high':
            ui.renderer.shadowMap.enabled = true;
            ui.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            ui.dirLight.castShadow = true;
            ui.dirLight.shadow.mapSize.width = 2048;
            ui.dirLight.shadow.mapSize.height = 2048;
            /* @tweakable The blur radius for high-quality shadows. Higher values are softer but can be more performance-intensive. */
            ui.dirLight.shadow.radius = 2.0;
            /* @tweakable Shadow bias for high quality. Helps prevent shadow acne (patterning on surfaces). Adjust by small amounts if you see artifacts. */
            ui.dirLight.shadow.bias = -0.0001;
            break;
        case 'medium':
            ui.renderer.shadowMap.enabled = true;
            ui.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            ui.dirLight.castShadow = true;
            ui.dirLight.shadow.mapSize.width = 1024;
            ui.dirLight.shadow.mapSize.height = 1024;
            /* @tweakable The blur radius for medium-quality shadows. */
            ui.dirLight.shadow.radius = 1.5;
            /* @tweakable Shadow bias for medium quality. */
            ui.dirLight.shadow.bias = -0.0005;
            break;
        case 'low':
            ui.renderer.shadowMap.enabled = true;
            ui.renderer.shadowMap.type = THREE.PCFShadowMap;
            ui.dirLight.castShadow = true;
            ui.dirLight.shadow.mapSize.width = 512;
            ui.dirLight.shadow.mapSize.height = 512;
            /* @tweakable The blur radius for low-quality shadows. */
            ui.dirLight.shadow.radius = 1.0;
            /* @tweakable Shadow bias for low quality. */
            ui.dirLight.shadow.bias = -0.001;
            break;
        case 'off':
            ui.renderer.shadowMap.enabled = false;
            ui.dirLight.castShadow = false;
            break;
    }

    ui.scene.traverse(obj => {
        if (obj.material) {
            obj.material.needsUpdate = true;
        }
    });
}