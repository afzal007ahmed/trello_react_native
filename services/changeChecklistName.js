import axios from "axios"
import { ENV } from "../config"

export const changeChecklistName = async( id , name ) => {
   await axios.put(ENV.API_CHANGE_CHECKLIST_NAME( id ) + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}` , {
    name : name
   })
}