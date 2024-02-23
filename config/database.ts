import mongoose from 'mongoose';

const connectDB = async (mongodbURI: string) => {
    try {
        await mongoose.connect(mongodbURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
