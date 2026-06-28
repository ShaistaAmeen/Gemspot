const API = 'http://localhost:5000/api';

// ── REGISTER ──
async function registerUser() {
  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm-password')?.value;

  // Basic validation
  if (!email || !password) return showError('Please fill all fields');
  if (confirm && password !== confirm) return showError('Passwords do not match');
  if (password.length < 6) return showError('Password must be at least 6 characters');

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) return showError(data.message || 'Registration failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showSuccess('Account created! Redirecting...');
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (err) {
    showError('Server not reachable. Make sure backend is running.');
  }
}

// ── LOGIN ──
async function loginUser() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) return showError('Please fill all fields');

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return showError(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showSuccess('Welcome back, Scout! Redirecting...');
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (err) {
    showError('Server not reachable. Make sure backend is running.');
  }
}

// ── HELPERS ──
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