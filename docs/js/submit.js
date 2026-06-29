const API = 'https://gemspot-production.up.railway.app/api';
let selectedLat = null;
let selectedLng = null;
let marker = null;

// Check login
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token) {
  window.location.href = 'login.html';
}

// Update navbar
if (user) {
  const navLogin = document.getElementById('nav-login');
  const navLogout = document.getElementById('nav-logout');
  if (navLogin) navLogin.style.display = 'none';
  if (navLogout) navLogout.style.display = 'inline';
}

// Initialize submit map
const map = L.map('submitmap').setView([29.3956, 71.6836], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Click to pin location
map.on('click', function(e) {
  selectedLat = e.latlng.lat.toFixed(6);
  selectedLng = e.latlng.lng.toFixed(6);

  // Remove old marker
  if (marker) map.removeLayer(marker);

  // Add new marker
  marker = L.marker([selectedLat, selectedLng]).addTo(map);

  // Show coordinates
  document.getElementById('coords-display').style.display = 'block';
  document.getElementById('lat-display').textContent = selectedLat;
  document.getElementById('lng-display').textContent = selectedLng;
});

// Submit spot
async function submitSpot() {
  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value;
  const mood = document.getElementById('mood').value;
  const address = document.getElementById('address').value.trim();

  if (!name) return showError('Please enter a spot name');
  if (!description) return showError('Please add a description');
  if (!selectedLat || !selectedLng) return showError('Please pin the location on the map');

  try {
    const res = await fetch(`${API}/spots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name, description, category,
        mood, address,
        lat: parseFloat(selectedLat),
        lng: parseFloat(selectedLng)
      })
    });

    const data = await res.json();
    if (!res.ok) return showError(data.message || 'Failed to submit spot');

    showSuccess('🎉 Gem dropped! Redirecting to map...');
    setTimeout(() => window.location.href = 'index.html', 2000);
  } catch (err) {
    showError('Server not reachable. Make sure backend is running.');
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

function showSuccess(msg) {
  const el = document.getElementById('success-msg');
  el.textContent = msg;
  el.style.display = 'block';
}