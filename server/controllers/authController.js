const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const allowedRoles = ['tourist', 'explorer'];
  const userRole = allowedRoles.includes(role) ? role : 'tourist';

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    explorerVerified: userRole === 'explorer',
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      explorerVerified: user.explorerVerified,
      token: generateToken(user._id),
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      explorerVerified: user.explorerVerified,
      token: generateToken(user._id),
    },
  });
};

const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = { registerUser, loginUser, getMe };
