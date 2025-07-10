import * as THREE from 'three';

/**
 * Simple NPC with a dialogue tree.
 */
class NPC {
  constructor(position) {
    this.position = position.clone();
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    this.mesh.position.copy(this.position);
    this.dialogueTree = {
      greeting: { text: 'Hello, adventurer!', options: [{ text: 'Quest?', next: 'quest' }] },
      quest: { text: 'Find me 5 logs.', options: [{ text: 'Accept', next: null }] },
    };
    this.currentDialogue = 'greeting';
  }

  /**
   * Returns the current dialogue node.
   */
  interact() {
    return this.dialogueTree[this.currentDialogue];
  }

  update() {
    // Placeholder for wandering behavior
  }
}

export default NPC;
