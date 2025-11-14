import mongoose from 'mongoose';

beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa_tracker_test';
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clean up after each test if needed
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
