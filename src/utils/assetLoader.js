const JSON_DIRECTORY = '/src/components/json/';
const CACHE_NAME = 'game-assets-v1';

// This will hold the list of all asset URLs to be downloaded.
let allAssetUrls = [];

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
        return;
    }
    
    console.log(`Starting to cache ${allAssetUrls.length} assets...`);
    
    try {
        const cache = await caches.open(CACHE_NAME);
        let downloadedCount = 0;
        const totalAssets = allAssetUrls.length;
        
        // This function will be called to update progress.
        const updateProgress = () => {
            downloadedCount++;
            if (onProgress) {
                const progress = Math.round((downloadedCount / totalAssets) * 100);
                onProgress(progress);
            }
        };

        // We process downloads in batches to avoid overwhelming the browser.
        const batchSize = 10;
        for (let i = 0; i < totalAssets; i += batchSize) {
            const batch = allAssetUrls.slice(i, i + batchSize);
            await Promise.all(batch.map(async (url) => {
                try {
                    const cachedResponse = await cache.match(url);
                    if (!cachedResponse) {
                        // Use a 'no-cors' request to bypass CORS errors for cross-domain assets.
                        // The response will be "opaque", but it can still be cached and used by loaders like GLTFLoader.
                        const request = new Request(url, { mode: 'no-cors' });
                        const response = await fetch(request);
                        if (!response.ok && response.type !== 'opaque') { // Opaque responses have status 0 and ok=false, so we allow them.
                            throw new Error(`Fetch failed with status: ${response.status}`);
                        }
                        
                        await cache.put(url, response);
                        console.log(`Cached new asset: ${url.split('/').pop()}`);
                    } else {
                        // Uncomment the line below for extremely verbose logging of already-cached assets
                        // console.log(`Asset already in cache: ${url.split('/').pop()}`);
                    }
                } catch (error) {
                    console.error(`Failed to cache asset: ${url}`, error);
                } finally {
                    updateProgress();
                }
            }));
        }
        
        console.log('All assets have been processed for caching.');
        
    } catch (error) {
        console.error('Error opening cache or caching assets:', error);
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