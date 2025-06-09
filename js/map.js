import { initMapBase } from "./mapBase.js";
import { initGridOverlay } from "./grid.js";
import { initGeoLocation } from "./geolocation.js";
import { initMarkerWithAddress } from "./markerWithAddress.js";
import { initTerraIncognita } from "./terraIncognita.js";
import { initWestOverlay } from "./westOverlay.js";
import { initEastOverlay } from "./eastOverlay.js";
import { initDMZOverlay } from "./dmzOverlay.js";
import { getFictionalLocationName } from "./fictionalLocation.js";

function initMap() {
  const map = initMapBase();
  initGeoLocation(map);
  initMarkerWithAddress(map);
  const gridSystem = initGridOverlay(map); 
  initTerraIncognita(map);
  initWestOverlay(map);
  initEastOverlay(map);
  initDMZOverlay(map);

  // Show coordinates and address on double-click
  map.on('dblclick', async (e) => {
    const { lat, lng } = e.latlng;
    if (window.DEV_MODE) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const address = data.display_name || 'Address not found';
        console.log('Double-click address:', address);
        L.popup()
          .setLatLng([lat, lng])
          .setContent(`<b>Coordinates:</b> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br><b>Address:</b> ${address}`)
          .openOn(map);
      } catch (err) {
        console.error('Reverse geocoding failed:', err);
        L.popup()
          .setLatLng([lat, lng])
          .setContent(`<b>Coordinates:</b> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br><b>Address lookup failed.</b>`)
          .openOn(map);
      }
    } else {
      const fakeAddress = getFictionalLocationName(lat, lng);
      L.popup()
        .setLatLng([lat, lng])
        .setContent(`<b>Coordinates:</b> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br><b>Location:</b> ${fakeAddress}`)
        .openOn(map);
    }
  });

  return { map, gridSystem }; 
}

export { initMap };