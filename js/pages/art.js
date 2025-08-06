import { app } from "../app.js";
(function(ns) {
    'use strict';

    ns.pages = ns.pages || {};

    let artPageKeydownHandler = null;
    let numpadSequence = [];

    function cleanupArtPage() {
        if (artPageKeydownHandler) {
            document.removeEventListener('keydown', artPageKeydownHandler);
            artPageKeydownHandler = null;
        }
    }

    function runTextScrambleAnimation(contentEl, lines, finalHtml) {
        const datastreamEffect = contentEl.querySelector('.datastream-effect');
        const finalContent = contentEl.querySelector('.final-content');
        if (!datastreamEffect || !finalContent) return;

        const lineElements = Array.from(datastreamEffect.querySelectorAll('p'));
        const effects = lineElements.map(el => new ns.ui.TextScramble(el));

        const runAnimation = async () => {
            let i = 0;
            for (const fx of effects) {
                if (lines[i]) await fx.setText(lines[i]);
                await new Promise(resolve => setTimeout(resolve, 500));
                i++;
            }
            await new Promise(resolve => setTimeout(resolve, 1500));
            datastreamEffect.style.transition = 'opacity 1s';
            datastreamEffect.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 1000));
            datastreamEffect.classList.add('hidden');
            finalContent.innerHTML = finalHtml;
            finalContent.classList.remove('hidden');
            finalContent.style.opacity = '0';
            finalContent.style.transition = 'opacity 0.5s';
            finalContent.style.opacity = '1';
        };

        lineElements.forEach(el => el.textContent = '');
        setTimeout(runAnimation, 500);
    }

    function initArtPage() {
        const artContent = document.querySelector('#art-content');
        if (artContent) {
            const finalHtml = `
            <div class="art-error-container">
                <p class="error-message">[// VISUAL ARCHIVE CORRUPTED //]</p>
                <div class="error-log">
                    <p><span class="log-prefix">&gt; SYS_STATUS:</span> <span class="log-status-fail">FAILURE</span></p>
                    <p><span class="log-prefix">&gt; ERROR_CODE:</span> 7F-NO_SIGNAL</p>
                    <p><span class="log-prefix">&gt; ATTEMPTING_RECOVERY:</span> false</p>
                    <p class="blinking-cursor"><span class="log-prefix">&gt; ANALYSIS:</span> The data stream containing visual artifacts has been lost. It may have been a casualty of a solar flare, a rogue AI's digital tantrum, or perhaps the artist simply decided the void was more aesthetically pleasing today.</p>
                </div>
                <p class="witticism">"Consider this a minimalist exhibition. Title: 'The Emptiness We All Feel Sometimes'."</p>
            </div>`;
            runTextScrambleAnimation(artContent, ['SIGNAL INTERRUPTED...', 'ATTEMPTING RECONNECTION...', 'CONNECTION FAILED: NO DATA FOUND'], finalHtml);
        }

        cleanupArtPage();
        numpadSequence = [];
        artPageKeydownHandler = (e) => {
            if (e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
                if (e.key === '1' || e.key === '7') {
                    numpadSequence.push(e.key);
                    if (numpadSequence.length > 2) {
                        numpadSequence.shift();
                    }
                    if (numpadSequence.join('') === '17') {
                        ns.state.shopUnlocked = true;
                        ns.ui.showShopTab();
                        ns.router.loadPage('shop');
                    }
                } else {
                    numpadSequence = [];
                }
            }
        };
        document.addEventListener('keydown', artPageKeydownHandler);

        ns.ui.setupTooltipAnimation();
    }

    Object.assign(ns.pages, {
        initArtPage,
        cleanupArtPage
    });
}(app));