require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const districtRoutes = require('./routes/districtRoutes');
const reelRoutes = require('./routes/reelRoutes');
const tripRoutes = require('./routes/tripRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

connectDB();
configureCloudinary();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'JharYatra AI API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`JharYatra AI server running on port ${PORT}`);
});
