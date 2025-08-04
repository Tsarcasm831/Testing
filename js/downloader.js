/* @tweakable The number of assets to download in parallel. Higher values may cause timeouts on slower connections. */
const MAX_PARALLEL_DOWNLOADS = 5;
/* @tweakable The name of the cache storage for downloaded assets. */
const ASSET_CACHE_NAME = 'game-assets-v1';

export class Downloader {
  async download(url, progressCallback) {
    const cache = await caches.open(ASSET_CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
        if (progressCallback) progressCallback(1);
        return cachedResponse.blob();
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const contentLength = response.headers.get('Content-Length');
    if (!contentLength || !response.body) {
      // If we don't know the size, or there's no body, we can't report progress.
      if (progressCallback) progressCallback(0.5); // Indeterminate progress
      const blob = await response.blob();
      if (progressCallback) progressCallback(1);
      return blob;
    }

    const total = parseInt(contentLength, 10);
    let loaded = 0;
    const chunks = [];
    const reader = response.body.getReader();

    while (true) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        loaded += value.length;
        if (progressCallback) {
          progressCallback(loaded / total);
        }
      } catch (error) {
        console.error(`Error reading stream for ${url}:`, error);
        throw error;
      }
    }

    const blob = new Blob(chunks);
    const responseToCache = new Response(blob, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    });
    cache.put(url, responseToCache);

    return blob;
  }

  async preloadAssets(assets, progressCallback, overallProgressCallback) {
    const results = {};
    const queue = [...assets];
    let completedCount = 0;
    const totalCount = assets.length;

    const worker = async () => {
      while (queue.length > 0) {
        const asset = queue.shift();
        if (asset) {
          try {
            const blob = await this.download(asset.url, (p) => {
              if (progressCallback) progressCallback(asset, p);
            });
            results[asset.name] = blob;
          } catch (error) {
            console.error(`Failed to download ${asset.name}:`, error);
            // Optionally, handle the error, e.g., by pushing it to an errors array
          } finally {
            completedCount++;
            if(overallProgressCallback) {
              overallProgressCallback(completedCount / totalCount);
            }
          }
        }
      }
    };

    const workers = [];
    for (let i = 0; i < Math.min(MAX_PARALLEL_DOWNLOADS, assets.length); i++) {
      workers.push(worker());
    }

    await Promise.all(workers);
    return results;
  }
}