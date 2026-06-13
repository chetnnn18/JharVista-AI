const express = require('express');
const { generateTrip, getMyTrips } = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/generate-trip', generateTrip);
router.get('/my-trips', protect, getMyTrips);

module.exports = router;
