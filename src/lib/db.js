import mongoose from "mongoose";
import dns from"dns";
import {ENV} from "./env.js";

dns.setServers(['0.0.0.0','8.8.8.8']);
export const connectDB = async() =>{
    try{
         const connection = await mongoose.connect(ENV.DB_URL)
        console.log("Database connected sucessfully", connection.connection.host); 
    }
    catch(error){
        console.error("Error connecting to the Database:", error)
       process.exit(1);
    }
    
}