import mongoose from "mongoose";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ success: false, message: "video title is required" });
    }

    if (!req.body.thumbnailUrl) {
        return res.status(400).json({ success: false, message: "video thumbnail is required" });
    }
    if (!req.body.category) {
        return res.status(400).json({ success: false, message: "video category is required" });
    }
    if (!req.body.videoUrl) {
        return res.status(400).json({ success: false, message: "video url is required" });
    }
    if (!req.body.description) {
        return res.status(400).json({ success: false, message: "video description is required" });
    }
    if (!req.body.channelId) {
        return res.status(400).json({ success: false, message: "channel is required" });
    }
    if (!req.body.uploader) {
        return res.status(400).json({ success: false, message: "video author is required" });
    }

    const { title, thumbnailUrl, videoUrl, description, category, channelId, uploader } = req.body;


    try {
        const user = await User.findById(uploader);
        const channel = await Channel.findById(channelId);
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" });
        }
        if (!channel) {
            return res.status(400).json({ success: false, message: "create a channel before video upload" })
        }

        if (channel.owner.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "unauthorised access : channel & user not match" })
        }
        const video = await Video.create({ title, thumbnailUrl, videoUrl, description, category, channelId, uploader });

        channel.videos.push(video._id);
        await channel.save();

        res.status(201).json({ success: true, message: "video uploaded", video });

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "server error" })
    }
}


export const getAllVideos = async (req, res) => {
    try {
        const result = await Video.find();
        if (!result || result.length < 1) {
            return res.status(404).json({ success: false, message: "videos not found" });
        }
        res.status(200).json({ success: true, videos: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}

export const searchVideo = async (req, res) => {
    const { searchVideo } = req.params;
    try {
        const result = await Video.find({
            title: { $regex: searchVideo, $options: "i" }
        });
        if (!result || result.length < 1) {
            return res.status(404).json({ success: false, message: "No video matched your search" });
        }
        res.status(200).json({ success: true, videos: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}

export const getSingleVideo = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid video" });
    }
    const id = req.params.id;

    try {
        const result = await Video.findById(id);

        if (!result) {
            return res.status(404).json({ success: false, message: "video not found" });
        }
        await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        res.status(200).json({ success: true, video: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}

export const getSingleChannelVideos = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid video" });
    }

    const cId = req.params.id;

    try {
        const result = await Video.find({ channelId: cId });
        if (!result || result.length < 1) {
            return res.status(404).json({ success: false, message: "videos not found" });
        }
        res.status(200).json({ success: true, videos: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}


export const likeVideo = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid video" });
    }

    if (!mongoose.isValidObjectId(req.body.uId)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const vId = req.params.id;
    const userId = req.body.uId;
    try {
        const video = await Video.findById(vId);
        if (!video) {
            return res.status(404).json({ success: false, message: "video not found" });
        }
        video.dislikes = video?.dislikes?.filter((item) => item.toString() !== userId)
        if (video?.likes?.includes(userId)) {
            video.likes = video.likes.filter((item) => item.toString() !== userId);
        } else {
            video.likes.push(userId);
        }

        await video.save();
        res.status(200).json({ success: true, message: "video liked", video: video })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}


export const disLikeVideo = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid video" });
    }

    if (!mongoose.isValidObjectId(req.body.uId)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const vId = req.params.id;
    const userId = req.body.uId;

    try {
        const video = await Video.findById(vId);
        if (!video) {
            return res.status(404).json({ success: false, message: "video not found" });
        }
        video.likes = video.likes.filter((item) => item.toString() !== userId)

        if (video.dislikes.includes(userId)) {
            video.dislikes = video.dislikes.filter((item) => item.toString() !== userId);
        } else {

            video.dislikes.push(userId);
        }
        await video.save();

        res.status(200).json({ success: true, message: "video disliked", video: video })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}




export const updateVideo = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid video" });
    }

    if (!mongoose.isValidObjectId(req.params.cId)) {
        return res.status(400).json({ success: false, message: "invalid channel" });
    }
    if (!mongoose.isValidObjectId(req.params.uId)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const vId = req.params.id;
    const cId = req.params.cId;
    const userId = req.params.uId;
    try {
        const video = await Video.findById(vId);
        if (!video) {
            return res.status(404).json({ success: false, message: "video not found" });
        }

        if (video.uploader.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "unauthorised access" })
        }

        const result = await Video.findByIdAndUpdate(vId, req.body, { new: true });

        res.status(200).json({ success: true, video: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}

export const deleteVideo = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid video" });
    }

    if (!mongoose.isValidObjectId(req.params.cId)) {
        return res.status(400).json({ success: false, message: "invalid channel" });
    }
    if (!mongoose.isValidObjectId(req.params.uId)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const vId = req.params.id;
    const cId = req.params.cId;
    const userId = req.params.uId;

    try {
        const video = await Video.findById(vId);
        if (!video) {
            return res.status(404).json({ success: false, message: "video not found" });
        }

        if (video.uploader.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "unauthorised access" })
        }

        const result = await Video.findByIdAndDelete(vId);
        await Channel.findByIdAndUpdate(cId, { $pull: { videos: vId } });

        res.status(200).json({ success: true, message: "video deleted successfully", video: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}




