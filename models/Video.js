import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    views: {
        type: Number,
        default: 1000,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Travel",
            "Fitness",
            "Education",
            "Movies",
            "Food",
            "Automobile",
            "Songs",
            "Finance",
            "Gaming",
            "Technology",
            "Entertainment",
            "Anime",
        ],
    },
    uploadedDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
    }],
}, { timestamps: true });

// created video model for videos
const Video = mongoose.model("Video", videoSchema);
export default Video;
