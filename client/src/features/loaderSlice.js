import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading:{
        isLoading: null,
        loadingTexts: []
    }
}

export const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers:{
        setLoading: (state,action)=>{
            state.loading.isLoading = action.payload;
        },
        setLoadingTexts: (state,action) =>{
            state.loading.loadingTexts = action.payload;
        }
    }
});

export const {setLoading, setLoadingTexts} = loaderSlice.actions;

export const loaderReducer = loaderSlice.reducer;