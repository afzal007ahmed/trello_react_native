import axios from "axios"
import { ENV } from "../config"

export const checkCard = async( id , value ) => {
   await axios.put(ENV.API_CHECK_CARD(id)+`?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}` , {
    dueComplete : value 
   }) ;
}

