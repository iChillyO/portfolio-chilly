import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://Chilly:a0zp8pHa446RuthN@chillyportfillo.zdpwqci.mongodb.net/?appName=ChillyPortfillo";

async function testConnection() {
  console.log('Attempting to connect to:', MONGODB_URI.replace(/:([^@]+)@/, ':****@'));

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('SUCCESS: Connected to MongoDB!');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('FAILURE: Could not connect to MongoDB');
    console.error(error);
  }
}

testConnection();
