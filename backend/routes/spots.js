const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const {
  getSpots,
  getSpot,
  createSpot,
  voteSpot,
  deleteSpot
} = require('../controllers/spotController');

router.get('/', getSpots);
router.get('/:id', getSpot);
router.post('/', protect, createSpot);
router.put('/:id/vote', protect, voteSpot);
router.delete('/:id', protect, deleteSpot);

module.exports = router;