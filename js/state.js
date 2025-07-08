import { app } from './app.js';

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
                link: 'https://www.meshy.ai/3d-models/mechanicalmutated-chicken-v2-01964f84-a001-7408-bbee-b020b2073a10',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/radchicken.glb',
                centerBottom: true
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
                link: 'https://www.meshy.ai/3d-models/Alien-Warlord-A-pose-gameasset-v2-019696d9-370a-71ea-a81b-57d5bd5de931',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/warlord.glb',
                centerBottom: true
            },
            {
                title: 'Neon Guardian',
                description: 'A valiant guardian illuminated by neon lights, designed with a futuristic aesthetic.',
                imageUrl: 'assets/model_neon_guardian.png',
                link: 'https://www.meshy.ai/3d-models/Neon-Guardian-v2-019696ae-cca2-7bcc-9222-061aa93a7c39',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/neonguardian.glb',
                centerBottom: true
            },
            {
                title: 'Mutated Cow',
                description: 'A heavily mutated post-apocalyptic cow in a shattered wasteland. Massive and majestic, its hide is like volcanic rock with glowing bioluminescent veins. Its eyes burn with a toxic green light.',
                imageUrl: 'assets/model_mutated_cow.png',
                link: 'https://www.meshy.ai/3d-models/A-heavily-mutated-postapocalyptic-cow-standing-in-the-ruins-of-a-shattered-wasteland-The-cow-is-massive-rugged-and-terrifyingly-majestic-its-hide-is-cracked-and-tough-like-volcanic-rock-with-glowing-bioluminescent-veins-pulsing-beneath-the-surface-It-has-a-double-row-of-horns-spiraling-back-from-its-forehead-jagged-and-uneven-like-old-rebar-twisted-by-heat-Its-eyes-burn-a-dim-toxic-green-leaking-faint-smoke-Style-hyperrealistic-dark-scifi-gritty-detailed-textures-cinematic-lighting-v2-019673a0-17ed-7d1a-872a-50112d8f0f02',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/cow.glb',
                centerBottom: true
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
                link: 'https://www.meshy.ai/3d-models/Create-a-highresolution-game-asset-of-a-skeletal-arctic-fox-The-bones-should-be-natural-nonmetallic-and-appear-charred-or-burnt-with-darkened-edges-ashstreaked-texture-and-signs-of-fire-damage-No-fur-or-armor-just-exposed-bone-cracked-and-scorched-with-intricate-anatomical-detail-Paws-slightly-curled-as-if-midmotion-or-frozen-in-agony-Environmentally-neutral-background-for-easy-integration-Stylized-for-a-dark-fantasy-or-postapocalyptic-setting-Must-be-eerie-haunting-and-visually-striking-without-looking-metallic-or-mechanical-gameasset-v2-019696d6-7907-7322-ab0f-76e64ca0104f',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/fox_walking_animation.glb',
                centerBottom: true
            },
            {
                title: 'Garden Pine Tree',
                description: 'A detailed model of a garden pine tree, suitable for natural environments and architectural visualizations.',
                imageUrl: 'assets/model_pine_tree.png',
                link: 'https://www.meshy.ai/3d-models/garden-pine-tree-v2-01961190-77d9-7168-a4ee-ee30109f0e1e',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/garden_pine_tree.glb',
                centerBottom: true
            },
            {
                title: 'HIVE Captain',
                description: 'A female captain of the HIVE faction, a strong and commanding officer ready for a sci-fi universe.',
                imageUrl: 'assets/model_hive_captain.png',
                link: 'https://www.meshy.ai/3d-models/HIVE-Captain-Officer-Female-v2-0194fad5-df09-762a-984d-215416bc2d1c',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/captain.glb',
                centerBottom: true
            },
            {
                title: 'Robotic Spider',
                description: 'A highly detailed futuristic robotic spider with sleek metallic limbs, glowing red eyes, and intricate cybernetic joints, navigating a dark, industrial environment.',
                imageUrl: 'assets/model_robotic_spider.png',
                link: 'https://www.meshy.ai/3d-models/A-highly-detailed-futuristic-robotic-spider-with-sleek-metallic-limbs-glowing-red-eyes-and-intricate-mechanical-joints-Its-body-is-adorned-with-cables-pistons-and-small-energy-cores-giving-it-a-cybernetic-hightech-appearance-The-spider-moves-with-eerie-precision-its-legs-clicking-against-the-ground-as-it-navigates-a-dark-industrial-environment-filled-with-smoke-and-flickering-neon-lights-v2-0194ec8e-10e2-7a69-9d8f-19bab3900f2f',
                glbUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/Public%20Models/spider.glb',
                centerBottom: true
            }
        ]
    };
    ns.state.models.data = ns.staticModels.data;

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

})(app);
