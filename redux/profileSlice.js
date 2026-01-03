import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading : false ,
    data : null ,
    error : null 
}


const profileSlice = createSlice({
    name : "profileSlice" ,
    initialState : initialState ,
    reducers : {
        profileLoading : ( state ) => {
            state.loading = true ;
        },
        profileSuccess: ( state , action ) => {
            state.loading = false ;
            state.error = null;
            state.data = action.payload ;
        },
        profileFailed : ( state , action )=> {
            state.loading = false ; 
            state.error = action.payload ;
        },
        profileReset : () => initialState 
    }
})

export const { profileLoading , profileFailed , profileSuccess , profileReset} = profileSlice.actions ; 
export default profileSlice.reducer ; 