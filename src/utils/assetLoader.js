const JSON_DIRECTORY = '/src/components/json/';
const CACHE_NAME = 'game-assets-v1';

// This will hold the list of all asset URLs to be downloaded.
let allAssetUrls = [];
// Tuning knobs
const BATCH_SIZE = 10;
const MAX_RETRIES = 2; // in addition to the first attempt => total attempts = 3
const RETRY_DELAY_MS = 600;

// Small helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Fetch with retry and CORS-friendly settings. Accepts opaque responses.
async function fetchWithRetry(url) {
    let lastError;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const req = new Request(url, { mode: 'no-cors' });
            const res = await fetch(req);
            // Accept opaque (CORS-bypassed) or ok responses
            if (res.ok || res.type === 'opaque') return res;
            lastError = new Error(`HTTP ${res.status}`);
        } catch (e) {
            lastError = e;
        }
        if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
    throw lastError || new Error('Unknown fetch error');
}

/**
 * Fetches and parses a JSON file to get a list of asset URLs.
 * @param {string} jsonFileName - The name of the JSON file in the JSON_DIRECTORY.
 * @returns {Promise<string[]>} A promise that resolves with an array of URLs.
 */
async function getAssetUrlsFromJson(jsonFileName) {
    try {
        const response = await fetch(`${JSON_DIRECTORY}${jsonFileName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${jsonFileName}: ${response.statusText}`);
        }
        const data = await response.json();
        // Assuming the JSON format is { "files": ["url1", "url2", ...] }
        return data.files || [];
    } catch (error) {
        console.error(`Error loading asset list from ${jsonFileName}:`, error);
        return [];
    }
}

/**
 * Initializes the asset loader by collecting all asset URLs from all JSON files in the directory.
 * This function needs to know which JSON files to look for. Since we can't read a directory listing
 * from the browser, we'll have to hardcode the list for now.
 */
export async function initializeAssetLoader() {
    // Hardcoded list of JSON files to check.
    const jsonFiles = ['kakashiAnimations.json']; 
    
    console.log('Initializing asset loader...');
    
    const urlPromises = jsonFiles.map(file => getAssetUrlsFromJson(file));
    const urlArrays = await Promise.all(urlPromises);
    
    // Flatten the array of arrays into a single array of URLs and remove duplicates
    allAssetUrls = [...new Set(urlArrays.flat())];
    
    console.log(`Found ${allAssetUrls.length} unique assets to potentially download.`);
}


/**
 * Starts the process of downloading and caching all the assets.
 * @param {function(number): void} [onProgress] - Optional callback to report progress (0 to 100).
 * @returns {Promise<void>} A promise that resolves when all assets have been processed.
 */
export async function startCaching(onProgress) {
    if (allAssetUrls.length === 0) {
        console.warn('Asset list is empty. Calling initializeAssetLoader() first.');
        await initializeAssetLoader();
    }
    
    if (allAssetUrls.length === 0) {
        console.error('Still no assets to cache after initialization.');
        if (onProgress) onProgress(100);
        return { total: 0, cached: 0, skippedExisting: 0, failed: [] };
    }
    
    console.log(`Starting to cache ${allAssetUrls.length} assets...`);
    
    try {
        const cache = await caches.open(CACHE_NAME);
        let processedCount = 0;
        const totalAssets = allAssetUrls.length;
        let skippedExisting = 0;
        let cached = 0;
        const failed = [];
        
        // This function will be called to update progress.
        const updateProgress = () => {
            processedCount++;
            if (onProgress) {
                const progress = Math.round((processedCount / totalAssets) * 100);
                onProgress(progress);
            }
        };

        // We process downloads in batches to avoid overwhelming the browser.
        for (let i = 0; i < totalAssets; i += BATCH_SIZE) {
            const batch = allAssetUrls.slice(i, i + BATCH_SIZE);
            const results = await Promise.allSettled(batch.map(async (url) => {
                const cachedResponse = await cache.match(url);
                if (cachedResponse) {
                    skippedExisting++;
                    return { url, status: 'skipped' };
                }
                const response = await fetchWithRetry(url);
                await cache.put(url, response);
                cached++;
                return { url, status: 'cached' };
            }));

            // progress + aggregate failures
            for (let idx = 0; idx < results.length; idx++) {
                const r = results[idx];
                if (r.status === 'rejected') {
                    const url = batch[idx];
                    failed.push(url);
                }
                updateProgress();
            }
        }
        
        if (failed.length) {
            console.warn(`Caching complete with some failures. Cached: ${cached}, skipped: ${skippedExisting}, failed: ${failed.length}`);
            // Log a compact list once to reduce spam
            console.warn('Failed asset URLs (showing up to 20):', failed.slice(0, 20));
        } else {
            console.log(`Caching complete. Cached: ${cached}, skipped: ${skippedExisting}, failed: 0`);
        }

        return { total: totalAssets, cached, skippedExisting, failed };
    } catch (error) {
        console.error('Error opening cache or caching assets:', error);
        return { total: allAssetUrls.length, cached: 0, skippedExisting: 0, failed: allAssetUrls.slice() };
    }
}

/**
 * A utility function to check if all assets are cached.
 * @returns {Promise<boolean>} True if all assets are in the cache, false otherwise.
 */
export async function areAllAssetsCached() {
    if (allAssetUrls.length === 0) {
        await initializeAssetLoader();
    }
    
    if (allAssetUrls.length === 0) {
        return true; // No assets to cache.
    }

    const cache = await caches.open(CACHE_NAME);
    const cachedRequests = await cache.keys();
    const cachedUrls = new Set(cachedRequests.map(req => req.url));

    for (const url of allAssetUrls) {
        if (!cachedUrls.has(url)) {
            // console.log(`Asset not found in cache: ${url}`);
            return false;
        }
    }

    return true;
}