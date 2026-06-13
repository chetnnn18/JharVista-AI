const express = require('express');
const { createReview, getPlaceReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/place/:placeId', getPlaceReviews);
router.post('/', protect, createReview);

module.exports = router;
