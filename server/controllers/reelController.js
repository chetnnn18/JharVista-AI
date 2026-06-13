const Reel = require('../models/Reel');
const { uploadToCloudinary } = require('../middleware/upload');

const getReels = async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { approved: true };
  const reels = await Reel.find(filter)
    .populate('explorerId', 'name profileImage instagram explorerVerified')
    .populate('placeId', 'name district')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: reels.length, data: reels });
};

const createReel = async (req, res) => {
  const body = { ...req.body, explorerId: req.user._id };
  body.approved = req.user.role === 'admin';

  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      body.thumbnail = result.secure_url;
    } catch {
      /* use default */
    }
  }

  const reel = await Reel.create(body);
  const populated = await Reel.findById(reel._id).populate(
    'explorerId',
    'name profileImage instagram explorerVerified'
  );
  res.status(201).json({ success: true, data: populated });
};

const approveReel = async (req, res) => {
  const reel = await Reel.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  if (!reel) {
    return res.status(404).json({ success: false, message: 'Reel not found' });
  }
  res.json({ success: true, data: reel });
};

const getPendingReels = async (req, res) => {
  const reels = await Reel.find({ approved: false })
    .populate('explorerId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reels });
};

module.exports = { getReels, createReel, approveReel, getPendingReels };
