import { app } from "../app.js";
(function(ns) {
    'use strict';

    ns.pages = ns.pages || {};

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

    Object.assign(ns.pages, { initEnigmaticVisitorPage });
}(app));
