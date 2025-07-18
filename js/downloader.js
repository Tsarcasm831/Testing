/* @tweakable The number of assets to download in parallel. */
const MAX_PARALLEL_DOWNLOADS = 5;

export class Downloader {
  async download(url, progressCallback) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    const contentLength = parseInt(response.headers.get('Content-Length')) || 0;
    const reader = response.body.getReader();
    let received = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (progressCallback && contentLength) {
        progressCallback(received / contentLength);
      }
    }
    return new Blob(chunks);
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
            const blob = await this.download(asset.url, p => {
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