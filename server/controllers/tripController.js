const Trip = require('../models/Trip');
const { generateTripPlan } = require('../utils/gemini');

const generateTrip = async (req, res) => {
  const { budget, days, interests, startingDistrict } = req.body;

  if (!budget || !days || !interests?.length || !startingDistrict) {
    return res.status(400).json({
      success: false,
      message: 'budget, days, interests, and startingDistrict are required',
    });
  }

  const generatedPlan = await generateTripPlan({
    budget,
    days: Number(days),
    interests: Array.isArray(interests) ? interests : [interests],
    startingDistrict,
  });

  const tripData = {
    budget,
    days: Number(days),
    interests: Array.isArray(interests) ? interests : [interests],
    startingDistrict,
    generatedPlan,
  };

  if (req.user) {
    tripData.userId = req.user._id;
    await Trip.create(tripData);
  }

  res.json({ success: true, data: generatedPlan });
};

const getMyTrips = async (req, res) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: trips });
};

module.exports = { generateTrip, getMyTrips };
