import debug from "debug"
import userModel from "../models/userModel.js";
import channelModel from "../models/channelModel.js";
import mongoose from "mongoose";
import messageModel from "../models/messageModel.js";

const log = debug("development:channelControllers");

export const getAllCandidatesForChannel = async (req, res) => {
    try {
        const admin = await userModel.findById(req.id)
            .populate([
                {
                    path: "shortlistedCandidates.user",
                    select: "fullName username profilePicture"
                },
                {
                    path: "likedCandidates.user",
                    select: "fullName username profilePicture"
                },

            ]);

        const combined = admin.shortlistedCandidates.concat(admin.likedCandidates);


        const shortlistedCandidatesData = combined.filter(
            (item, index, self) =>
                index === self.findIndex(
                    (other) => String(other.user._id) === String(item.user._id)
                )
        );

        return res.status(200).json({
            shortlistedCandidatesData
        });



    } catch (err) {
        log("error in getting all the contacts for channel: ", err.message);
        return res.status(500).send("Internal server error ");
    }
}

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;

        if (!name || !members) {
            return res.status(400).send("channel name and members are required");
        }

        const channel = await channelModel.create({ name, members, admin: req.id });
        await channel.populate("members admin", "fullName profilePicture");
        return res.status(201).json({
            channel
        });
    } catch (err) {
        log("error in getting all the contacts for channel: ", err.message);
        return res.status(500).send("Internal server error ");
    }

}

export const getAllChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.id);


        const channels = await channelModel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).populate([{
            path: "members admin",
            select: "fullName profilePicture"
        },
        {
            path: "messages",
            populate: {
                path: "sender",
                select: "fullName profilePicture"
            }
        }]

        ).sort({ updatedAt: -1 });


        return res.status(200).json({
            channels
        });
    } catch (err) {
        log("error in getting all the channels : ", err.message);
        return res.status(500).send("Internal server error ");
    }
}

export const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await channelModel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "fullName profilePicture"
            }
        });

        if (!channel) {
            return res.status(404).send("Channel not found");
        }

        return res.status(200).json({
            messages: channel.messages
        });
    } catch (err) {
        log("error in get channel messages ", err.message);
        return res.status(500).send("Internal server error ");
    }
}

export const removeCandidate = async (req, res) => {
    try {
        const { channelId, memberId, memberLength } = req.body;

        if (!channelId || !memberId || !memberLength) {
            return res.status(400).send("Channel Id , member Id and member length are required");
        }

        if (memberLength > 1) {
            const channel = await channelModel.findByIdAndUpdate(
                channelId,
                { $pull: { members: memberId } },
                { new: true }
            ).populate("members admin","fullName profilePicture");
            return res.status(200).json({
                channel
            });
        } else {
            await channelModel.findByIdAndDelete(channelId);
            return res.status(200).send("Channel deleted successfully");
        }

    } catch (err) {
        log("error in removing the candidate : ", err.message);
        return res.status(500).send("Internal server error ");
    }
}