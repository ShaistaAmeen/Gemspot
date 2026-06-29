const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://ShaistaAmeen.github.io',
    'https://shaistaameen.github.io'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/spots', require('./routes/spots'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'GemSpot API is running!' });
});

// Keep server awake — ping every 14 minutes
const https = require('https');
setInterval(() => {
  https.get('https://gemspot-production.up.railway.app', (res) => {
    console.log('Server pinged — staying awake');
  }).on('error', (err) => {
    console.log('Ping error:', err.message);
  });
}, 14 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GemSpot server running on port ${PORT}`);
});