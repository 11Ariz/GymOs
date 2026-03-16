import 'dotenv/config.js';
import mongoose from 'mongoose';
import User from './models/User.js';

const seedSuperadmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in your .env file!');
      console.error('Please add it and try again.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    const adminEmail = '11arizpc@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('⚠️ Superadmin account already exists!');
      process.exit(0);
    }

    // Default password for the master account
    const superadmin = await User.create({
      email: adminEmail,
      password: 'AdminPassword123!',
      role: 'SUPERADMIN',
      gymName: 'GymOS Central'
    });

    console.log('🎉 Superadmin account successfully created!');
    console.log(`Email: ${superadmin.email}`);
    console.log('Password: AdminPassword123!');
    console.log('Please login and change this password immediately.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedSuperadmin();
