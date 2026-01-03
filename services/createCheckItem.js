import axios from "axios";
import { ENV } from "../config";

export const createCheckItem = async (id, name) => {
  await axios.post(
    ENV.API_CREATE_CHECK_ITEM(id) +
      `?key=${ENV.API_KEY}&token=${ENV.API_TOKEN}`,
    null,
    { params: { name: name } }
  );
};
