const express = require('express');
const {
  getReels,
  createReel,
  approveReel,
  getPendingReels,
} = require('../controllers/reelController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', getReels);
router.get('/pending/all', protect, authorize('admin'), getPendingReels);
router.post('/', protect, authorize('explorer', 'admin'), upload.single('thumbnail'), createReel);
router.put('/:id/approve', protect, authorize('admin'), approveReel);

module.exports = router;
