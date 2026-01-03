import axios from "axios"
import { ENV } from "../config"

export const archiveList = async( id ) => {
    await axios.put(ENV.API_ARCHIVE_LIST( id ) + `?closed=true&key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`);
}