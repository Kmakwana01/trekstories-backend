// Set MONGO_URI for E2E tests to prevent wiping development database
process.env.MONGO_URI = 'mongodb://localhost:27017/travel_test';
