import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
// connection function for connecting to database 
const connectDB = async () => {
    try {

        let connection = await mongoose.connect(process.env.MONGO_URI, { dbName: "youtubeClone" });
        if (connection) {
            console.log("DataBase Connected Succesfully")
        }
    } catch (err) {
        console.log("connection failed with error : " + err);
    }
}
// calling the cnnecton function
connectDB();