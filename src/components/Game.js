import React, { useEffect } from 'react';
import * as THREE from 'three';
import WorldScene from '../scenes/WorldScene';
import HealthBar from './HUD/HealthBar';
import Tooltip from './Tooltip';

const Game = () => {
  useEffect(() => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Initialize world scene
    const worldScene = new WorldScene(scene);

    // Game loop
    const animate = () => {
      requestAnimationFrame(animate);
      worldScene.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      <HealthBar health={100} />
      <Tooltip text="" position={{ x: 0, y: 0 }} />
    </div>
  );
};

export default Game;
