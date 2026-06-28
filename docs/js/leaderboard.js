const API = 'http://localhost:5000/api';

const badgeRules = [
  { icon: '🌱', name: 'New Scout',  min: 0  },
  { icon: '💎', name: 'First Gem',  min: 1  },
  { icon: '🧭', name: 'Explorer',   min: 3  },
  { icon: '⭐', name: 'Scout',      min: 5  },
  { icon: '🏆', name: 'Gem Hunter', min: 10 },
];

function getBadge(count) {
  let badge = badgeRules[0];
  badgeRules.forEach(b => { if (count >= b.min) badge = b; });
  return badge;
}

async function loadLeaderboard() {
  try {
    const res = await fetch(`${API}/spots`);
    const spots = await res.json();

    // Group spots by user
    const scoutMap = {};
    spots.forEach(spot => {
      if (!spot.submittedBy) return;
      const id = spot.submittedBy._id;
      const name = spot.submittedBy.name;
      if (!scoutMap[id]) {
        scoutMap[id] = { name, gems: 0, votes: 0 };
      }
      scoutMap[id].gems++;
      scoutMap[id].votes += spot.votes || 0;
    });

    // Sort by gems then votes
    const scouts = Object.values(scoutMap)
      .sort((a, b) => b.gems - a.gems || b.votes - a.votes);

    renderPodium(scouts);
    renderTable(scouts);

  } catch (err) {
    console.error('Could not load leaderboard:', err);
    document.getElementById('leaderboard-list').innerHTML =
      '<p style="text-align:center;padding:2rem;color:#7B9BAB;">No scouts yet. Be the first!</p>';
  }
}

function renderPodium(scouts) {
  const podium = document.getElementById('podium');
  const top3 = scouts.slice(0, 3);
  const order = [1, 0, 2]; // 2nd, 1st, 3rd display order
  const medals = ['🥇', '🥈', '🥉'];
  const heights = ['120px', '160px', '90px'];

  podium.innerHTML = order.map(i => {
    const scout = top3[i];
    if (!scout) return '<div class="podium-slot empty"></div>';
    const badge = getBadge(scout.gems);
    return `
      <div class="podium-slot rank-${i + 1}">
        <div class="podium-medal">${medals[i]}</div>
        <div class="podium-name">${scout.name}</div>
        <div class="podium-gems">${scout.gems} gems</div>
        <div class="podium-block" style="height:${heights[i]}">
          <span>${i + 1}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderTable(scouts) {
  const list = document.getElementById('leaderboard-list');
  if (scouts.length === 0) {
    list.innerHTML = '<p style="text-align:center;padding:2rem;color:#7B9BAB;">No scouts yet. Be the first!</p>';
    return;
  }

  list.innerHTML = scouts.map((scout, i) => {
    const badge = getBadge(scout.gems);
    const isTop = i < 3;
    return `
      <div class="table-row ${isTop ? 'top-row' : ''}">
        <span class="rank-num">${i + 1}</span>
        <span class="scout-name">
          <div class="scout-avatar">${scout.name.charAt(0).toUpperCase()}</div>
          ${scout.name}
        </span>
        <span class="gems-count">💎 ${scout.gems}</span>
        <span class="votes-count">⬆️ ${scout.votes}</span>
        <span class="badge-tag">${badge.icon} ${badge.name}</span>
      </div>
    `;
  }).join('');
}

loadLeaderboard();