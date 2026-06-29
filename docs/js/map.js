const API = 'https://gemspot-production.up.railway.app/api';

var map = L.map('gemmap').setView([29.3956, 71.6836], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

var markers = [];
var emojiMap = {
  cafe: '☕', viewpoint: '🌄',
  food: '🍜', bookshop: '📚', other: '✨'
};

function makeIcon(emoji) {
  return L.divIcon({
    html: '<div style="background:#0F7B6C;color:white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white;"><span style="transform:rotate(45deg)">' + emoji + '</span></div>',
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
}

function loadSpots(category) {
  category = category || 'all';
  fetch(API + '/spots')
    .then(function(res) { return res.json(); })
    .then(function(spots) {
      markers.forEach(function(m) { map.removeLayer(m.marker); });
      markers = [];

      var filtered = category === 'all'
        ? spots
        : spots.filter(function(s) { return s.category === category; });

      filtered.forEach(function(spot) {
        var emoji = emojiMap[spot.category] || '✨';
        var marker = L.marker(
          [spot.location.lat, spot.location.lng],
          { icon: makeIcon(emoji) }
        ).addTo(map);

        marker.bindPopup(
  '<div style="font-family:Segoe UI,sans-serif;min-width:200px;max-width:250px;">' +
  '<strong style="color:#0F7B6C;font-size:1rem;">' + emoji + ' ' + spot.name + '</strong>' +
  '<p style="margin:6px 0 4px;font-size:0.85rem;color:#3D5A6A;">' + spot.description + '</p>' +
  '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">' +
  '<span style="background:#C8EDE8;color:#0F7B6C;padding:2px 8px;border-radius:999px;font-size:0.75rem;">' + spot.category + '</span>' +
  '<span style="font-size:0.75rem;color:#7B9BAB;">👤 ' + (spot.submittedBy ? spot.submittedBy.name : 'Scout') + '</span>' +
  '</div>' +
  '<button id="vote-' + spot._id + '" onclick="voteSpot(\'' + spot._id + '\', this)" style="margin-top:10px;width:100%;padding:8px;background:#0F7B6C;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;display:block;">⬆️ Upvote (' + spot.votes + ')</button>' +
  '</div>',
  { maxWidth: 300, minWidth: 200 }
);

        markers.push({ marker: marker, category: spot.category });
      });
    })
    .catch(function() {
      loadSampleSpots();
    });
}

function voteSpot(id, btn) {
  var token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to vote!');
    window.location.href = 'login.html';
    return;
  }
  fetch(API + '/spots/' + id + '/vote', {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(function(res) {
    return res.json().then(function(data) {
      return { status: res.status, data: data };
    });
  })
  .then(function(result) {
    if (result.status === 400) {
      btn.textContent = '✓ Already voted!';
      btn.style.background = '#7B9BAB';
      btn.disabled = true;
      return;
    }
    if (result.status === 200) {
      btn.textContent = '⬆️ Upvoted (' + result.data.votes + ')';
      btn.style.background = '#14A68E';
      btn.disabled = true;
    }
  })
  .catch(function(err) {
    console.error('Vote failed:', err);
  });
}

function filterSpots(category) {
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  loadSpots(category);
}

function loadSampleSpots() {
  var spots = [
    { lat: 29.3956, lng: 71.6836, name: "Hidden Rooftop Café", category: "cafe", desc: "Best sunset view in the city.", emoji: "☕" },
    { lat: 29.3980, lng: 71.6900, name: "Old Bazaar Bookshop", category: "bookshop", desc: "100-year-old shop with rare Urdu literature.", emoji: "📚" },
    { lat: 29.3920, lng: 71.6780, name: "Noor Mahal Viewpoint", category: "viewpoint", desc: "Best spot to photograph Noor Mahal.", emoji: "🌄" }
  ];
  spots.forEach(function(spot) {
    L.marker([spot.lat, spot.lng], { icon: makeIcon(spot.emoji) })
      .addTo(map)
      .bindPopup('<strong>' + spot.emoji + ' ' + spot.name + '</strong><p>' + spot.desc + '</p>');
  });
}

loadSpots();