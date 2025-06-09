import { showPopup } from "./surveyPointPopup.js";
import { showStreetViewPanel } from "./streetview.js";
import { openCamera } from "./camera.js";
import { getFictionalLocationName } from "./fictionalLocation.js";

export function addMarkerWithAddress(lat, lng, map) {
  const icon = L.icon({
    iconUrl:
      "https://storage.ning.com/topology/rest/1.0/file/get/12762356261?profile=RESIZE_584x",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const marker = L.marker([lat, lng], { icon }).addTo(map);
  if (window.DEV_MODE) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((res) => res.json())
      .then((data) => {
        const address = data.display_name;
        console.log('Marker address:', address);
        marker
          .bindPopup(`
            <b>Address:</b> ${address}<br>
            <button class="sidebar-button" onclick="showPopup(${lat}, ${lng}, '${address.replace(/'/g, "\\'")}')">Add a Point Here</button>
            <button class="sidebar-button" onclick="showStreetViewPanel(${lat}, ${lng})">View Street View</button>
            <button class="camera-btn" onclick="openCamera(${lat}, ${lng})">📷 Take Photo</button>
          `)
          .openPopup();
      })
      .catch((err) => console.error('Error reverse-geocoding:', err));
  } else {
    const address = getFictionalLocationName(lat, lng);
    marker
      .bindPopup(`
        <b>Location:</b> ${address}<br>
        <button class="sidebar-button" onclick="showPopup(${lat}, ${lng}, '${address.replace(/'/g, "\\'")}')">Add a Point Here</button>
        <button class="sidebar-button" onclick="showStreetViewPanel(${lat}, ${lng})">View Street View</button>
        <button class="camera-btn" onclick="openCamera(${lat}, ${lng})">📷 Take Photo</button>
      `)
      .openPopup();
  }
}

export function initMarkerWithAddress(map) {
  window.addMarkerWithAddress = (lat, lng) => addMarkerWithAddress(lat, lng, map);
}