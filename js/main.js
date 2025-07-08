import './app.js';
import './state.js';
import './api.js';
import './model_viewer.js';
import './ui.js';
import './pages.js';
import './home.js';
import './router.js';
import { app } from './app.js';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    'use strict';
    try {
        app.ui.cacheDOMElements();
        app.ui.setupHamburgerMenu();
        app.ui.setupTooltipAnimation();
        app.ui.renderSocialLinks();
        
        const router = app.createRouter();

        const setupGlobalEventListeners = () => {
            app.ui.DOMElements.modalCloseButton?.addEventListener('click', app.ui.closeModal);
            app.ui.DOMElements.modalOverlay?.addEventListener('click', (e) => {
                if (e.target === app.ui.DOMElements.modalOverlay) app.ui.closeModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && app.ui.DOMElements.modalOverlay?.classList.contains('visible')) app.ui.closeModal();
            });
            app.ui.DOMElements.modalProjectLink?.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && link.dataset.page) {
                    e.preventDefault();
                    router.loadPage(link.dataset.page);
                    app.ui.closeModal();
                }
            });
            app.ui.DOMElements.mainNav?.addEventListener('click', (e) => router.handleNavClick(e));
            window.addEventListener('popstate', (e) => router.handlePopState(e));
            if (document.getElementById('content-grid')) app.home.setupHomeEventListeners(app.home.switchTab);
        };
        
        if (document.getElementById('content-grid')) app.ui.showLoader();

        const user = await app.api.getCreator();
        if (!user) {
            console.error("Could not get creator info.");
            if(app.ui.DOMElements.username) app.ui.DOMElements.username.textContent = 'USER NOT FOUND';
            if(document.querySelector('.page-header-username')) document.querySelector('.page-header-username').textContent = 'USER NOT FOUND';
            app.ui.hideLoader();
            if(document.getElementById('content-grid')) app.ui.showNoContent();
            return;
        }
        app.state.user = user;
        app.ui.renderProfileHeader(app.state.user);
        const pageHeaderUsername = document.querySelector('.page-header-username');
        if (pageHeaderUsername) pageHeaderUsername.textContent = `@${app.state.user.username}`;
        
        setupGlobalEventListeners();

        const pageKey = new URL(window.location.href).searchParams.get('page');
        if (pageKey) router.loadPage(pageKey, false);
        else if (window.location.pathname.endsWith('.html') && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            const pageName = window.location.pathname.split('/').pop().replace('.html', '');
            router.loadPage(pageName, false);
        } else router.loadPage('/', false);

    } catch (error) {
        console.error("Initialization failed:", error);
        app.ui.hideLoader();
        const appContainer = document.getElementById('app-container');
        if (appContainer) appContainer.innerHTML = `<div style="text-align: center; color: var(--primary-color); font-family: 'Orbitron', sans-serif; padding: 20px;"><h2>SYSTEM ERROR</h2><p>Failed to initialize user profile interface.</p><p>ERROR: ${error.message}</p></div>`;
    }
});