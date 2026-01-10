/**
 * Database Configuration
 * Re-export from mongodb.js for backward compatibility
 */
import connectDB, { mongodbConfig, getConnectionStatus } from './mongodb.js';

export default connectDB;
export { mongodbConfig, getConnectionStatus };

