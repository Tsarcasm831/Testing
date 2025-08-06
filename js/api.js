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
        // Replace the values below with your own websim profile information.
        // The username will be used to fetch projects and likes automatically.
        const myProfile = {
            _type: "user",
            // You can find your user ID in the URL of your websim profile page.
            id: "YOUR_WEBSIM_USER_ID",
            username: "YourWebsimUsername",
            // This can be a link to your avatar or left as null.
            avatar_url: "https://images.websim.com/avatar/YourWebsimUsername",
            // This description supports Markdown.
            description: "This is a sample description. I create amazing things with code and sound. Welcome to my digital domain.",
            is_admin: false,
        };

        return Promise.resolve(myProfile);
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

    const fetchComments = async (projectId, after = null) => {
        const endpoint = `/projects/${projectId}/comments?first=10${after ? `&after=${after}` : ''}`;
        // Not caching comments as they are frequently updated.
        const data = await fetchAPI(endpoint);
        return data?.comments || { data: [], meta: { has_next_page: false } };
    };

    ns.api = { getCreator, fetchProjects, fetchLikes, fetchComments };

})(app);