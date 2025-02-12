import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: {
        required: true,
        type: String,
        unique: true,
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: {
        type: String,
        required: true,
    },
    channelLogo: {
        type: String,
        required: true,
    },
    channelBanner: {
        type: String,
        required: true,
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }]
}, { timestamps: true });


// created channel model for channels

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
