const District = require('../models/District');

const getDistricts = async (req, res) => {
  const districts = await District.find().sort({ touristPlaces: -1 });
  res.json({ success: true, count: districts.length, data: districts });
};

const getDistrictById = async (req, res) => {
  const district = await District.findById(req.params.id);
  if (!district) {
    return res.status(404).json({ success: false, message: 'District not found' });
  }
  res.json({ success: true, data: district });
};

module.exports = { getDistricts, getDistrictById };
