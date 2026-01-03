import axios from "axios"
import { ENV } from "../config"

export const deleteCheckList = async( id ) => {
    await axios.delete(ENV.API_DELETE_CHECKLIST(id) + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`) ;
}