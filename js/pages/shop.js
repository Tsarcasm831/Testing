import { app } from "../app.js";
(function(ns) {
    'use strict';

    ns.pages = ns.pages || {};

    function initShopPage() {
        ns.ui.setupTooltipAnimation();
    }

    Object.assign(ns.pages, { initShopPage });
}(app));
