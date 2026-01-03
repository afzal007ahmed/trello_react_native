import axios from "axios"
import { ENV } from "../config"

export const changeItemState = async( cardId , checkItemId , value ) => {
    await axios.put( ENV.API_CHANGE_CHECK_STATE( cardId , checkItemId ) + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}` , { 
        state : value ? "complete" : "incomplete" 
    })
}
