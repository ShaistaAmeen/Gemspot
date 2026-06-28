const API = 'https://your-railway-url.railway.app/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

// Redirect if not logged in
if (!token || !user) {
  window.location.href = 'login.html';
}

// Fill profile info
document.getElementById('profile-name').textContent = user.name;
document.getElementById('profile-email').textContent = user.email;
document.getElementById('profile-badge').innerHTML =
  `<i class="fas fa-medal"></i> ${user.badge || 'New Scout'}`;

// Badge system
const badgeRules = [
  { id: 'newscout',   icon: '🌱', name: 'New Scout',     desc: 'Joined GemSpot',          min: 0  },
  { id: 'firstgem',  icon: '💎', name: 'First Gem',     desc: 'Dropped your first spot',  min: 1  },
  { id: 'explorer',  icon: '🧭', name: 'Explorer',      desc: 'Dropped 3 spots',          min: 3  },
  { id: 'scout',     icon: '⭐', name: 'Scout',         desc: 'Dropped 5 spots',          min: 5  },
  { id: 'gemhunter', icon: '🏆', name: 'Gem Hunter',    desc: 'Dropped 10 spots',         min: 10 },
];

// Load user spots
async function loadProfile() {
  try {
    const res = await fetch(`${API}/spots`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const allSpots = await res.json();

    // Filter user's own spots
    const mySpots = allSpots.filter(s =>
      s.submittedBy?._id === user.id ||
      s.submittedBy?.id === user.id
    );

    const totalVotes = mySpots.reduce((sum, s) => sum + (s.votes || 0), 0);

    // Update stats
    document.getElementById('spots-count').textContent = mySpots.length;
    document.getElementById('votes-count').textContent = totalVotes;

    // Render badges
    renderBadges(mySpots.length);

    // Render gems
    renderGems(mySpots);

  } catch (err) {
    console.error('Could not load profile:', err);
  }
}

function renderBadges(spotsCount) {
  const grid = document.getElementById('badges-grid');
  let earned = 0;
  grid.innerHTML = badgeRules.map(badge => {
    const unlocked = spotsCount >= badge.min;
    if (unlocked) earned++;
    return `
      <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-emoji">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
        ${!unlocked ? `<div class="badge-lock">🔒 Drop ${badge.min} gems</div>` : ''}
      </div>
    `;
  }).join('');
  document.getElementById('badge-count').textContent = earned;
}

function renderGems(spots) {
  const grid = document.getElementById('gems-grid');
  if (spots.length === 0) {
    grid.innerHTML = `
      <div class="no-gems">
        <i class="fas fa-map-marker-alt"></i>
        <p>You haven't dropped any gems yet!</p>
        <a href="submit.html" class="btn-primary" style="text-decoration:none;display:inline-flex;margin-top:1rem;">
          <i class="fas fa-plus"></i> Drop Your First Gem
        </a>
      </div>
    `;
    return;
  }

  const emojiMap = {
    cafe:'☕', viewpoint:'🌄',
    food:'🍜', bookshop:'📚', other:'✨'
  };

  grid.innerHTML = spots.map(spot => `
    <div class="gem-card">
      <div class="gem-emoji">${emojiMap[spot.category] || '✨'}</div>
      <div class="gem-info">
        <h4>${spot.name}</h4>
        <p>${spot.description}</p>
        <div class="gem-meta">
          <span class="gem-category">${spot.category}</span>
          <span class="gem-votes">⬆️ ${spot.votes} votes</span>
        </div>
      </div>
    </div>
  `).join('');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

loadProfile();