import { initMapBase } from "./mapBase.js";
import { initGridOverlay } from "./grid.js";
import { initGeoLocation } from "./geolocation.js";
import { initMarkerWithAddress } from "./markerWithAddress.js";
import { getFictionalLocationName } from "./fictionalLocation.js";
import { initTerraIncognita } from "./terraIncognita.js";
import { initWestOverlay } from "./westOverlay.js";
import { initEastOverlay } from "./eastOverlay.js";
import { initDMZOverlay } from "./dmzOverlay.js";

function initMap() {
  const map = initMapBase();
  initGeoLocation(map);
  initMarkerWithAddress(map);
  const gridSystem = initGridOverlay(map); 
  initTerraIncognita(map);
  initWestOverlay(map);
  initEastOverlay(map);
  initDMZOverlay(map);

  // Show coordinates and fictional location on double-click
  map.on('dblclick', async (e) => {
    const { lat, lng } = e.latlng;
    const locationName = getFictionalLocationName(lat, lng);
    L.popup()
      .setLatLng([lat, lng])
      .setContent(`<b>Coordinates:</b> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br><b>Location:</b> ${locationName}`)
      .openOn(map);
  });

  return { map, gridSystem }; 
}

export { initMap };