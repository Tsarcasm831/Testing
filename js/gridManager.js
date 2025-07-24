import { createGroundGrid, CLUSTER_SIZE } from './worldGeneration.js';

export const GRID_LABEL_VISIBILITY_DISTANCE = 7;
export const GRID_LABEL_LOD_DISTANCE = 30;
export const GRID_LABEL_LOD_STEP = 10;
export const LABEL_UPDATE_INTERVAL = 10;
/* @tweakable Set to true to link debug border visibility to grid visibility. */
const TOGGLE_DEBUG_BORDERS_WITH_GRID = true;

export class GridManager {
    constructor(scene) {
        this.scene = scene;
        this.gridHelper = null;
        this.labelUpdateCounter = 0;
    }

    create(terrain) {
        /* @tweakable The size of the grid helper. Should match the world size. */
        const gridHelperSize = CLUSTER_SIZE;
        /* @tweakable The number of divisions in the grid helper. More divisions create a finer grid. */
        const gridHelperDivisions = 400;
        const gridHelperColorCenterLine = 0xffffff;
        const gridHelperColorGrid = 0xcccccc;
        this.gridHelper = createGroundGrid(
            terrain,
            gridHelperSize,
            gridHelperDivisions,
            gridHelperColorCenterLine,
            gridHelperColorGrid
        );
        this.gridHelper.visible = false;
        const initialLabelsGroup = this.gridHelper.getObjectByName('grid-labels-group');
        if (initialLabelsGroup) {
            initialLabelsGroup.visible = false;
        }
        this.scene.add(this.gridHelper);
    }

    toggle(playerPosition) {
        if (!this.gridHelper) return;
        this.gridHelper.visible = !this.gridHelper.visible;
        const labelsGroup = this.gridHelper.getObjectByName('grid-labels-group');
        if (labelsGroup) labelsGroup.visible = this.gridHelper.visible;
        if (!this.gridHelper.visible) {
            this.gridHelper.userData.clearLabels();
        } else {
            this.gridHelper.userData.updateLabels(
                playerPosition,
                GRID_LABEL_VISIBILITY_DISTANCE,
                GRID_LABEL_LOD_DISTANCE,
                GRID_LABEL_LOD_STEP
            );
        }

        if (TOGGLE_DEBUG_BORDERS_WITH_GRID) {
            const newVisibility = this.gridHelper.visible;
            this.scene.traverse((obj) => {
                if (obj.userData.isDebugBorder) {
                    obj.visible = newVisibility;
                }
            });
        }

        this.scene.traverse((obj) => {
            if (obj.userData.isSeatLabel) {
                obj.visible = this.gridHelper.visible;
            }
        });
    }

    update(playerPosition) {
        if (!this.gridHelper || !this.gridHelper.visible) return;
        this.labelUpdateCounter++;
        if (this.labelUpdateCounter >= LABEL_UPDATE_INTERVAL) {
            this.labelUpdateCounter = 0;
            this.gridHelper.userData.updateLabels(
                playerPosition,
                GRID_LABEL_VISIBILITY_DISTANCE,
                GRID_LABEL_LOD_DISTANCE,
                GRID_LABEL_LOD_STEP
            );
        }
    }
}