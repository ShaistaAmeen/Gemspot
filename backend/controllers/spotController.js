const Spot = require('../models/Spot');

exports.getSpots = async (req, res) => {
  try {
    const spots = await Spot.find().populate('submittedBy', 'name badge');
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSpot = async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id).populate('submittedBy', 'name badge');
    if (!spot) return res.status(404).json({ message: 'Spot not found' });
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSpot = async (req, res) => {
  try {
    const { name, description, category, lat, lng, address, mood } = req.body;
    if (!name || !description || !lat || !lng) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    const spot = await Spot.create({
      name, description, category,
      location: { lat, lng, address },
      mood,
      submittedBy: req.user._id
    });
    const User = require('../models/user');
    await User.findByIdAndUpdate(req.user._id, { $inc: { spotsCount: 1 } });
    res.status(201).json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.voteSpot = async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Spot not found' });

    const alreadyVoted = spot.votedBy && spot.votedBy.includes(req.user._id.toString());
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted for this spot' });
    }

    spot.votes += 1;
    spot.votedBy = spot.votedBy || [];
    spot.votedBy.push(req.user._id.toString());
    await spot.save();
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSpot = async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Spot not found' });
    if (spot.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await spot.deleteOne();
    res.json({ message: 'Spot removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};