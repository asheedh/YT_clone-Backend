import mongoose from "mongoose";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

export const createChannel = async (req, res) => {
    // Checking for all required fields
    const { channelName, owner, description, channelLogo, channelBanner } = req.body;

    if (!channelName || !owner || !description || !channelLogo || !channelBanner) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const ownerMatch = await User.findById(owner);
        const channelMatch = await Channel.findOne({ channelName });

        if (!ownerMatch) {
            return res.status(403).json({ success: false, message: "Invalid user" });
        }

        if (channelMatch) {
            return res.status(400).json({ success: false, message: "Channel name already taken" });
        }

        // Check if the user already has a channel
        if (ownerMatch.channel) {
            return res.status(400).json({ success: false, message: "User can only have one channel" });
        }

        // Create the channel
        const channel = await Channel.create({ channelName, owner, description, channelLogo, channelBanner });

        // Update user with the new channel ID
        ownerMatch.channel = channel._id;
        await ownerMatch.save();

        // Fetch updated user details
        const updatedUser = await User.findById(owner);

        res.status(201).json({
            success: true,
            message: "Channel created successfully",
            channel,
            updatedUser, // Send updated user object
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// controller for get all channels

export const getAllChannels = async (req, res) => {
    try {
        const result = await Channel.find();
        if (!result || result.length < 1) {
            return res.status(404).json({ success: false, message: "channels not found" });
        }
        res.status(200).json({ success: true, channels: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}

// controller for getting specific channel

export const getSpecificChannel = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid object id" });
    }

    const id = req.params.id;
    try {
        const result = await Channel.findById(id);
        if (!result || result.length < 1) {
            return res.status(404).json({ success: false, message: "channel not found" });
        }
        res.status(200).json({ success: true, channel: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}


// controller for getting multiple channel

export const getmultipleChannels = async (req, res) => {

    if (!req.body.channel) {
        return res.status(400).json({ success: false, message: "channel ids is required" });
    }
    const ids = req.body.channel;


    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid channel IDs array" });
    }


    let objectIds = ids.filter((item) => mongoose.isValidObjectId(item)).map((item) => new mongoose.Types.ObjectId(item));

    if (objectIds.length <= 0) {
        return res.status(400).json({ success: false, message: "invalid channel" });
    }
    try {

        const result = await Channel.find({ _id: { $in: objectIds } });

        if (result.length < 1) {
            return res.status(404).json({ success: false, message: "channels not found" });
        }
        res.status(200).json({ success: true, channels: result, message: result.length < 1 ? "no channels found" : "channels found" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}


// controller for update channel

export const updateChannel = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid channel" });
    }

    if (!mongoose.isValidObjectId(req.params.uId)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const cId = req.params.id;
    const userId = req.params.uId;
    try {
        const channel = await Channel.findById(cId);
        if (!channel) {
            return res.status(404).json({ success: false, message: "channel not found" });
        }

        if (channel.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "unauthorised access" })
        }

        const result = await Channel.findByIdAndUpdate(cId, req.body, { new: true });

        res.status(200).json({ success: true, channel: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}


// controller for subscribe channel

export const subscribeChannel = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid channel" });
    }

    if (!mongoose.isValidObjectId(req.params.uId)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const cId = req.params.id;
    const userId = req.params.uId;

    try {
        const channel = await Channel.findById(cId);
        const user = await User.findById(userId);
        if (!channel) {
            return res.status(404).json({ success: false, message: "channel not found" });
        }
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }

        if (channel?.subscribers?.includes(userId)) {
            channel.subscribers = channel.subscribers?.filter((item) => item.toString() !== userId)
            user.subscriptions = user.subscriptions?.filter((item) => item.toString() !== cId)
        } else {
            channel?.subscribers?.push(userId);
            user?.subscriptions?.push(cId);
        }
        await user.save();
        await channel.save();

        res.status(200).json({ success: true, message: "channel subscribed", user: user, channel: channel })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}

// controller for getting delete channel

export const deleteChannel = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid channel" });
    }

    if (!mongoose.isValidObjectId(req.params.uId)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const cId = req.params.id;
    const userId = req.params.uId;
    try {
        const channel = await Channel.findById(cId);
        if (!channel) {
            return res.status(404).json({ success: false, message: "channel not found" });
        }
        if (channel.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "unauthorised access" })
        }
        const result = await Channel.findByIdAndDelete(cId);
        await User.findByIdAndUpdate(userId, { $pull: { channel: cId } });

        res.status(200).json({ success: true, message: "channel deleted successfully", channel: result })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}
