import userModel from "../models/userModel.js";
import debug from "debug";
import messageModel from '../models/messageModel.js';
import mongoose from "mongoose";
import cloudinary from "../config/cloudinaryConfig.js";

const log = debug("development:chatController");

export const searchContacts = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (searchTerm === undefined || searchTerm === null) {
            return res.status(400).send("Serch term is required ");
        }

        const user = await userModel.findById(req.id)
            .populate([
                {
                    path: "shortlistedCandidates.user",
                    select: "fullName email username backstory powers weakness keyBattles teams combatStyle preferredRole profilePicture"
                },
                {
                    path: "likedCandidates.user",
                    select: "fullName email username backstory powers weakness keyBattles teams combatStyle preferredRole profilePicture"
                },
                {
                    path: "shortlistedCandidates.jobs.job",
                    select: "title description"
                },
                {
                    path: "likedCandidates.jobs.job",
                    select: "title description"
                }
            ]);

        const liked = user.likedCandidates.map((item) => {
            return {
                user: {
                    ...item.user.toJSON(),
                    isLiked: true,
                },
                jobs: item.jobs,
                _id: item._id
            };
        });
        let data = [...user.shortlistedCandidates, ...liked];


        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizedSearchTerm, "i");

        data = data.filter((item) => regex.test(item.user.fullName) || regex.test(item.user.username) || regex.test(item.user.email)
        )
        return res.status(200).json({
            candidates: data
        })

    } catch (err) {
        log("error in searching the candidates : ", err.message);
        return res.status(500).send("Internal server error ");
    }

}

export const getMessages = async (req, res) => {
    try {

        const user1 = req.id;
        const user2 = req.body.receiverId;

        if (!user1 || !user2) {
            return res.status(400).send("Both user id's are required");
        }

        const messages = await messageModel.find({
            $or: [
                { sender: user1, receiver: user2 }, { sender: user2, receiver: user1 }
            ]
        }).sort({ timestamp: 1 }).populate({
            path: "sender receiver",
            select: "fullName profilePicture"
        });

        return res.status(200).json({
            messages
        });
    } catch (err) {
        log("error in getting the messages: ", err.message);
        return res.status(500).send("Internal server error");
    }
}

export const getContactsForDmList = async (req, res) => {
    try {
        let userId = req.id;
        userId = new mongoose.Types.ObjectId(userId);

        const allContactsData = await messageModel.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                },
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    latestMessage: { $first: "$content" },
                    latestMessageTime: { $first: "$timestamp" },
                    totalUnreadMessages: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$isSeen", false] },
                                        { $eq: ["$receiver", userId] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    latestMessage: 1,
                    latestMessageTime: 1,
                    totalUnreadMessages: 1,
                    fullName: "$contactInfo.fullName",
                    username: "$contactInfo.username",
                    profilePicture: "$contactInfo.profilePicture"
                }
            },
            {
                $sort: { latestMessageTime: -1 }
            }
        ]);

        return res.status(200).json({
            contacts: allContactsData
        })
    } catch (err) {
        log("error in getting all conatacts : ", err.message);
        return res.status(500).send("Internal server error ");
    }



}

export const markMessagesAsSeen = async (req, res) => {
    try {
        const user1 = req.id;
        const user2 = req.body.anotherUserId;

        if (!user2) {
            return res.status(400).send("another user id is required");
        }
        await messageModel.updateMany(
            { isSeen: false, sender: user2, receiver: user1 },
            { $set: { isSeen: true } }
        );

        return res.status(200).send("Marked messages as seen successfull");
    } catch (err) {
        log("error in marking the messages as seen: ",err.message);
        return res.status(500).send("Internal server error ");
    }

}

export const messageFileUpload = async(req,res) =>{
    try{
        if(!req.file){
            return res.status(400).send("File is required");
        }

        const fileStr = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${fileStr}`;

        const result = await cloudinary.uploader.upload(dataUri,{
            resource_type: "auto",
            folder: "wmc-chat"
        });

        return res.status(200).json({
            url: result.secure_url
        });
        
    } catch(err){
        log("error in uploading the message file: ",err.message);
        return res.status(500).send("Internal server error");
    }
}