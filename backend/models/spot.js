const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['cafe', 'viewpoint', 'food', 'bookshop', 'other'],
    default: 'other'
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  photo: { type: String, default: '' },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  votes: { type: Number, default: 0 },
  votedBy: [{ type: String }],
  mood: { type: String, default: 'chill' }
}, { timestamps: true });

module.exports = mongoose.model('Spot', spotSchema);