import { app } from "../app.js";
(function(ns) {
    'use strict';

    ns.pages = ns.pages || {};

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
                    await ns.ui.typewriterEffect(document.getElementById('personal-log-value'), '"I make stuff because I have to — songs, stories, games, whatever helps me make sense of things. Writing helps me sort the noise, singing reminds me I’m still here, and building worlds is how I stay connected when real life feels too far away. I\'m constantly stuck somewhere between fixing myself and falling apart again. If you’re reading this, you probably get it. Stick around if you want — there’s room here for all the in-between."');
                }
            }
        };
        runFullAnimation();
        ns.ui.setupTooltipAnimation();
    }

    Object.assign(ns.pages, { initAboutPage });
}(app));
