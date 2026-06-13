const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    touristPlaces: { type: Number, default: 0 },
    culturalPlaces: { type: Number, default: 0 },
    hiddenGems: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('District', districtSchema);
