import { app } from "./app.js";
(function(ns) {
    'use strict';
    
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
            finalContent.style.transition = 'opacity 0.5s';
            finalContent.style.opacity = '1';
        };

        lineElements.forEach(el => el.textContent = '');
        setTimeout(runAnimation, 500);
    }
    
    function initAboutPage() {
        const aboutContent = document.querySelector('#about-content');
        if (!aboutContent) return;
        const datastreamEffect = aboutContent.querySelector('.datastream-effect');
        const finalContent = aboutContent.querySelector('.final-content');
        if (!datastreamEffect || !finalContent) return;
        const bioHtml = `<div id="dossier-container">...</div>`; // Abridged for brevity
        const bioHtmlFull = `
        <div id="dossier-container">
            <div class="dossier-section" id="identity-assessment">
                <h3 class="section-title"><span>//</span> IDENTITY ASSESSMENT</h3>
                <div class="dossier-grid">
                    <div class="dossier-item"><span class="dossier-label">Primary Alias</span><span class="dossier-value">Lord Tsarcasm</span></div>
                    <div class="dossier-item"><span class="dossier-label">Legal Name</span><span class="dossier-value redacted">[REDACTED]</span></div>
                    <div class="dossier-item full-width"><span class="dossier-label">Psych Profile</span><span class="dossier-value">INFJ (The Architect / The Agitator). A high-empathy core shielded by an analytical, critical shell. Prone to existential spirals and sudden bursts of creation.</span></div>
                    <div class="dossier-item full-width" data-log-item><span class="dossier-label">Personal Log</span><span class="dossier-value" id="personal-log-value"></span></div>
                </div>
            </div>
            <div class="dossier-section" id="operational-directives">
                <h3 class="section-title"><span>//</span> OPERATIONAL DIRECTIVES</h3>
                <div class="dossier-grid">
                    <div class="dossier-item"><span class="dossier-label">Primary Function</span><span class="dossier-value">Narrative Weaver. Building worlds from code, chaos, and caffeine.</span></div>
                    <div class="dossier-item"><span class="dossier-label">Secondary Function</span><span class="dossier-value">Sonic Alchemist. Transmuting noise into anthems for the digital ghost.</span></div>
                    <div class="dossier-item"><span class="dossier-label">Tertiary Function</span><span class="dossier-value">Community Conduit. Forging connections in the static between worlds.</span></div>
                </div>
            </div>
            <div class="dossier-section" id="core-matrix">
                <h3 class="section-title"><span>//</span> CORE MATRIX (INFLUENCES)</h3>
                <div class="dossier-grid">
                    <div class="dossier-item"><span class="dossier-label">Sonic Imprints</span><span class="dossier-value"><ul><li>Heavy Metal</li><li>Industrial</li><li>Cinematic Scores</li></ul></span></div>
                    <div class="dossier-item"><span class="dossier-label">Literary/Visual Schema</span><span class="dossier-value"><ul><li>Dark Fantasy & Cyberpunk</li><li>Dystopian Cinema</li><li>Anime (e.g., *Naruto*)</li></ul></span></div>
                </div>
            </div>
            <div class="dossier-section" id="status-anomalies">
                <h3 class="section-title"><span>//</span> STATUS & ANOMALIES</h3>
                <div class="dossier-grid">
                     <div class="dossier-item"><span class="dossier-label">Current State</span><span class="dossier-value">Stable, but fluctuating between focused output and system introspection.</span></div>
                    <div class="dossier-item"><span class="dossier-label">Known Anomaly</span><span class="dossier-value">'Resting Bitch Face' (RBF) protocol is a passive default. Not indicative of internal state.</span></div>
                    <div class="dossier-item full-width"><span class="dossier-label">Central Paradox</span><span class="dossier-value">Seeks deep connection while requiring operational solitude. A walking, talking contradiction.</span></div>
                </div>
            </div>
             <div class="dossier-section" id="support">
                <h3 class="section-title"><span>//</span> SUPPORT THE MISSION</h3>
                <div class="dossier-item full-width"><span class="dossier-label">Contribution</span><span class="dossier-value">Your support helps fuel the creative engine. Find contribution options on the main Support tab.</span>
                     <div id="donation-buttons" style="margin-top: 15px; display: flex; gap: 20px; align-items: center;">
                        <a href="https://www.paypal.com/ncp/payment/4ZHFHWD5AA5F2" target="_blank" class="donation-button paypal-button"><img src="/paypal_logo.png" alt="Donate with PayPal"></a>
                        <a href="https://venmo.com/u/Anton-Vasilyev-1" target="_blank" class="donation-button venmo-button"><img src="/venmo_logo.png" alt="Donate with Venmo"></a>
                    </div>
                </div>
            </div>
        </div>`;
        const lines = ['SUBJECT: LORD TSARCASM', 'STATUS: DECRYPTING...', 'DATA STREAM INCOMING...'];
        const lineElements = Array.from(datastreamEffect.querySelectorAll('p'));
        const effects = lineElements.map(el => new ns.ui.TextScramble(el));
        const runFullAnimation = async () => {
            lineElements.forEach(el => el.textContent = '');
            await new Promise(resolve => setTimeout(resolve, 500));
            let i = 0; for (const fx of effects) { if (lines[i]) await fx.setText(lines[i]); await new Promise(r => setTimeout(r, 500)); i++; }
            await new Promise(resolve => setTimeout(resolve, 1000));
            datastreamEffect.style.transition = 'opacity 1s'; datastreamEffect.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 1000));
            datastreamEffect.classList.add('hidden');
            finalContent.innerHTML = bioHtmlFull; finalContent.classList.remove('hidden'); finalContent.style.opacity = '0'; finalContent.style.transition = 'opacity 0.5s';
            await new Promise(resolve => setTimeout(resolve, 100));
            finalContent.style.opacity = '1';
            const sections = finalContent.querySelectorAll('.dossier-section');
            for (const section of sections) {
                await new Promise(r => setTimeout(r, 200)); section.classList.add('visible');
                const items = section.querySelectorAll('.dossier-item');
                for (let j = 0; j < items.length; j++) { await new Promise(r => setTimeout(r, 100)); items[j].classList.add('visible'); }
                if (section.querySelector('[data-log-item]')) {
                    await ns.ui.typewriterEffect(document.getElementById('personal-log-value'), '"I write like I’m trying to survive, sing like I’m trying to remember who I was before the noise, and build worlds where pain makes sense and monsters have backstories. I chase connection like it\'s oxygen but live in the liminal — always halfway between healing and unraveling. If you\'re here, stay a while. The shadows aren\'t just for hiding — they\'re for sculpting who you become."');
                }
            }
        };
        runFullAnimation();
        ns.ui.setupTooltipAnimation();
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
        ns.ui.setupTooltipAnimation();
    }
    
    function initEnigmaticVisitorPage() {
        const canvas = document.querySelector('#model-canvas');
        const loaderElement = document.querySelector('#viewer-loader');
        if (canvas && loaderElement) {
            const spinner = loaderElement.querySelector('.spinner');
            if (spinner) spinner.style.display = 'block';
            ns.modelViewer.initModelViewer(canvas, 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/Animation_Walking_withSkin.glb', loaderElement);
        }
        ns.ui.setupTooltipAnimation();
        // The main script will handle calling renderProfileHeader.
    }

    ns.pages = { initAboutPage, initArtPage, initEnigmaticVisitorPage, initMusicPage: () => {}, initUpcomingMusicPage: () => {} };

}(app));


