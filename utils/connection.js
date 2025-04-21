const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
let MONGO_URL=process.env.MONGO_DB_URL;



//set database connection 

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL,{
            bufferCommands:false,
            autoIndex:false,
        });
        console.log("MongoDB have been connected");
    } catch (error) {
        console.log("error connecting to MongoDB");
        
    }
}

module.exports = connectDB