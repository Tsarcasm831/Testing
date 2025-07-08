import { app } from "./app.js";
(function(ns) {
    'use strict';

    ns.ui = {};
    const DOMElements = {};
    ns.ui.DOMElements = DOMElements;

    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_';
            this.update = this.update.bind(this);
            this.frameRequest = null;
            this.resolve = null;
            this.queue = [];
            this.frame = 0;
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                if (this.resolve) this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    ns.ui.TextScramble = TextScramble;

    async function typewriterEffect(element, text, speed = 30) {
        if (!element) return;
        element.innerHTML = '<span></span><span class="cursor"></span>';
        const textSpan = element.querySelector('span:first-child');
        const cursorSpan = element.querySelector('.cursor');

        for (let i = 0; i < text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, speed));
            if (textSpan) textSpan.textContent += text[i];
        }

        if (cursorSpan) cursorSpan.style.animation = 'blink 1s step-end infinite';
    }
    ns.ui.typewriterEffect = typewriterEffect;

    ns.ui.cacheDOMElements = () => {
        const elements = {
            mainNav: document.getElementById('main-nav'),
            hamburgerBtn: document.getElementById('hamburger-btn'),
            avatar: document.getElementById('avatar'),
            username: document.getElementById('username'),
            description: document.getElementById('description'),
            profileLink: document.getElementById('profile-link'),
            usernameLink: document.getElementById('username-link'),
            socialLinks: document.getElementById('social-links'),
            socialLinksTabs: document.getElementById('social-links-tabs'),
            grid: document.getElementById('content-grid'),
            tabs: document.getElementById('tabs'),
            loader: document.getElementById('loader'),
            noContent: document.getElementById('no-content'),
            modalOverlay: document.getElementById('modal-overlay'),
            modalCloseButton: document.getElementById('modal-close-button'),
            modalImage: document.getElementById('modal-image'),
            modalTitle: document.getElementById('modal-title'),
            modalCreatorContainer: document.getElementById('modal-creator-container'),
            modalDescription: document.getElementById('modal-description'),
            modalStats: document.getElementById('modal-stats'),
            modalProjectLink: document.getElementById('modal-project-link'),
            modalViewerContainer: document.getElementById('modal-viewer-container'),
            modalModelCanvas: document.getElementById('modal-model-canvas'),
            modalViewerLoader: document.getElementById('modal-viewer-loader'),
            pageContentContainer: document.getElementById('page-content-container'),
            content: document.getElementById('content'),
        };
        for (const key in elements) DOMElements[key] = elements[key];
    };

    ns.ui.setupHamburgerMenu = () => {
        if (DOMElements.hamburgerBtn && DOMElements.mainNav) {
            DOMElements.hamburgerBtn.addEventListener('click', () => {
                DOMElements.mainNav.classList.toggle('open');
            });
        }
    };
    
    ns.ui.showLoader = () => DOMElements.loader?.classList.remove('hidden');
    ns.ui.hideLoader = () => DOMElements.loader?.classList.add('hidden');
    ns.ui.showNoContent = () => DOMElements.noContent?.classList.remove('hidden');
    ns.ui.hideNoContent = () => DOMElements.noContent?.classList.add('hidden');

    ns.ui.renderProfileHeader = (user) => {
        if (!user) return;
        if (DOMElements.username) {
            const profileUrl = `https://websim.com/@${user.username}`;
            if (DOMElements.avatar) DOMElements.avatar.src = '/assets/ROD.png';
            if (DOMElements.username) DOMElements.username.textContent = `@${user.username}`;
            if (DOMElements.profileLink) DOMElements.profileLink.href = profileUrl;
            if (DOMElements.usernameLink) DOMElements.usernameLink.href = profileUrl;
            if (DOMElements.description) {
                if (user.description) {
                    DOMElements.description.style.display = '';
                    DOMElements.description.innerHTML = marked.parse(user.description);
                } else {
                    DOMElements.description.style.display = 'none';
                }
            }
        }
        ns.ui.renderSocialLinks();
    };

    const socialLinksConfig = {
        main: [
            { name: 'Facebook', url: 'https://www.facebook.com/lordtsarcasm' },
            { name: 'Instagram', url: 'https://instagram.com/lordtsarcasm' },
        ]
    };

    ns.ui.renderSocialLinks = (type = 'main') => {
        const linksHtml = socialLinksConfig[type].map(link => `<a href="${link.url}" target="_blank" class="social-link">${link.name}</a>`).join('');
        if (DOMElements.socialLinks) DOMElements.socialLinks.innerHTML = linksHtml;
        if (DOMElements.socialLinksTabs) {
            DOMElements.socialLinksTabs.innerHTML = socialLinksConfig[type].map(link => `<a href="${link.url}" target="_blank" class="social-link-tab">${link.name}</a>`).join('');
        }
    };
    
    const tooltipOriginalTexts = ["Download Arc, my favorite browser!", "sorry linux people, mac and windows only"];
    ns.ui.setupTooltipAnimation = () => {
        const giftLink = document.getElementById('gift-link');
        if (!giftLink || giftLink.dataset.tooltipInitialized) return;
        giftLink.dataset.tooltipInitialized = "true";
        const tooltipTextElements = document.querySelectorAll('#gift-tooltip .tooltip-text');
        if (tooltipTextElements.length > 0) {
            const scramblers = Array.from(tooltipTextElements).map(el => new TextScramble(el));
            tooltipTextElements.forEach(el => el.textContent = '');
            giftLink.addEventListener('mouseenter', () => scramblers.forEach((s, i) => s.setText(tooltipOriginalTexts[i])));
            giftLink.addEventListener('mouseleave', () => tooltipTextElements.forEach(el => el.textContent = ''));
        }
    };
    
    const createProjectCard = (projectData, index) => {
        const { site, project } = projectData;
        if (!project) return null;
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.style.animationDelay = `${(document.querySelectorAll('.card').length % 10) * 0.05}s`;
        let onErrorScript = `this.onerror=null; this.src='/assets/background.png'; this.classList.add('fallback-image');`;
        const projectTitleLower = project.title ? project.title.toLowerCase() : '';
        if (projectTitleLower.includes('starcraft clone')) onErrorScript = `this.onerror=null; this.src='/ws-sc-bg.png';`;
        else if (projectTitleLower.includes('disney kingdom clash')) onErrorScript = `this.onerror=null; this.src='/assets/dkc.png';`;
        const imageUrl = site ? `https://images.websim.com/v1/site/${site.id}/600` : (project.thumbnail?.url ? project.thumbnail.url.replace('/current', '/600') : '/assets/background.png');
        if (!site && !project.thumbnail?.url) card.innerHTML = `<img class="card-image fallback-image" src="${imageUrl}" alt="${project.title || 'Project'}" loading="lazy">`;
        else card.innerHTML = `<img class="card-image" src="${imageUrl}" alt="${project.title || 'Project'}" loading="lazy" onerror="${onErrorScript}">`;
        const cardInfo = document.createElement('div');
        cardInfo.className = 'card-info';
        cardInfo.innerHTML = `<h3 class="card-title">${project.title || 'Untitled Project'}</h3>`;
        card.appendChild(cardInfo);
        return card;
    };
    
    const createLikeCard = (likeData, index) => {
        const { site, project } = likeData;
        if (!site || !project) return null;
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.style.animationDelay = `${(document.querySelectorAll('.card').length % 10) * 0.05}s`;
        const onErrorScript = `this.onerror=null; this.src='/assets/background.png'; this.classList.add('fallback-image');`;
        const imageUrl = project.thumbnail?.url ? project.thumbnail.url : `https://images.websim.com/v1/site/${site.id}/600`;
        card.innerHTML = `<img class="card-image" src="${imageUrl}" alt="${project.title || 'Liked Site'}" loading="lazy" onerror="${onErrorScript}"><div class="card-info"><h3 class="card-title">${project.title || 'Untitled Site'}</h3><div class="card-creator"><img class="creator-avatar" src="${project.created_by.avatar_url || 'https://images.websim.com/avatar/' + project.created_by.username}" alt="${project.created_by.username}"><span>@${project.created_by.username}</span></div></div>`;
        return card;
    };

    const createModelCard = (modelData, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.style.animationDelay = `${(document.querySelectorAll('.card').length % 10) * 0.05}s`;
        card.innerHTML = `<img class="card-image" src="${modelData.imageUrl}" alt="${modelData.title}" loading="lazy"><div class="card-info"><h3 class="card-title">${modelData.title}</h3></div>`;
        return card;
    };

    ns.ui.renderGrid = (newData, currentTab, startIndex) => {
        if (startIndex === 0) DOMElements.grid.innerHTML = '';
        ns.ui.hideNoContent();
        if (DOMElements.grid.children.length === 0 && newData.length === 0) {
            ns.ui.showNoContent();
            return;
        }
        const cardCreator = { projects: createProjectCard, likes: createLikeCard, models: createModelCard }[currentTab] || (() => null);
        newData.forEach((item, i) => {
            const card = cardCreator(item, startIndex + i);
            if (card) DOMElements.grid.appendChild(card);
        });
    };

    ns.ui.openModal = async (itemData, tab) => {
        if (tab === 'models') {
            DOMElements.modalImage.classList.add('hidden');
            DOMElements.modalViewerContainer.classList.remove('hidden');
            DOMElements.modalViewerLoader.classList.remove('hidden');
            DOMElements.modalViewerLoader.querySelector('p').textContent = "LOADING SPECIMEN...";
            const spinner = DOMElements.modalViewerLoader.querySelector('.spinner');
            if(spinner) spinner.style.display = 'block';
            await ns.modelViewer.initModelViewer(DOMElements.modalModelCanvas, itemData.glbUrl, DOMElements.modalViewerLoader, itemData);
            DOMElements.modalTitle.textContent = itemData.title;
            DOMElements.modalDescription.innerHTML = `<p>${itemData.description}</p>`;
            DOMElements.modalCreatorContainer.innerHTML = DOMElements.modalStats.innerHTML = '';
            const link = DOMElements.modalProjectLink;
            if (itemData.pageUrl) {
                link.href = itemData.pageUrl;
                link.textContent = "View Interactive Page";
                link.removeAttribute('target');
                link.dataset.page = itemData.pageUrl.split('?page=')[1];
            } else {
                link.href = itemData.link;
                link.textContent = "View on Meshy.ai";
                link.target = "_blank";
                delete link.dataset.page;
            }
        } else {
            DOMElements.modalImage.classList.remove('hidden');
            DOMElements.modalViewerContainer.classList.add('hidden');
            const { project, site } = itemData;
            if (!project) return ns.ui.closeModal();
            const modalImage = DOMElements.modalImage;
            modalImage.classList.remove('fallback-image');
            const imageUrl = site ? `https://images.websim.com/v1/site/${site.id}/1200` : (project.thumbnail?.url ? project.thumbnail.url.replace('/current', '/1200') : '/assets/background.png');
            modalImage.src = imageUrl;
            modalImage.alt = project.title || 'Project Image';
            modalImage.onerror = null;
            const projectTitleLower = project.title ? project.title.toLowerCase() : '';
            let fallbackOnError = () => { modalImage.src = '/assets/background.png'; modalImage.classList.add('fallback-image'); modalImage.onerror = null; };
            if (projectTitleLower.includes('starcraft clone')) modalImage.onerror = () => { modalImage.src = '/ws-sc-bg.png'; modalImage.classList.add('fallback-image'); modalImage.onerror = null; };
            else if (projectTitleLower.includes('disney kingdom clash')) modalImage.onerror = () => { modalImage.src = '/assets/dkc.png'; modalImage.classList.add('fallback-image'); modalImage.onerror = null; };
            else modalImage.onerror = fallbackOnError;
            DOMElements.modalTitle.textContent = project.title || 'Untitled Project';
            DOMElements.modalDescription.innerHTML = project.description ? marked.parse(project.description) : 'No description available for this project.';
            DOMElements.modalCreatorContainer.innerHTML = `<img class="creator-avatar" src="${project.created_by.avatar_url || 'https://images.websim.com/avatar/' + project.created_by.username}" alt="${project.created_by.username}"><span>@${project.created_by.username}</span>`;
            const stats = project.stats || { views: 0, likes: 0, comments: 0 };
            DOMElements.modalStats.innerHTML = `<div class="stat"><div class="stat-value">${stats.views.toLocaleString()}</div><div class="stat-label">Views</div></div><div class="stat"><div class="stat-value">${stats.likes.toLocaleString()}</div><div class="stat-label">Likes</div></div><div class="stat"><div class="stat-value">${stats.comments.toLocaleString()}</div><div class="stat-label">Comments</div></div>`;
            DOMElements.modalProjectLink.href = `https://websim.com/p/${project.id}`;
            DOMElements.modalProjectLink.textContent = "Visit Project";
        }
        DOMElements.modalOverlay.classList.remove('hidden');
        setTimeout(() => DOMElements.modalOverlay.classList.add('visible'), 10);
    };

    ns.ui.closeModal = () => {
        DOMElements.modalOverlay.classList.remove('visible');
        setTimeout(() => {
            DOMElements.modalOverlay.classList.add('hidden');
            DOMElements.modalImage.src = "";
            DOMElements.modalImage.classList.remove('fallback-image');
            ns.modelViewer.destroyModelViewer();
        }, 300);
    };

    ns.ui.updateTabs = (activeTab) => {
        DOMElements.tabs.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === activeTab);
        });
    };

}(app));


