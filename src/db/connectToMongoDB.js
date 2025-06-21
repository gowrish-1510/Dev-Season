import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectToMongoDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("MongoDB successfully connected!");
    }

    catch(err){
        console.error("Error while connecting to Database: ",err);
    }
}

export default connectToMongoDB;