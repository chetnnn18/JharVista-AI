const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    budget: { type: String, required: true },
    days: { type: Number, required: true },
    interests: [{ type: String }],
    startingDistrict: { type: String, required: true },
    generatedPlan: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
