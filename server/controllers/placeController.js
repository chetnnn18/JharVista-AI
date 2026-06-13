const Place = require('../models/Place');
const { uploadToCloudinary } = require('../middleware/upload');

const getPlaces = async (req, res) => {
  const { category, district, search, hiddenGem } = req.query;
  const filter = { approved: true };

  if (category) filter.category = category;
  if (district) filter.district = new RegExp(district, 'i');
  if (hiddenGem === 'true') filter.hiddenGem = true;
  if (search) {
    filter.$text = { $search: search };
  }

  const places = await Place.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: places.length, data: places });
};

const getPlaceById = async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    return res.status(404).json({ success: false, message: 'Place not found' });
  }
  res.json({ success: true, data: place });
};

const createPlace = async (req, res) => {
  const body = { ...req.body };
  body.explorerId = req.user._id;
  body.explorerName = req.user.name;
  body.hiddenGem = true;
  body.approved = req.user.role === 'admin';

  if (req.files?.length) {
    const urls = [];
    for (const file of req.files) {
      try {
        const result = await uploadToCloudinary(file.buffer);
        urls.push(result.secure_url);
      } catch {
        /* skip failed uploads */
      }
    }
    body.images = urls;
  }

  if (typeof body.nearbyPlaces === 'string') {
    body.nearbyPlaces = JSON.parse(body.nearbyPlaces);
  }
  if (typeof body.coordinates === 'string') {
    body.coordinates = JSON.parse(body.coordinates);
  }

  const place = await Place.create(body);
  res.status(201).json({ success: true, data: place });
};

const approvePlace = async (req, res) => {
  const place = await Place.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true }
  );
  if (!place) {
    return res.status(404).json({ success: false, message: 'Place not found' });
  }
  res.json({ success: true, data: place });
};

const getPendingPlaces = async (req, res) => {
  const places = await Place.find({ approved: false }).sort({ createdAt: -1 });
  res.json({ success: true, data: places });
};

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  approvePlace,
  getPendingPlaces,
};
