import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Database connected');
            }
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 5000,
        })
    } catch (error) {
        console.error('Database connection failed');
        process.exit(1);
    }
}

export default connectDB;
