export class ColorManager {
  constructor(tool) {
    this.tool = tool;
    this.active = false;
  }

  toggleColorPicker() {
    this.active = !this.active;
    document.getElementById('color-pick-button').classList.toggle('active', this.active);

    if (this.active) {
      const message = document.createElement('div');
      message.id = 'color-picker-message';
      message.textContent = 'Click on any object to copy its color';
      message.style.position = 'fixed';
      message.style.top = '100px';
      message.style.left = '50%';
      message.style.transform = 'translateX(-50%)';
      message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      message.style.color = 'white';
      message.style.padding = '10px';
      message.style.borderRadius = '5px';
      message.style.zIndex = '2000';
      document.getElementById('game-container').appendChild(message);
    } else {
      const message = document.getElementById('color-picker-message');
      if (message) message.remove();
    }
  }

  pickColorFromObject(object) {
    if (!this.tool.selectedObject) {
      this.active = false;
      document.getElementById('color-pick-button').classList.remove('active');
      const message = document.getElementById('color-picker-message');
      if (message) message.remove();
      return;
    }

    const color = object.material.color.clone();
    this.changeObjectColor(color);

    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    document.getElementById('color-r').value = r;
    document.getElementById('color-g').value = g;
    document.getElementById('color-b').value = b;
    document.getElementById('color-preview').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    this.active = false;
    document.getElementById('color-pick-button').classList.remove('active');
    const message = document.getElementById('color-picker-message');
    if (message) message.remove();
  }

  changeObjectColor(color) {
    if (!this.tool.selectedObject) return;

    if (!this.tool.selectedObject.userData.originalMaterial) {
      this.tool.selectedObject.userData.originalMaterial = this.tool.selectedObject.material.clone();
    }

    const newMaterial = this.tool.selectedObject.material.clone();
    newMaterial.color.copy(color);
    this.tool.selectedObject.material = newMaterial;

    if (this.tool.room) {
      const colorData = {
        type: 'color_object',
        objectId: this.tool.selectedObject.userData.id,
        color: {
          r: color.r,
          g: color.g,
          b: color.b
        }
      };

      this.tool.room.send(colorData);

      if (this.tool.room.roomState.buildObjects && this.tool.selectedObject.userData.id) {
        const updatedBuildObjects = { ...(this.tool.room.roomState.buildObjects) };
        if (updatedBuildObjects[this.tool.selectedObject.userData.id]) {
          updatedBuildObjects[this.tool.selectedObject.userData.id] = {
            ...updatedBuildObjects[this.tool.selectedObject.userData.id],
            color: { r: color.r, g: color.g, b: color.b }
          };
          this.tool.room.updateRoomState({ buildObjects: updatedBuildObjects });
        }
      }
    }
  }

  receiveObjectColor(colorData) {
    if (!colorData || !colorData.objectId) return;

    const object = [...this.tool.buildTool.buildObjects, ...this.tool.advancedBuildObjects].find(
      obj => obj.userData.id === colorData.objectId
    );

    if (object) {
      const newMaterial = object.material.clone();
      newMaterial.color.setRGB(
        colorData.color.r,
        colorData.color.g,
        colorData.color.b
      );
      object.material = newMaterial;
    }
  }

  updateColorPreview() {
    const r = document.getElementById('color-r').value;
    const g = document.getElementById('color-g').value;
    const b = document.getElementById('color-b').value;
    document.getElementById('color-preview').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }
}
