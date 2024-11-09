import mongoose from "mongoose";


const MONGDO_DB = process.env.MONGODB_URI
const connectDB = async() => {
    try{
        mongoose.connect(MONGDO_DB, {
            dbName: "mongodb",
        })
        console.log('MongoDB connected.');
    }
    catch(err) {
        console.log(err.message, 'Mongoose is not connected');
        process.exit(1);
    }
}

export default connectDB;
