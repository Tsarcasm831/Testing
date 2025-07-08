import { app } from "./app.js";
(function(ns) {
    'use strict';
    
    ns.createRouter = () => {
        const routes = {
            '/': { file: 'index.html', handler: async () => { if (ns.state.projects.data.length === 0) await ns.home.loadData(); else ns.home.setupIntersectionObserver(); }, title: 'LordTsarcasm.com' },
            'music': { file: 'music.html', handler: ns.pages.initMusicPage, title: 'Music - Lord Tsarcasm' },
            'about': { file: 'about_me.html', handler: ns.pages.initAboutPage, title: 'About Me - Lord Tsarcasm' },
            'art': { file: 'art.html', handler: ns.pages.initArtPage, title: 'Art - Lord Tsarcasm' },
            'upcoming-music': { file: 'upcoming_music.html', handler: ns.pages.initUpcomingMusicPage, title: 'Upcoming Music - Lord Tsarcasm' },
            'enigmatic_visitor': { file: 'enigmatic_visitor.html', handler: ns.pages.initEnigmaticVisitorPage, title: 'Enigmatic Visitor - Lord Tsarcasm' },
            'about_me': { file: 'about_me.html', handler: ns.pages.initAboutPage, title: 'About Me - Lord Tsarcasm' },
        };
        const router = {
            routes,
            async loadPage(pageKey, pushState = true) {
                const route = this.routes[pageKey] || this.routes['/'];
                document.title = route.title;
                this.updateNavLinks(pageKey);
                if (pushState) history.pushState({ pageKey }, '', pageKey === '/' ? '/' : `/?page=${pageKey}`);
                const { DOMElements } = ns.ui;
                if (!DOMElements.pageContentContainer || !DOMElements.tabs || !DOMElements.grid) {
                    if (route.handler) route.handler(); return;
                }
                if (pageKey === '/') {
                    DOMElements.pageContentContainer.classList.add('hidden');
                    DOMElements.tabs.classList.remove('hidden');
                    DOMElements.grid.classList.remove('hidden');
                    if (route.handler) await route.handler();
                } else {
                    DOMElements.tabs.classList.add('hidden');
                    DOMElements.grid.classList.add('hidden');
                    DOMElements.pageContentContainer.classList.remove('hidden');
                    DOMElements.pageContentContainer.innerHTML = '';
                    ns.ui.showLoader();
                    try {
                        let pageHtml = ns.contentCache[pageKey];
                        if (!pageHtml) {
                            const response = await fetch(route.file);
                            if (!response.ok) throw new Error(`Failed to fetch ${route.file}`);
                            pageHtml = await response.text();
                            ns.contentCache[pageKey] = pageHtml;
                        }
                        const mainContent = new DOMParser().parseFromString(pageHtml, 'text/html').querySelector('main');
                        if (mainContent) {
                            DOMElements.pageContentContainer.innerHTML = mainContent.innerHTML;
                            const usernameHeader = DOMElements.pageContentContainer.querySelector('.page-header-username');
                            if (usernameHeader && ns.state.user) usernameHeader.textContent = `@${ns.state.user.username}`;
                            DOMElements.pageContentContainer.querySelectorAll('a[data-page]').forEach(link => link.addEventListener('click', (e) => this.handleNavClick(e)));
                        } else DOMElements.pageContentContainer.innerHTML = `<p>Error loading content.</p>`;
                        if (route.handler) route.handler();
                    } catch (error) {
                        console.error("Error loading page:", error);
                        DOMElements.pageContentContainer.innerHTML = `<p>Error: Could not load page content.</p>`;
                    } finally {
                        ns.ui.hideLoader();
                    }
                }
            },
            handleNavClick(event) {
                const target = event.target.closest('a');
                if (target && target.dataset.page) { event.preventDefault(); this.loadPage(target.dataset.page); }
            },
            handlePopState(event) {
                this.loadPage((event.state && event.state.pageKey) ? event.state.pageKey : '/', false);
            },
            updateNavLinks(currentPageKey) {
                ns.ui.DOMElements.mainNav?.querySelectorAll('.nav-link').forEach(link => {
                    let isActive = (link.dataset.page === currentPageKey) || (link.dataset.page === 'music' && currentPageKey === 'upcoming-music');
                    if (link.dataset.page === '/' && currentPageKey !== '/') isActive = false;
                    link.classList.toggle('active', isActive);
                });
            }
        };
        router.handleNavClick = router.handleNavClick.bind(router);
        router.handlePopState = router.handlePopState.bind(router);
        return router;
    };
}(app));


