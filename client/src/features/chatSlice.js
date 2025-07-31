import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    chatInfo: {
        selectedChatType: null, // ["contact","channel",null] --> null means to show empty chat container 
        selectedChatData: null,
        selectedChatMessages: [],
        onlineUsers: [],
        lastSeenData: null,
        directMessagesContact: [],
        channels: [],
        
    }
}

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChatType: (state, action) => {
            state.chatInfo.selectedChatType = action.payload;
        },
        setSelectedChatData: (state, action) => {
            state.chatInfo.selectedChatData = action.payload;
        },
        setSelectedChatMessages: (state, action) => {
            state.chatInfo.selectedChatMessages = action.payload;
        },
        addMessage: (state, action) => {
            state.chatInfo.selectedChatMessages = [...state.chatInfo.selectedChatMessages,
            {
                ...action.payload,
                receiver:
                    state.selectedChatType === "channel" ? action.payload.receiver._id : action.payload.receiver,
                sender:
                    state.selectedChatType === "channel" ? action.payload.sender._id : action.payload.sender,

            }
            ]
        },
        setOnlineUsers:(state,action)=>{
            state.chatInfo.onlineUsers = action.payload;
        },
        setLastSeenData:(state,action)=>{
            state.chatInfo.lastSeenData = action.payload;
        },
        setDirectMessagesContact:(state,action)=>{
            state.chatInfo.directMessagesContact = action.payload;
        },
        closeChat: (state, action) => {
            state.chatInfo.selectedChatType = null;
            state.chatInfo.selectedChatData = null;
            state.chatInfo.selectedChatMessages = [];
        },
        addChannel: (state,action) =>{
            state.chatInfo.channels.push(action.payload);
        },
        setChannels: (state,action)=>{
            state.chatInfo.channels = action.payload;
        }
    }
});

export const { setSelectedChatData, setSelectedChatMessages, setSelectedChatType, closeChat, addMessage,setOnlineUsers, setLastSeenData , setDirectMessagesContact, addChannel, setChannels} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;