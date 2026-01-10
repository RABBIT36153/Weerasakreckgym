import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MongoDB Configuration
 * จัดการการตั้งค่าและการเชื่อมต่อฐานข้อมูล MongoDB
 */
const mongodbConfig = {
  // MongoDB Connection URI
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/muaythai',
  
  // Connection Options
  options: {
    // Connection Pool Settings
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'), // Maximum number of connections in the pool
    minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5'), // Minimum number of connections in the pool
    
    // Timeout Settings
    serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000'), // How long to try selecting a server (ms)
    socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'), // How long a send or receive on a socket can take before timeout (ms)
    connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT || '10000'), // How long to wait for initial connection (ms)
    
    // Retry Settings
    retryWrites: process.env.MONGODB_RETRY_WRITES !== 'false', // Enable retryable writes
    retryReads: process.env.MONGODB_RETRY_READS !== 'false', // Enable retryable reads
    
    // Buffer Settings
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
    
    // Write Concern
    writeConcern: {
      w: 'majority', // Write concern: wait for majority of replicas
      j: true, // Journal write concern
      wtimeout: 10000 // Write concern timeout
    },
    
    // Authentication (if using username/password)
    // authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',
    
    // Read Preference
    readPreference: process.env.MONGODB_READ_PREFERENCE || 'primary', // 'primary', 'primaryPreferred', 'secondary', 'secondaryPreferred', 'nearest'
    
    // SSL/TLS (for MongoDB Atlas)
    // ssl: process.env.MONGODB_SSL === 'true',
    // sslValidate: process.env.MONGODB_SSL_VALIDATE !== 'false',
    
    // Other Options
    family: 4, // Use IPv4, skip trying IPv6
  }
};

/**
 * Connect to MongoDB
 * @returns {Promise<mongoose.Connection>} MongoDB connection instance
 */
const connectDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', true); // Suppress deprecation warning
    
    // Connect to MongoDB
    const conn = await mongoose.connect(mongodbConfig.uri, mongodbConfig.options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Set up event handlers
    setupEventHandlers(conn);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure MongoDB is running and the connection string is correct');
    
    // Retry connection after 5 seconds
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(() => {
      connectDB();
    }, 5000);
    
    throw error;
  }
};

/**
 * Setup MongoDB connection event handlers
 * @param {mongoose.Connection} conn - MongoDB connection instance
 */
const setupEventHandlers = (conn) => {
  // Connection successful
  conn.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB');
  });
  
  // Connection error
  conn.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
  });
  
  // Connection disconnected
  conn.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected from MongoDB');
  });
  
  // Process termination handlers
  process.on('SIGINT', async () => {
    await gracefulShutdown('SIGINT');
  });
  
  process.on('SIGTERM', async () => {
    await gracefulShutdown('SIGTERM');
  });
};

/**
 * Graceful shutdown of MongoDB connection
 * @param {string} signal - Process signal
 */
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing MongoDB connection gracefully...`);
  
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
};

/**
 * Get MongoDB connection status
 * @returns {Object} Connection status information
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  
  return {
    readyState: mongoose.connection.readyState,
    state: states[mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    isConnected: mongoose.connection.readyState === 1
  };
};

// Export configuration and functions
export default connectDB;
export { mongodbConfig, getConnectionStatus };

