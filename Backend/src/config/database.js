import mongoose from "mongoose";
import {config} from "./config.js";


async function ConnectToDb()
{
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("Server is Connected with DB")
    }
    catch(err)
    {
        console.log(err)
    }

}

export default ConnectToDb