import axios from "axios"
import { ENV } from "../config"

export const createChecklist = async( id , name ) => {
    await axios.post(ENV.API_CREATE_CHECKLIST + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}` , {
        idCard : id ,
        name : name 
    })
}