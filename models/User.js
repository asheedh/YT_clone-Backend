import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    subscriptions: [{
        type: mongoose.Types.ObjectId,
        ref: "Channel",
    }],

    channel: {
        type: mongoose.Types.ObjectId,
        ref: "Channel",
    }
}, { timestamps: true })

// created user model for users

const User = mongoose.model("User", UserSchema);
export default User;
