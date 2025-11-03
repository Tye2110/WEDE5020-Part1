// map.js
// Interactive map centered in Centurion, Gauteng, South Africa.

//  Initialize the map centered on Centurion 
const centurionCoords = [-25.8721, 28.1570]; // Centurion, Gauteng
const map = L.map('map').setView(centurionCoords, 13);

//  Adds OpenStreetMap tiles 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

//  locations around Centurion 
const locations = [
  {
    title: "Head Office (Centurion Mall)",
    description: "Located inside Centurion Mall — open Mon–Fri, 9am–5pm.",
    coords: [-25.8595, 28.1890]
  },
  {
    title: "Warehouse (Lyttelton)",
    description: "Secure storage and distribution center.",
    coords: [-25.8478, 28.2101]
  },
  {
    title: "Training Centre (Irene)",
    description: "Customer training and workshops held weekly.",
    coords: [-25.8925, 28.2220]
  }
];

//  Adds markers for each location 
const markersGroup = L.featureGroup().addTo(map);

locations.forEach(loc => {
  const marker = L.marker(loc.coords)
    .bindPopup(`<strong>${escapeHtml(loc.title)}</strong><br>${escapeHtml(loc.description)}`);
  marker.addTo(markersGroup);
});

//  Button: Show all markers 
document.getElementById('fitAllBtn').addEventListener('click', () => {
  if (locations.length === 0) return;
  map.fitBounds(markersGroup.getBounds(), { padding: [50, 50] });
});

//  Button: Locate me (uses browser geolocation) 
document.getElementById('locateBtn').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    if (window.__userMarker) {
      window.__userMarker.setLatLng([userLat, userLng]);
    } else {
      window.__userMarker = L.circleMarker([userLat, userLng], {
        radius: 8,
        fillColor: '#007BFF',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9
      }).addTo(map).bindPopup('You are here');
    }

    map.setView([userLat, userLng], 14);
    window.__userMarker.openPopup();
  }, error => {
    alert('Could not get your location: ' + error.message);
  });
});

// Utility: escape HTML for safe popup rendering 
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
