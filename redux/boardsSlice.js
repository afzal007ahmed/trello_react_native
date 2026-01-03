import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading : false ,
     data : null ,
     error : null 
}

const boardsSlice = createSlice({
    name : "boardsSlice" ,
    initialState : initialState , 
    reducers : {
        boardsLoading : ( state ) => {
             state.loading = true ;
        },
        boardsSuccess : ( state , action ) => {
            state.loading = false ;
            state.data = action.payload ;
            state.error = null ;
        },
        boardsFailed : ( state , action ) => {
            state.loading = false ;
            state.error = action.payload ;
        },
        boardsReset : () => initialState
    }
})

export const { boardsFailed , boardsLoading , boardsSuccess , boardsReset } = boardsSlice.actions ;
export default boardsSlice.reducer ;