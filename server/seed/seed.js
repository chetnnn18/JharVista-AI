require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Place = require('../models/Place');
const District = require('../models/District');
const Reel = require('../models/Reel');
const { districts, places, reels, users } = require('./seedData');

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Place.deleteMany(),
      District.deleteMany(),
      Reel.deleteMany(),
    ]);

    console.log('Cleared existing data...');

    const createdUsers = await User.create(users);
    const admin = createdUsers.find((u) => u.role === 'admin');
    const explorer = createdUsers.find((u) => u.email === 'explorer@jharyatra.ai');

    await District.insertMany(districts);
    console.log(`Seeded ${districts.length} districts`);

    const placesWithExplorer = places.map((p) => {
      if (p.hiddenGem) {
        return { ...p, explorerId: explorer._id, approved: true };
      }
      return { ...p, approved: true };
    });
    await Place.insertMany(placesWithExplorer);
    console.log(`Seeded ${places.length} places`);

    const reelsData = reels.map((r) => ({
      ...r,
      explorerId: explorer._id,
      approved: true,
    }));
    await Reel.insertMany(reelsData);
    console.log(`Seeded ${reels.length} reels`);

    console.log('\n--- Seed Complete ---');
    console.log('Admin: admin@jharyatra.ai / admin123');
    console.log('Explorer: explorer@jharyatra.ai / explorer123');
    console.log('Tourist: tourist@jharyatra.ai / tourist123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
