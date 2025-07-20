import { initSettingsUI } from './settings-ui.js';
import { onlinePlayersUI } from './online-players-ui.js';
import { mapRenderer } from './map-renderer.js';

export class UIManager {
    constructor(playerControls) {
        this.playerControls = playerControls;
        this.isMobile = playerControls.isMobile;
        
        this.blocker = document.getElementById('blocker');
        this.instructions = document.getElementById('instructions');
        this.settingsModal = document.getElementById('settings-modal');
        this.onlinePlayersScreen = document.getElementById('online-players-screen');
        this.mapModal = document.getElementById('map-modal');
        
        this.settingsOpen = false;
        this.onlinePlayersOpen = false;
        this.mapOpen = false;
        
        this.initEventListeners();
        initSettingsUI();
    }

    setOnlinePlayersUI(ui) {
        this.onlinePlayersUI = ui;
    }

    isGameActive() {
        return this.blocker.style.display === 'none';
    }

    isSettingsOpen() {
        return this.settingsOpen;
    }

    isOnlinePlayersOpen() {
        return this.onlinePlayersOpen;
    }

    isMapOpen() {
        return this.mapOpen;
    }

    showBlocker() {
        this.blocker.style.display = 'flex';
        this.instructions.style.display = 'flex';
        this.settingsModal.style.display = 'none';
        this.onlinePlayersScreen.style.display = 'none';
        this.mapModal.style.display = 'none';
    }

    initEventListeners() {
        const closeSettingsButton = document.getElementById('close-settings-button');
        const closeOnlinePlayersButton = document.getElementById('close-online-players-button');
        const closeMapButton = document.getElementById('close-map-button');

        const lockControls = () => {
             if (this.isMobile) {
                this.blocker.style.display = 'none';
                this.settingsOpen = false;
                if (this.onlinePlayersUI) {
                    this.onlinePlayersUI.hide();
                    this.onlinePlayersOpen = false;
                }
                if (mapRenderer) {
                    mapRenderer.hide();
                    this.mapOpen = false;
                }
            } else {
                this.playerControls.controls.lock();
            }
        };

        const onFirstInteraction = (event) => {
            event.preventDefault(); // Important for touch events
            if (this.playerControls.playerAudio) {
                this.playerControls.playerAudio.resumeContext();
                this.playerControls.playerAudio.playWindSound();
            }
            lockControls();
            this.instructions.removeEventListener('click', onFirstInteraction);
            this.instructions.removeEventListener('touchstart', onFirstInteraction);
            
            // Re-add listeners for subsequent interactions (mainly for desktop)
            this.instructions.addEventListener('click', lockControls);
            if(this.isMobile) {
                this.instructions.addEventListener('touchstart', lockControls);
            }
        };
        
        this.instructions.addEventListener('click', onFirstInteraction);
        if (this.isMobile) {
            this.instructions.addEventListener('touchstart', onFirstInteraction);
        }
        
        closeSettingsButton.addEventListener('click', () => this.toggleSettings(false));
        closeOnlinePlayersButton.addEventListener('click', () => this.toggleOnlinePlayers(false));
        closeMapButton.addEventListener('click', () => this.toggleMap(false));

        if (!this.isMobile) {
            this.playerControls.controls.addEventListener('lock', () => {
                this.instructions.style.display = 'none';
                this.blocker.style.display = 'none';
                this.settingsModal.style.display = 'none';
                this.settingsOpen = false;
                if (this.onlinePlayersUI) {
                    this.onlinePlayersUI.hide();
                    this.onlinePlayersOpen = false;
                }
                if (mapRenderer) {
                    mapRenderer.hide();
                    this.mapOpen = false;
                }
            });

            this.playerControls.controls.addEventListener('unlock', () => {
                this.blocker.style.display = 'flex';
                this.instructions.style.display = 'none';
                
                this.settingsModal.style.display = this.settingsOpen ? 'flex' : 'none';

                if (this.onlinePlayersUI) {
                    if (this.onlinePlayersOpen) this.onlinePlayersUI.show();
                    else this.onlinePlayersUI.hide();
                }
                
                if (mapRenderer) {
                    if (this.mapOpen) mapRenderer.show();
                    else mapRenderer.hide();
                }

                if (!this.settingsOpen && !this.onlinePlayersOpen && !this.mapOpen) {
                    this.instructions.style.display = 'flex';
                }
            });
        }
    }

    toggleSettings(forceState) {
        const shouldBeOpen = forceState !== undefined ? forceState : !this.settingsOpen;

        if (shouldBeOpen) {
            this.settingsOpen = true;
            this.onlinePlayersOpen = false;
            this.mapOpen = false;

            if(this.isMobile) {
                this.blocker.style.display = 'flex';
                this.settingsModal.style.display = 'flex';
                this.instructions.style.display = 'none';
                if (this.onlinePlayersUI) this.onlinePlayersUI.hide();
                if (mapRenderer) mapRenderer.hide();
            } else {
                this.playerControls.controls.unlock();
            }
        } else {
            this.settingsOpen = false;
            if (this.isMobile) {
                this.settingsModal.style.display = 'none';
                if (!this.onlinePlayersOpen && !this.mapOpen) {
                    this.blocker.style.display = 'none';
                }
            } else {
                 this.playerControls.controls.lock();
            }
        }
    }

    toggleOnlinePlayers(forceState) {
        if (!this.onlinePlayersUI) return;
        
        const shouldBeOpen = forceState !== undefined ? forceState : !this.onlinePlayersOpen;

        if (shouldBeOpen) {
            this.onlinePlayersOpen = true;
            this.settingsOpen = false;
            this.mapOpen = false;

            if (this.isMobile) {
                 this.blocker.style.display = 'flex';
                 this.onlinePlayersUI.show();
                 this.instructions.style.display = 'none';
                 this.settingsModal.style.display = 'none';
                 if (mapRenderer) mapRenderer.hide();
            } else {
                 this.playerControls.controls.unlock();
            }
        } else {
            this.onlinePlayersOpen = false;
            if (this.isMobile) {
                this.onlinePlayersUI.hide();
                if (!this.settingsOpen && !this.mapOpen) {
                     this.blocker.style.display = 'none';
                }
            } else {
                 if(!this.settingsOpen && !this.mapOpen) this.playerControls.controls.lock();
            }
        }
    }

    toggleMap(forceState) {
        if (!mapRenderer) return;
        const shouldBeOpen = forceState !== undefined ? forceState : !this.mapOpen;

        if (shouldBeOpen) {
            this.mapOpen = true;
            this.settingsOpen = false;
            this.onlinePlayersOpen = false;

            if (this.isMobile) {
                this.blocker.style.display = 'flex';
                this.instructions.style.display = 'none';
                this.settingsModal.style.display = 'none';
                if (this.onlinePlayersUI) this.onlinePlayersUI.hide();
                mapRenderer.show();
            } else {
                this.playerControls.controls.unlock();
            }
        } else {
            this.mapOpen = false;
            if (this.isMobile) {
                mapRenderer.hide();
                if (!this.settingsOpen && !this.onlinePlayersOpen) {
                    this.blocker.style.display = 'none';
                }
            } else {
                if (!this.settingsOpen && !this.onlinePlayersOpen) this.playerControls.controls.lock();
            }
        }
    }
}