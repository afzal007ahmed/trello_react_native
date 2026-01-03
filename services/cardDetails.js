import axios from "axios"
import { ENV } from "../config"

export const cardDetails = async( id ) => {
   const response = await axios.get(ENV.API_GET_CARD_DETAILS( id ) + `?checklists=all&checkItem_fields=all&key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`);
   return response.data ;
}