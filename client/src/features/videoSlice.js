import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videoCallInfo:{
        incomingCall: null,
        isInCall: false,
        callStatus: "idle" // 'idle', 'calling', 'receiving', 'connected'
    }
}

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers:{
        setIncomingCall: (state,action) =>{
            state.videoCallInfo.incomingCall = action.payload;
        },
        setIsInCall: (state,action) =>{
            state.videoCallInfo.isInCall = action.payload;
        },
        setCallStatus: (state,action) =>{
            state.videoCallInfo.callStatus = action.payload;
        },
    }
});

export const {setIncomingCall, setIsInCall, setCallStatus} = videoSlice.actions;

export const videoReducer = videoSlice.reducer;

// incomingCall: Stores info about who's calling you
// isInCall: Simple yes/no - are you currently in a video call?
// callStatus: What stage of the call are you in?
