import * as THREE from "three";

export class NPCRenderer {
  static createModel(position, npcData) {
    const npcGroup = new THREE.Group();
    
    // Apply height scaling if provided
    const heightScale = npcData.height || 1.0;
    
    // Apply body type variations
    const bodyType = npcData.bodyType || "average";
    let bodyWidth = 0.6 * 0.7;
    let bodyDepth = 0.3 * 0.7;
    
    if (bodyType === "thin") {
      bodyWidth *= 0.8;
      bodyDepth *= 0.8;
    } else if (bodyType === "stout") {
      bodyWidth *= 1.3;
      bodyDepth *= 1.3;
    }
    
    // Body with NPC's color
    const bodyGeometry = new THREE.BoxGeometry(bodyWidth, 1.8 * 0.7 * heightScale, bodyDepth);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: npcData.color });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.3 * 0.7 * heightScale;
    body.castShadow = true;
    npcGroup.add(body);
    
    // Head with different shapes based on headShape property
    const headShape = npcData.headShape || "square";
    let headGeometry;
    
    if (headShape === "round") {
      headGeometry = new THREE.SphereGeometry(0.4 * 0.7, 12, 12);
    } else if (headShape === "triangular") {
      headGeometry = new THREE.ConeGeometry(0.4 * 0.7, 0.8 * 0.7, 4);
      // Rotate to point upward
      headGeometry.rotateX(Math.PI);
    } else {
      // Default square head
      headGeometry = new THREE.BoxGeometry(0.7 * 0.7, 0.7 * 0.7, 0.7 * 0.7);
    }
    
    const headMaterial = new THREE.MeshStandardMaterial({ color: npcData.color });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = (2.1 * 0.7) * heightScale;
    head.castShadow = true;
    npcGroup.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08 * 0.7, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eyePupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2 * 0.7, 2.1 * 0.7 * heightScale, 0.35 * 0.7);
    npcGroup.add(leftEye);
    
    // Left pupil
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04 * 0.7, 8, 8), eyePupilMaterial);
    leftPupil.position.z = 0.05 * 0.7;
    leftEye.add(leftPupil);
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2 * 0.7, 2.1 * 0.7 * heightScale, 0.35 * 0.7);
    npcGroup.add(rightEye);
    
    // Right pupil
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04 * 0.7, 8, 8), eyePupilMaterial);
    rightPupil.position.z = 0.05 * 0.7;
    rightEye.add(rightPupil);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.2 * 0.7, 0.7 * 0.7 * heightScale, 0.2 * 0.7);
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(npcData.color).multiplyScalar(0.8) 
    });
    
    // Left leg
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2 * 0.7, 0.6 * 0.7 * heightScale, 0);
    leftLeg.geometry.translate(0, -0.25 * 0.7 * heightScale, 0);
    leftLeg.name = "leftLeg";
    npcGroup.add(leftLeg);
    
    // Right leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2 * 0.7, 0.6 * 0.7 * heightScale, 0);
    rightLeg.geometry.translate(0, -0.25 * 0.7 * heightScale, 0);
    rightLeg.name = "rightLeg";
    npcGroup.add(rightLeg);
    
    // Add custom features like hats, accessories, etc.
    if (npcData.features && Array.isArray(npcData.features)) {
      npcData.features.forEach(feature => {
        if (feature.type === "hat") {
          NPCRenderer.addHat(npcGroup, feature, heightScale);
        } else if (feature.type === "accessory") {
          NPCRenderer.addAccessory(npcGroup, feature, heightScale);
        } else if (feature.type === "clothing") {
          NPCRenderer.addClothing(npcGroup, feature, heightScale);
        }
      });
    }
    
    // Position the NPC
    npcGroup.position.copy(position);
    
    // Add userData for interaction
    npcGroup.userData.isNPC = true;
    npcGroup.userData.npcData = npcData;
    
    return npcGroup;
  }
  
  // Method to add a hat
  static addHat(npcGroup, feature, heightScale) {
    const hatColor = feature.color || 0x333333;
    let hatGeometry;
    const description = feature.description || "";
    
    if (description.includes("top hat") || description.includes("tall")) {
      // Top hat
      hatGeometry = new THREE.CylinderGeometry(0.25 * 0.7, 0.25 * 0.7, 0.4 * 0.7, 16);
      const hat = new THREE.Mesh(hatGeometry, new THREE.MeshStandardMaterial({ color: hatColor }));
      hat.position.y = 2.5 * 0.7 * heightScale;
      hat.castShadow = true;
      npcGroup.add(hat);
      
      // Top hat brim
      const brimGeometry = new THREE.CylinderGeometry(0.35 * 0.7, 0.35 * 0.7, 0.05 * 0.7, 16);
      const brim = new THREE.Mesh(brimGeometry, new THREE.MeshStandardMaterial({ color: hatColor }));
      brim.position.y = 2.3 * 0.7 * heightScale;
      brim.castShadow = true;
      npcGroup.add(brim);
    } else if (description.includes("cap") || description.includes("baseball")) {
      // Baseball cap
      hatGeometry = new THREE.SphereGeometry(0.35 * 0.7, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const hat = new THREE.Mesh(hatGeometry, new THREE.MeshStandardMaterial({ color: hatColor }));
      hat.position.y = 2.45 * 0.7 * heightScale;
      hat.castShadow = true;
      npcGroup.add(hat);
      
      // Visor
      const visorGeometry = new THREE.BoxGeometry(0.5 * 0.7, 0.05 * 0.7, 0.25 * 0.7);
      const visor = new THREE.Mesh(visorGeometry, new THREE.MeshStandardMaterial({ color: hatColor }));
      visor.position.set(0, 2.35 * 0.7 * heightScale, 0.25 * 0.7);
      visor.castShadow = true;
      npcGroup.add(visor);
    } else if (description.includes("cowboy") || description.includes("western")) {
      // Cowboy hat
      hatGeometry = new THREE.ConeGeometry(0.4 * 0.7, 0.25 * 0.7, 16);
      const hat = new THREE.Mesh(hatGeometry, new THREE.MeshStandardMaterial({ color: hatColor }));
      hat.position.y = 2.45 * 0.7 * heightScale;
      hat.scale.set(1, 0.5, 1.2);  // Flatten the cone
      hat.castShadow = true;
      npcGroup.add(hat);
      
      // Hat brim
      const brimGeometry = new THREE.CylinderGeometry(0.6 * 0.7, 0.6 * 0.7, 0.05 * 0.7, 16);
      const brim = new THREE.Mesh(brimGeometry, new THREE.MeshStandardMaterial({ color: hatColor }));
      brim.position.y = 2.3 * 0.7 * heightScale;
      brim.castShadow = true;
      npcGroup.add(brim);
    } else {
      // Generic hat
      hatGeometry = new THREE.BoxGeometry(0.8 * 0.7, 0.2 * 0.7, 0.8 * 0.7);
      const hat = new THREE.Mesh(hatGeometry, new THREE.MeshStandardMaterial({ color: hatColor }));
      hat.position.y = 2.5 * 0.7 * heightScale;
      hat.castShadow = true;
      npcGroup.add(hat);
    }
  }
  
  // Method to add accessories (glasses, beard, etc.)
  static addAccessory(npcGroup, feature, heightScale) {
    const accessoryColor = feature.color || 0x333333;
    const description = feature.description || "";
    
    if (description.includes("glasses") || description.includes("spectacles")) {
      // Glasses
      const frameGeometry = new THREE.TorusGeometry(0.12 * 0.7, 0.02 * 0.7, 8, 16, Math.PI);
      const frameMaterial = new THREE.MeshStandardMaterial({ color: accessoryColor });
      
      // Left lens
      const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
      leftFrame.position.set(-0.2 * 0.7, 2.1 * 0.7 * heightScale, 0.35 * 0.7);
      leftFrame.rotation.y = Math.PI / 2;
      npcGroup.add(leftFrame);
      
      // Right lens
      const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
      rightFrame.position.set(0.2 * 0.7, 2.1 * 0.7 * heightScale, 0.35 * 0.7);
      rightFrame.rotation.y = Math.PI / 2;
      npcGroup.add(rightFrame);
      
      // Bridge
      const bridgeGeometry = new THREE.BoxGeometry(0.4 * 0.7, 0.02 * 0.7, 0.02 * 0.7);
      const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
      bridge.position.set(0, 2.1 * 0.7 * heightScale, 0.35 * 0.7);
      npcGroup.add(bridge);
    } else if (description.includes("beard") || description.includes("mustache")) {
      // Beard/Mustache
      const beardMaterial = new THREE.MeshStandardMaterial({ color: accessoryColor });
      
      if (description.includes("beard")) {
        const beardGeometry = new THREE.BoxGeometry(0.5 * 0.7, 0.3 * 0.7, 0.2 * 0.7);
        const beard = new THREE.Mesh(beardGeometry, beardMaterial);
        beard.position.set(0, 1.8 * 0.7 * heightScale, 0.4 * 0.7);
        npcGroup.add(beard);
      }
      
      if (description.includes("mustache")) {
        const mustacheGeometry = new THREE.BoxGeometry(0.4 * 0.7, 0.05 * 0.7, 0.1 * 0.7);
        const mustache = new THREE.Mesh(mustacheGeometry, beardMaterial);
        mustache.position.set(0, 2.0 * 0.7 * heightScale, 0.4 * 0.7);
        npcGroup.add(mustache);
      }
    } else if (description.includes("crown") || description.includes("royal")) {
      // Crown
      const crownBaseGeometry = new THREE.CylinderGeometry(0.3 * 0.7, 0.35 * 0.7, 0.15 * 0.7, 8);
      const crownBase = new THREE.Mesh(crownBaseGeometry, new THREE.MeshStandardMaterial({ color: accessoryColor }));
      crownBase.position.y = 2.45 * 0.7 * heightScale;
      crownBase.castShadow = true;
      npcGroup.add(crownBase);
      
      // Crown spikes
      for (let i = 0; i < 4; i++) {
        const spikeGeometry = new THREE.ConeGeometry(0.05 * 0.7, 0.15 * 0.7, 4);
        const spike = new THREE.Mesh(spikeGeometry, new THREE.MeshStandardMaterial({ color: accessoryColor }));
        const angle = (i / 4) * Math.PI * 2;
        spike.position.set(
          Math.cos(angle) * 0.2 * 0.7,
          2.6 * 0.7 * heightScale,
          Math.sin(angle) * 0.2 * 0.7
        );
        spike.castShadow = true;
        npcGroup.add(spike);
      }
    }
  }
  
  // Method to add clothing
  static addClothing(npcGroup, feature, heightScale) {
    const clothingColor = feature.color || 0x444444;
    const description = feature.description || "";
    
    if (description.includes("cape") || description.includes("cloak")) {
      // Cape
      const capeGeometry = new THREE.BoxGeometry(0.7 * 0.7, 1.2 * 0.7 * heightScale, 0.1 * 0.7);
      const cape = new THREE.Mesh(capeGeometry, new THREE.MeshStandardMaterial({ color: clothingColor }));
      cape.position.set(0, 1.4 * 0.7 * heightScale, -0.2 * 0.7);
      cape.castShadow = true;
      npcGroup.add(cape);
    } else if (description.includes("armor") || description.includes("knight")) {
      // Armor chest plate
      const armorGeometry = new THREE.BoxGeometry(0.7 * 0.7, 0.9 * 0.7 * heightScale, 0.4 * 0.7);
      const armor = new THREE.Mesh(armorGeometry, new THREE.MeshStandardMaterial({ 
        color: clothingColor,
        metalness: 0.7,
        roughness: 0.3
      }));
      armor.position.y = 1.3 * 0.7 * heightScale;
      armor.castShadow = true;
      npcGroup.add(armor);
      
      // Shoulder pads
      const leftShoulderGeometry = new THREE.SphereGeometry(0.2 * 0.7, 8, 8);
      const leftShoulder = new THREE.Mesh(leftShoulderGeometry, new THREE.MeshStandardMaterial({ 
        color: clothingColor,
        metalness: 0.7,
        roughness: 0.3
      }));
      leftShoulder.position.set(-0.4 * 0.7, 1.7 * 0.7 * heightScale, 0);
      leftShoulder.castShadow = true;
      npcGroup.add(leftShoulder);
      
      const rightShoulderGeometry = new THREE.SphereGeometry(0.2 * 0.7, 8, 8);
      const rightShoulder = new THREE.Mesh(rightShoulderGeometry, new THREE.MeshStandardMaterial({ 
        color: clothingColor,
        metalness: 0.7,
        roughness: 0.3
      }));
      rightShoulder.position.set(0.4 * 0.7, 1.7 * 0.7 * heightScale, 0);
      rightShoulder.castShadow = true;
      npcGroup.add(rightShoulder);
    } else if (description.includes("tie") || description.includes("formal")) {
      // Tie
      const tieGeometry = new THREE.BoxGeometry(0.1 * 0.7, 0.5 * 0.7 * heightScale, 0.05 * 0.7);
      const tie = new THREE.Mesh(tieGeometry, new THREE.MeshStandardMaterial({ color: clothingColor }));
      tie.position.set(0, 1.4 * 0.7 * heightScale, 0.18 * 0.7);
      tie.castShadow = true;
      npcGroup.add(tie);
      
      // Jacket lapels
      const leftLapelGeometry = new THREE.BoxGeometry(0.2 * 0.7, 0.5 * 0.7 * heightScale, 0.05 * 0.7);
      const leftLapel = new THREE.Mesh(leftLapelGeometry, new THREE.MeshStandardMaterial({ color: 0x222222 }));
      leftLapel.position.set(-0.2 * 0.7, 1.4 * 0.7 * heightScale, 0.18 * 0.7);
      leftLapel.castShadow = true;
      npcGroup.add(leftLapel);
      
      const rightLapelGeometry = new THREE.BoxGeometry(0.2 * 0.7, 0.5 * 0.7 * heightScale, 0.05 * 0.7);
      const rightLapel = new THREE.Mesh(rightLapelGeometry, new THREE.MeshStandardMaterial({ color: 0x222222 }));
      rightLapel.position.set(0.2 * 0.7, 1.4 * 0.7 * heightScale, 0.18 * 0.7);
      rightLapel.castShadow = true;
      npcGroup.add(rightLapel);
    }
  }
}