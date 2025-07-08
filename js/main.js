import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create a global namespace for the application to avoid polluting the window object.
const app = {};

// --- MODULE: state.js ---
(function(ns) {
    'use strict';

    // --- STATE AND CACHE ---
    ns.contentCache = {};
    ns.state = {
        user: null,
        projects: { data: [], cursor: null, hasNext: true },
        likes: { data: [], cursor: null, hasNext: true },
        models: { data: [], cursor: null, hasNext: false },
        currentTab: 'projects',
        isLoading: false,
    };

    // --- STATIC DATA ---
    ns.staticModels = {
        data: [
            {
                title: 'Mechanical Mutated Chicken (Animated)',
                description: 'An animated game asset of a mechanical/mutated chicken. Its cybernetic parts and grotesque biological features create a horrifying post-apocalyptic creature.',
                imageUrl: 'assets/model_mutated_chicken.png',
                link: 'https://www.meshy.ai/3d-models/mechanicalmutated-chicken-v2-01964f84-a001-7408-bbee-b020b2073a10'
            },
            {
                title: 'Post-Apocalyptic Bear',
                description: 'A surreal post-apocalyptic bear in the styles of Takahide Hori, with chunks of flesh missing and bones visible. A horror-themed creation inspired by Guillermo del Toro and Tim Burton.',
                imageUrl: 'assets/model_bear.png',
                link: 'https://www.meshy.ai/3d-models/A-surreal-postapocalyptic-bear-in-the-styles-of-Takahide-Hori-chunks-of-flesh-missing-bones-visible-in-certain-places-horror-Guillermo-del-Toro-and-Tim-Burton-Highly-Detailed-videogameasset-v2-0196c6b9-42e3-7243-b82a-357957d122b5',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/radbear.glb',
                fileSizeMB: 23.5
            },
            {
                title: 'Alien Warlord',
                description: 'An imposing Alien Warlord, modeled in an A-pose, ready for integration as a game asset.',
                imageUrl: 'assets/model_alien_warlord.png',
                link: 'https://www.meshy.ai/3d-models/Alien-Warlord-A-pose-gameasset-v2-019696d9-370a-71ea-a81b-57d5bd5de931'
            },
            {
                title: 'Neon Guardian',
                description: 'A valiant guardian illuminated by neon lights, designed with a futuristic aesthetic.',
                imageUrl: 'assets/model_neon_guardian.png',
                link: 'https://www.meshy.ai/3d-models/Neon-Guardian-v2-019696ae-cca2-7bcc-9222-061aa93a7c39'
            },
            {
                title: 'Mutated Cow',
                description: 'A heavily mutated post-apocalyptic cow in a shattered wasteland. Massive and majestic, its hide is like volcanic rock with glowing bioluminescent veins. Its eyes burn with a toxic green light.',
                imageUrl: 'assets/model_mutated_cow.png',
                link: 'https://www.meshy.ai/3d-models/A-heavily-mutated-postapocalyptic-cow-standing-in-the-ruins-of-a-shattered-wasteland-The-cow-is-massive-rugged-and-terrifyingly-majestic-its-hide-is-cracked-and-tough-like-volcanic-rock-with-glowing-bioluminescent-veins-pulsing-beneath-the-surface-It-has-a-double-row-of-horns-spiraling-back-from-its-forehead-jagged-and-uneven-like-old-rebar-twisted-by-heat-Its-eyes-burn-a-dim-toxic-green-leaking-faint-smoke-Style-hyperrealistic-dark-scifi-gritty-detailed-textures-cinematic-lighting-v2-019673a0-17ed-7d1a-872a-50112d8f0f02'
            },
            {
                title: 'Enigmatic Visitor',
                description: 'An enigmatic visitor from another realm, designed to provoke curiosity and wonder.',
                imageUrl: 'assets/model_enigmatic_visitor.png',
                link: 'https://www.meshy.ai/3d-models/Enigmatic-Visitor-v2-01964533-a88e-75a2-b88a-743313a14b76',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/Animation_Walking_withSkin.glb'
            },
            {
                title: 'Skeletal Arctic Fox',
                description: 'A high-resolution game asset of a skeletal arctic fox, with charred and burnt bones for a dark fantasy setting.',
                imageUrl: '/assets/model_skeletal_fox.png',
                link: 'https://www.meshy.ai/3d-models/Create-a-highresolution-game-asset-of-a-skeletal-arctic-fox-The-bones-should-be-natural-nonmetallic-and-appear-charred-or-burnt-with-darkened-edges-ashstreaked-texture-and-signs-of-fire-damage-No-fur-or-armor-just-exposed-bone-cracked-and-scorched-with-intricate-anatomical-detail-Paws-slightly-curled-as-if-midmotion-or-frozen-in-agony-Environmentally-neutral-background-for-easy-integration-Stylized-for-a-dark-fantasy-or-postapocalyptic-setting-Must-be-eerie-haunting-and-visually-striking-without-looking-metallic-or-mechanical-gameasset-v2-019696d6-7907-7322-ab0f-76e64ca0104f'
            },
            {
                title: 'Garden Pine Tree',
                description: 'A detailed model of a garden pine tree, suitable for natural environments and architectural visualizations.',
                imageUrl: 'assets/model_pine_tree.png',
                link: 'https://www.meshy.ai/3d-models/garden-pine-tree-v2-01961190-77d9-7168-a4ee-ee30109f0e1e'
            },
            {
                title: 'HIVE Captain',
                description: 'A female captain of the HIVE faction, a strong and commanding officer ready for a sci-fi universe.',
                imageUrl: 'assets/model_hive_captain.png',
                link: 'https://www.meshy.ai/3d-models/HIVE-Captain-Officer-Female-v2-0194fad5-df09-762a-984d-215416bc2d1c'
            },
            {
                title: 'Robotic Spider',
                description: 'A highly detailed futuristic robotic spider with sleek metallic limbs, glowing red eyes, and intricate cybernetic joints, navigating a dark, industrial environment.',
                imageUrl: 'assets/model_robotic_spider.png',
                link: 'https://www.meshy.ai/3d-models/A-highly-detailed-futuristic-robotic-spider-with-sleek-metallic-limbs-glowing-red-eyes-and-intricate-mechanical-joints-Its-body-is-adorned-with-cables-pistons-and-small-energy-cores-giving-it-a-cybernetic-hightech-appearance-The-spider-moves-with-eerie-precision-its-legs-clicking-against-the-ground-as-it-navigates-a-dark-industrial-environment-filled-with-smoke-and-flickering-neon-lights-v2-0194ec8e-10e2-7a69-9d8f-19bab3900f2f'
            },
        ]
    };
    ns.state.models.data = ns.staticModels.data; // Populate state

    ns.supportContent = `
    <div id="support-container" style="max-width: 700px; margin: 40px auto; text-align: center; color: var(--secondary-color); line-height: 1.8;">
        <h2 class="page-title" style="animation: slideInDown 0.8s forwards; margin-bottom: 20px;">SUPPORT THE CREATOR</h2>
        <div style="animation: cardFadeIn 0.5s 0.2s forwards; opacity: 0; margin-bottom: 30px;">
            <p>If you enjoy my work—the music, the models, the digital chaos—consider supporting me. Your contributions help me keep the servers running, the software updated, and the dream alive.</p>
            <p>Every little bit helps me dedicate more time to creating the content you see here. Thank you for being a part of this journey.</p>
        </div>
        <div id="donation-buttons-container" style="animation: cardFadeIn 0.5s 0.4s forwards; opacity: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 25px; margin-top: 20px;">
            <div id="paypal-button" style="min-height: 44px;">
                <a href="https://www.paypal.com/ncp/payment/4ZHFHWD5AA5F2" target="_blank" class="donation-button paypal-button"><img src="paypal_logo.png" alt="Donate with PayPal"></a>
            </div>
            <a href="https://venmo.com/u/Anton-Vasilyev-1" target="_blank" class="donation-button venmo-button">
                <img src="venmo_logo.png" alt="Donate with Venmo">
            </a>
        </div>
    </div>
    `;

}(app));

// --- MODULE: api.js ---
(function(ns) {
    'use strict';

    const API_BASE_URL = '/api/v1';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const setCache = (key, data) => {
        try {
            const cacheItem = {
                timestamp: new Date().getTime(),
                data: data
            };
            sessionStorage.setItem(key, JSON.stringify(cacheItem));
        } catch (e) {
            console.error("Could not write to sessionStorage:", e);
        }
    };

    const getCache = (key) => {
        try {
            const itemStr = sessionStorage.getItem(key);
            if (!itemStr) {
                return null;
            }
            const item = JSON.parse(itemStr);
            const now = new Date().getTime();
            if (now - item.timestamp > CACHE_DURATION) {
                sessionStorage.removeItem(key);
                return null;
            }
            return item.data;
        } catch (e) {
            console.error("Could not read from sessionStorage:", e);
            return null;
        }
    };

    const fetchAPI = async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
            return null;
        }
    };

    const getCreator = async () => {
        return new Promise((resolve) => {
            const cacheKey = 'creator_info';
            const cached = getCache(cacheKey);
            if (cached) {
                resolve(cached);
                return;
            }

            const checkWebsim = (attempts = 0) => {
                if (window.websim && typeof window.websim.getCreator === 'function') {
                    window.websim.getCreator()
                        .then(user => {
                            if (user) {
                                setCache(cacheKey, user);
                            }
                            resolve(user);
                        })
                        .catch(err => {
                            console.error("window.websim.getCreator() call failed:", err);
                            resolve(null);
                        });
                } else if (attempts < 100) {
                    setTimeout(() => checkWebsim(attempts + 1), 100);
                } else {
                    console.error("Websim API failed to initialize in time. Falling back.");
                    resolve(null);
                }
            };
            checkWebsim();
        });
    };

    const fetchProjects = async (username, after = null) => {
        const endpoint = `/users/${username}/projects?posted=true&first=12${after ? `&after=${after}` : ''}`;
        const cacheKey = `user_${username}_projects_first_page`;

        if (!after) {
            const cached = getCache(cacheKey);
            if (cached) return cached;
        }

        const data = await fetchAPI(endpoint);
        const projects = data?.projects || { data: [], meta: { has_next_page: false } };

        if (!after && projects.data.length > 0) {
            setCache(cacheKey, projects);
        }
        return projects;
    };

    const fetchLikes = async (username, after = null) => {
        const endpoint = `/users/${username}/likes?first=12${after ? `&after=${after}` : ''}`;
        const cacheKey = `user_${username}_likes_first_page`;

        if (!after) {
            const cached = getCache(cacheKey);
            if (cached) return cached;
        }

        const data = await fetchAPI(endpoint);
        const likes = data?.likes || { data: [], meta: { has_next_page: false } };

        if (!after && likes.data.length > 0) {
            setCache(cacheKey, likes);
        }
        return likes;
    };

    ns.api = { getCreator, fetchProjects, fetchLikes };

}(app));

// --- MODULE: model_viewer.js ---
(function(ns) {
    'use strict';
    // Note: THREE, OrbitControls, and GLTFLoader are passed in from the module scope.
    let camera, scene, renderer, controls, clock, mixer, animationFrameId, resizeObserver;

    const CACHE_NAME = 'glb-model-cache-v1';

    async function fetchWithProgress(url, onProgress) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
            throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');
        let receivedLength = 0;
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            chunks.push(value);
            receivedLength += value.length;
            if (onProgress) {
                onProgress(receivedLength, contentLength);
            }
        }

        const blob = new Blob(chunks);
        return blob;
    }

    async function loadModelWithCache(url, onProgress) {
        if (!url.endsWith('.glb') || !url.startsWith('https://file.garden')) {
            const blob = await fetchWithProgress(url, onProgress);
            return blob.arrayBuffer();
        }

        try {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(url);

            if (cachedResponse) {
                console.log('Model found in cache:', url);
                const blob = await cachedResponse.blob();
                if (onProgress) {
                    onProgress(blob.size, blob.size);
                }
                return blob.arrayBuffer();
            }

            console.log('Model not in cache, fetching from network:', url);
            const blob = await fetchWithProgress(url, onProgress);
            await cache.put(url, new Response(blob));
            console.log('Model cached:', url);

            return blob.arrayBuffer();

        } catch (error) {
            console.error('Cache API or fetch error:', error);
            throw error;
        }
    }

    const initModelViewer = async (canvas, modelUrl, loaderElement, modelData = {}) => {
        if (!canvas) return;

        destroyModelViewer();

        const container = canvas.parentElement;
        clock = new THREE.Clock();
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x05080a);
        scene.fog = new THREE.Fog(0x05080a, 10, 50);
        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 4);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set(0, 1, 0);

        scene.add(new THREE.AmbientLight(0x404040, 2));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        const pointLight = new THREE.PointLight(0x3a7bd5, 2, 100);
        pointLight.position.set(-5, 3, 2);
        scene.add(pointLight);
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({ color: 0x080c10, metalness: 0.2, roughness: 0.8 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === container) {
                    const { width, height } = entry.contentRect;
                    if (renderer && camera && width > 0 && height > 0) {
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                    }
                }
            }
        });
        resizeObserver.observe(container);
        
        animate();

        const loaderP = loaderElement?.querySelector('p');
        if (loaderP) {
            if (modelData.fileSizeMB && modelData.fileSizeMB > 10) {
                loaderP.innerHTML = `ANCHORING LARGE SPECIMEN (${modelData.fileSizeMB} MB)...<br><small>THIS MAY TAKE A MOMENT.</small>`;
            } else {
                loaderP.textContent = "LOADING SPECIMEN...";
            }
        }

        const onProgress = (loaded, total) => {
            if (loaderElement && loaderP) {
                let baseText = "LOADING SPECIMEN";
                let note = "";
                if (modelData.fileSizeMB && modelData.fileSizeMB > 10) {
                    baseText = `ANCHORING LARGE SPECIMEN (${modelData.fileSizeMB} MB)`;
                    note = `<br><small>THIS MAY TAKE A MOMENT.</small>`;
                }
                if (total) {
                    const percentComplete = (loaded / total) * 100;
                    loaderP.innerHTML = `${baseText}... ${Math.round(percentComplete)}%${note}`;
                } else {
                    const loadedMB = (loaded / 1024 / 1024).toFixed(2);
                    loaderP.innerHTML = `${baseText}... ${loadedMB} MB${note}`;
                }
            }
        };

        try {
            const modelBuffer = await loadModelWithCache(modelUrl, onProgress);
            const loader = new GLTFLoader();
            loader.parse(modelBuffer, '', (gltf) => {
                const model = gltf.scene;
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3()).length();
                const center = box.getCenter(new THREE.Vector3());
                model.position.x += (model.position.x - center.x);
                model.position.y += (model.position.y - center.y);
                model.position.z += (model.position.z - center.z);
                const scale = 2.5 / size;
                model.scale.set(scale, scale, scale);
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                scene.add(model);
                if (gltf.animations && gltf.animations.length) {
                    mixer = new THREE.AnimationMixer(model);
                    mixer.clipAction(gltf.animations[0]).play();
                }
                if (loaderElement) loaderElement.classList.add('hidden');
            }, (error) => {
                 console.error('An error happened during model parsing:', error);
                 if (loaderElement) {
                    loaderElement.querySelector('p').textContent = "ERROR: FAILED TO PARSE SPECIMEN.";
                    const spinner = loaderElement.querySelector('.spinner');
                    if (spinner) spinner.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('An error happened while loading the model:', error);
            if (loaderElement) {
                loaderElement.querySelector('p').textContent = "ERROR: UNABLE TO ANCHOR SPECIMEN.";
                const spinner = loaderElement.querySelector('.spinner');
                if (spinner) spinner.style.display = 'none';
            }
        }
    };

    const animate = () => {
        if (!renderer) return;
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
    };

    const destroyModelViewer = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (resizeObserver) resizeObserver.disconnect();
        if (renderer) renderer.dispose();
        if (scene) {
            while(scene.children.length > 0){ 
                const obj = scene.children[0];
                scene.remove(obj); 
                if(obj.geometry) obj.geometry.dispose();
                if(obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(material => material.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            }
        }
        if (controls) controls.dispose();
        camera = scene = renderer = controls = clock = mixer = animationFrameId = resizeObserver = null;
    };

    ns.modelViewer = { initModelViewer, destroyModelViewer };

}(app));

// --- MODULE: ui.js ---
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


// --- MODULE: pages.js ---
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


// --- MODULE: home.js ---
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


// --- MODULE: router.js ---
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