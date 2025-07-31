import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    notify: {
        message: "",
        type: ""
    }
}

const notifySlice = createSlice({
    name: "notify",
    initialState,
    reducers: {
        setNotify: (state, action) =>{
            state.notify = {message: action.payload.message, type: action.payload.type};
        }
    }
})

export const {setNotify} = notifySlice.actions;

export const notifyReducer = notifySlice.reducer;