import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    video: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Video"
    },
}, { timestamps: true })


// created comment model for comments

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;