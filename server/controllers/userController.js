const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
};

const updateUserRole = async (req, res) => {
  const { role, explorerVerified } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, explorerVerified },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
};

const getDashboardStats = async (req, res) => {
  const Place = require('../models/Place');
  const Reel = require('../models/Reel');
  const District = require('../models/District');
  const Trip = require('../models/Trip');

  const [users, places, reels, districts, trips, pendingPlaces, pendingReels] =
    await Promise.all([
      User.countDocuments(),
      Place.countDocuments({ approved: true }),
      Reel.countDocuments({ approved: true }),
      District.countDocuments(),
      Trip.countDocuments(),
      Place.countDocuments({ approved: false }),
      Reel.countDocuments({ approved: false }),
    ]);

  res.json({
    success: true,
    data: {
      users,
      places,
      reels,
      districts,
      trips,
      pendingPlaces,
      pendingReels,
      explorers: await User.countDocuments({ role: 'explorer' }),
    },
  });
};

module.exports = { getUsers, updateUserRole, getDashboardStats };
