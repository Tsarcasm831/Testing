import { app } from './app.js';

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

})(app);
