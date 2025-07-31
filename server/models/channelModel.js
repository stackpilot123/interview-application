import mongoose from "mongoose";


const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message",
            required: false
        }
    ],
}, { timestamps: true });

export default mongoose.model("channel", channelSchema);