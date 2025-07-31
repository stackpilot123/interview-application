import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false // beacause i can send message to myself there will be no receiver there and 
        // in channels there will not be a single receiver 
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    timestamp: {
        type: Date,
        default: Date.now

    },
    isSeen: {
        type: Boolean,
        default: false
    },
    fileType: {
        type: String,
        enum: ["image", "file"],
        required: function () {
            return this.messageType === "file";
        }
    }
});

export default mongoose.model("message", messageSchema);