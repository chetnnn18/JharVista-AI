const express = require('express');
const {
  getPlaces,
  getPlaceById,
  createPlace,
  approvePlace,
  getPendingPlaces,
} = require('../controllers/placeController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', getPlaces);
router.get('/pending/all', protect, authorize('admin'), getPendingPlaces);
router.get('/:id', getPlaceById);
router.post(
  '/',
  protect,
  authorize('explorer', 'admin'),
  upload.array('images', 5),
  createPlace
);
router.put('/:id/approve', protect, authorize('admin'), approvePlace);

module.exports = router;
