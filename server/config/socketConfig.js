import { Server as SocketIOServer } from 'socket.io';
import messageModel from '../models/messageModel.js';
import channelModel from '../models/channelModel.js';

const setUpSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    const userSocketMap = new Map();
    const socketUserMap = new Map();

    let onlineUsers = [];
    let lastSeenData = {};

    const disconnect = (socket) => {
        const userId = socketUserMap.get(socket.id);

        if (userId) {
            userSocketMap.delete(userId);
            socketUserMap.delete(socket.id);
            onlineUsers = onlineUsers.filter((id) => id !== userId);
            lastSeenData[userId] = new Date();
            io.emit("updateOnlineUserData", { onlineUsers, lastSeenData });
        }

        console.log(`User disconnected with socketId: ${socket.id}`);
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const receiverSocketId = userSocketMap.get(message.receiver);

        const createdMessage = await messageModel.create(message);

        const messageData = await messageModel.findById(createdMessage._id)
            .populate("sender", "fullName profilePicture")
            .populate("receiver", "fullName profilePicture");
        console.log(messageData)
        io.emit("triggerRender");
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }

    }

    const sendChannelMessage = async (data) => {
        const createdMessage = await messageModel.create(data.channelMessageData);

        const messageData = await messageModel.findById(createdMessage._id)
            .populate("sender", "fullName profilePicture");

        const channel = await channelModel.findByIdAndUpdate(data.channelId, {
            $push: { messages: createdMessage._id }
        }, { new: true })
            .populate("members", "fullName profilePicture");

        const finalData = { ...messageData._doc, channelId: channel._id }

        if (channel && channel.members) {
            io.to(data.channelId).emit("recieveChannelMessage", finalData);
        }

        io.emit("triggerRenderChannel");

    }

    const joinUserSocketToChannels = async (userId, socket) => {
        const userChannels = await channelModel.find({
            $or: [{ admin: userId }, { members: userId }]
        });

        userChannels.forEach((channel) => {
            socket.join(channel._id.toString());
            // console.log(userId,"joined to this channel : ",channel._id);
        })
    }
    io.on("connection", (socket) => {

        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            socketUserMap.set(socket.id, userId);
            if (!onlineUsers.includes(userId)) {
                onlineUsers.push(userId);
            }
            if (lastSeenData.hasOwnProperty(userId)) {
                delete lastSeenData[userId];
            }

            joinUserSocketToChannels(userId, socket);
            console.log(`User connected: ${userId} with socket id: ${socket.id}`);
        } else {
            console.log("User id not provided at the time of the connection");
        }

        io.emit("onlineUserData", { onlineUsers, lastSeenData });
        socket.on("sendMessage", sendMessage);
        socket.on("sendChannelMessage", sendChannelMessage);

        socket.on("typing", (data) => {
            socket.to(userSocketMap.get(data.anotherUserId)).emit("triggerTyping");
        })
        socket.on("stopTyping", (data) => {
            socket.to(userSocketMap.get(data.anotherUserId)).emit("triggerStopTyping");
        })
        socket.on("typingChannel", (data) => {
            //data --> cintaines channel id and userinfo (the user who is typing)
            socket.to(data.channelId).emit("triggerTypingChannel", data);
        })
        socket.on("stopTypingChannel", (data) => {
            socket.to(data.channelId).emit("triggerStopTypingChannel", data);
        })


        // video call all sockets here 

        // Handle initiating a call
        socket.on('initiateCall', (data) => {
            const recipientSocket = findSocketByUserId(data.recipientId);

            if (recipientSocket) {
                // Send call notification to recipient
                recipientSocket.emit('incomingCall', {
                    callerId: socket.userId, // Assuming you store userId on socket
                    callerName: data.callerName,
                    callerPicture: data.callerPicture,
                    roomId: data.roomId
                });
            } else {
                // Recipient is offline
                socket.emit('callFailed', { reason: 'User is offline' });
            }
        });

        // Handle accepting call
        socket.on('acceptCall', (data) => {
            const callerSocket = findSocketByUserId(data.callerId);

            if (callerSocket) {
                callerSocket.emit('callAccepted', {
                    roomId: data.roomId
                });
            }
        });

        // Handle rejecting call
        socket.on('rejectCall', (data) => {
            const callerSocket = findSocketByUserId(data.callerId);

            if (callerSocket) {
                callerSocket.emit('callRejected');
            }
        });

        // Handle ending call
        socket.on('endCall', (data) => {
            const otherUserSocket = findSocketByUserId(data.otherUserId);

            if (otherUserSocket) {
                otherUserSocket.emit('callEnded');
            }
        });


        socket.on("disconnect", () => disconnect(socket));
    })
};

export default setUpSocket;