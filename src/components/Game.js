import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import WorldScene from '../scenes/WorldScene';
import HealthBar from './HUD/HealthBar';
import Tooltip from './Tooltip';
import Raycaster from '../utils/raycaster';
import AudioManager from '../utils/audioManager';
import BuildMenu from './HUD/BuildMenu';
import NPC from '../entities/NPC';

const Game = () => {
  const [tooltip, setTooltip] = useState({ text: '', position: { x: 0, y: 0 } });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const worldScene = new WorldScene(scene);
    const raycaster = new Raycaster(camera, scene);
    const audioManager = new AudioManager();
    audioManager.loadSound('interact', 'assets/sounds/interact.wav');

    const handleClick = (e) => {
      const obj = raycaster.getIntersectingObject(e, scene.children);
      if (obj?.userData?.entity) {
        audioManager.playSpatialSound('interact', obj.position);
        if (obj.userData.entity instanceof NPC) {
          setTooltip({ text: obj.userData.entity.interact().text, position: { x: e.clientX, y: e.clientY } });
        }
      }
    };
    window.addEventListener('click', handleClick);

    const animate = (time) => {
      requestAnimationFrame(animate);
      const delta = time * 0.001;
      worldScene.update(delta);
      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      window.removeEventListener('click', handleClick);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      <HealthBar health={100} />
      <Tooltip text={tooltip.text} position={tooltip.position} />
      <BuildMenu onPlaceEntity={() => {}} />
    </div>
  );
};

export default Game;
