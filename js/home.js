import { app } from "./app.js";
(function(ns) {
    'use strict';

    let observer;
    
    const setupIntersectionObserver = () => {
        if (observer) observer.disconnect();
        const tabState = ns.state[ns.state.currentTab];
        if (!tabState || !tabState.hasNext) return;
        observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !ns.state.isLoading) loadData();
        }, { rootMargin: '0px 0px 500px 0px', threshold: 0.01 });
        const lastCard = ns.ui.DOMElements.grid.querySelector('.card:last-child');
        if (lastCard) observer.observe(lastCard);
    };

    const loadData = async () => {
        const tabName = ns.state.currentTab;
        const tabState = ns.state[tabName];
        if (ns.state.isLoading || !tabState || !tabState.hasNext) return;
        ns.state.isLoading = true;
        ns.ui.showLoader();
        try {
            const isInitialLoadForTab = tabState.data.length === 0;
            let response;
            if (tabName === 'projects') response = await ns.api.fetchProjects(ns.state.user.username, tabState.cursor);
            else if (tabName === 'likes') response = await ns.api.fetchLikes(ns.state.user.username, tabState.cursor);
            else { ns.state.isLoading = false; ns.ui.hideLoader(); return; }
            let newData = response.data || [];
            if (tabName === 'projects') newData = newData.filter(item => item.project && item.project.title !== 'Lord Tsarcasm Profile');
            else if (tabName === 'likes') newData = newData.filter(item => item.project?.created_by?.username !== ns.state.user.username);
            if (newData.length > 0) {
                const startIndex = tabState.data.length;
                tabState.data.push(...newData);
                ns.ui.renderGrid(newData, tabName, startIndex);
            } else if (isInitialLoadForTab) ns.ui.renderGrid([], tabName, 0);
            tabState.cursor = response.meta.end_cursor;
            tabState.hasNext = response.meta.has_next_page;
            setupIntersectionObserver();
        } catch (err) {
            console.error(`Failed to fetch ${tabName}:`, err);
            if (ns.state[tabName]?.data.length === 0) ns.ui.showNoContent();
        } finally {
            ns.state.isLoading = false;
            ns.ui.hideLoader();
        }
    };
    
    const switchTab = async (tabName) => {
        if (ns.state.currentTab === tabName) return;
        if (observer) observer.disconnect();
        ns.state.currentTab = tabName;
        ns.ui.updateTabs(tabName);
        ns.ui.hideNoContent();
        if (tabName === 'support') {
            ns.ui.DOMElements.grid.classList.add('support-view');
            ns.ui.DOMElements.grid.innerHTML = ns.supportContent;
            if (observer) observer.disconnect();
            return;
        }
        const tabState = ns.state[tabName];
        if (!tabState) return;
        ns.ui.DOMElements.grid.classList.remove('support-view');
        ns.ui.renderGrid(tabState.data, tabName, 0);
        if (tabState.data.length === 0 && tabName !== 'models') await loadData();
        else setupIntersectionObserver();
    };

    const setupHomeEventListeners = (switchTabHandler) => {
        if (ns.ui.DOMElements.tabs) ns.ui.DOMElements.tabs.addEventListener('click', (e) => { if (e.target.matches('.tab-button')) switchTabHandler(e.target.dataset.tab); });
        if (ns.ui.DOMElements.grid) ns.ui.DOMElements.grid.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (!card || !card.dataset.index) return;
            const item = ns.state[ns.state.currentTab]?.data?.[parseInt(card.dataset.index, 10)];
            if (item) ns.ui.openModal(item, ns.state.currentTab);
        });
    };

    ns.home = { loadData, switchTab, setupHomeEventListeners, setupIntersectionObserver };

}(app));


