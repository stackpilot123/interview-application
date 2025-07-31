import { configureStore } from "@reduxjs/toolkit";
import {notifyReducer } from "../features/notifySlice"
import { userReducer } from "../features/userSlice";
import { loaderReducer } from "../features/loaderSlice";
import { chatReducer } from "../features/chatSlice";
import { videoReducer } from "../features/videoSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        notify: notifyReducer,
        loader: loaderReducer,
        chat: chatReducer,
        video: videoReducer
    }
})