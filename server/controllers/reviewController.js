const Review = require('../models/Review');
const Place = require('../models/Place');

const createReview = async (req, res) => {
  const { placeId, rating, comment } = req.body;

  const existing = await Review.findOne({ userId: req.user._id, placeId });
  if (existing) {
    return res.status(400).json({ success: false, message: 'You already reviewed this place' });
  }

  const review = await Review.create({
    userId: req.user._id,
    placeId,
    rating,
    comment,
  });

  const reviews = await Review.find({ placeId });
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Place.findByIdAndUpdate(placeId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
  });

  const populated = await Review.findById(review._id).populate('userId', 'name profileImage');
  res.status(201).json({ success: true, data: populated });
};

const getPlaceReviews = async (req, res) => {
  const reviews = await Review.find({ placeId: req.params.placeId })
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
};

module.exports = { createReview, getPlaceReviews };
