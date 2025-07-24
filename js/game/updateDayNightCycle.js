import * as THREE from 'three';

export function updateDayNightCycle(game) {
    if (!game.sky || !game.dirLight) return;

    const now = new Date();
    const denverNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
    const hours = denverNow.getHours() + denverNow.getMinutes() / 60;
    const angle = ((hours - 6) / 24) * 2 * Math.PI;
    const elevation = Math.sin(angle) * 90;
    const azimuth = (hours / 24) * 360;

    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);
    game.sun.setFromSphericalCoords(1, phi, theta);

    game.sky.material.uniforms['sunPosition'].value.copy(game.sun);

    const lightFactor = Math.max(0, Math.sin(angle));
    game.dirLight.intensity = lightFactor * 3;
    if (game.ambientLight) {
        game.ambientLight.intensity = 0.2 + lightFactor * 0.3;
    }
}
