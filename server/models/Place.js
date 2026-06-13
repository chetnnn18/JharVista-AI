const mongoose = require('mongoose');

const nearbyPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  distance: { type: String, required: true },
});

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Waterfalls',
        'Forests & Wildlife',
        'Hills & Valleys',
        'Temples',
        'Tribal Culture',
        'Adventure Trails',
        'Sports',
        'Heritage',
        'Other',
      ],
      required: true,
    },
    description: { type: String, default: '' },
    images: [{ type: String }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    bestTime: { type: String, default: 'October - March' },
    hiddenGem: { type: Boolean, default: false },
    approved: { type: Boolean, default: true },
    nearbyPlaces: [nearbyPlaceSchema],
    explorerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    explorerName: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

placeSchema.index({ name: 'text', district: 'text', description: 'text' });

module.exports = mongoose.model('Place', placeSchema);
