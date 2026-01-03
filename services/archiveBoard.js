import axios from "axios"
import { ENV } from "../config"

export const archiveBoard = async(id) => {
    await axios.put(ENV.API_ARCHIVE_BOARD(id) + `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}&closed=true`)  ;
}