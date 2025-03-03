import {connect} from "mongoose";
import { ENV } from "./environments.config";


export const dbConnect = async () => {
    try {
        await connect(ENV.MONGO_URI);
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}