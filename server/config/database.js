const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kiran-portfolio';
        
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`
📊 MongoDB Connected Successfully!
    
🔗 Host: ${conn.connection.host}
📚 Database: ${conn.connection.name}
🚀 Status: ${conn.connection.readyState === 1 ? 'Connected' : 'Connecting...'}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
    `);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📊 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    return conn;

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
        
    // In development, provide more detailed error information
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
          
      // Common connection issues and solutions
      if (error.message.includes('ECONNREFUSED')) {
        console.log(`
🔧 Connection Refused - Possible Solutions:
    
1. Make sure MongoDB is running locally:
   - macOS: brew services start mongodb-community
   - Linux: sudo systemctl start mongod
   - Windows: net start MongoDB
    
2. Check if MongoDB is installed:
   - Download from: https://www.mongodb.com/try/download/community
    
3. Verify connection string in .env file:
   MONGODB_URI=mongodb://localhost:27017/kiran-portfolio
        `);
      }
          
      if (error.message.includes('authentication failed')) {
        console.log(`
🔐 Authentication Failed - Check your credentials:
    
1. Verify username and password in connection string
2. Ensure user has proper permissions
3. For MongoDB Atlas, check network access settings
        `);
      }
    }

    // Exit process in production, retry in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    }
  }
};

// Health check function
const checkDBHealth = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
      
  return {
    status: states[state],
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    collections: Object.keys(mongoose.connection.collections).length
  };
};

// Database cleanup function
const cleanupOldData = async () => {
  try {
    const Contact = require('../models/Contact');
        
    // Remove contacts older than 1 year (optional)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
    const result = await Contact.deleteMany({
      timestamp: { $lt: oneYearAgo },
      status: 'archived'
    });
        
    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} old archived contacts`);
    }
  } catch (error) {
    console.error('Error during data cleanup:', error);
  }
};

// Run cleanup weekly (if needed)
if (process.env.NODE_ENV === 'production') {
  setInterval(cleanupOldData, 7 * 24 * 60 * 60 * 1000); // 7 days
}

module.exports = connectDB;
module.exports.checkDBHealth = checkDBHealth;
module.exports.cleanupOldData = cleanupOldData;