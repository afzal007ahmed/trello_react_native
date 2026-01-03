import { configureStore } from "@reduxjs/toolkit";
import profileReducer  from "./redux/profileSlice"
import boardsReducer from "./redux/boardsSlice"

export const store = configureStore({
    reducer : {
        profileReducer,
        boardsReducer,
        
    }
})


