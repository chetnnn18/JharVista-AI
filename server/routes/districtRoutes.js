const express = require('express');
const { getDistricts, getDistrictById } = require('../controllers/districtController');

const router = express.Router();

router.get('/', getDistricts);
router.get('/:id', getDistrictById);

module.exports = router;
