export async function cacheAssetLists(listUrls) {
  const cache = await caches.open('asset-lists');
  for (const url of listUrls) {
    let response = await cache.match(url);
    if (!response) {
      response = await fetch(url);
      if (response.ok) {
        cache.put(url, response.clone());
      } else {
        console.error(`Failed to fetch ${url}: ${response.status}`);
        continue;
      }
    }
    await response.json(); // warm up by reading
  }
}
