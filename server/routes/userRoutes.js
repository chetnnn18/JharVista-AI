const express = require('express');
const {
  getUsers,
  updateUserRole,
  getDashboardStats,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/stats', getDashboardStats);
router.put('/:id', updateUserRole);

module.exports = router;
