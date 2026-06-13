const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    instagramLink: { type: String, required: true },
    placeName: { type: String, default: '' },
    location: { type: String, default: '' },
    explorerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reel', reelSchema);
