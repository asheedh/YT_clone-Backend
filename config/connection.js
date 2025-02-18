import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "youtubeClone",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Database Connected Successfully`);

        // Handle MongoDB connection events
        mongoose.connection.on("disconnected", () => console.log("MongoDB Disconnected"));
        mongoose.connection.on("error", (err) => console.error("MongoDB Connection Error:", err));
    } catch (err) {
        console.error("Connection failed:", err);
        process.exit(1);
    }
};

// Close MongoDB connection on process exit
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
});

connectDB();
