import app from "./app.js";
import{ENV} from "./lib/env.js";
import {connectDB} from "./lib/db.js";



app.get("/health",(req,res) =>{
    res.status(200).send("Hello from Server Health Check OK!")
})


const startServer=async()=>{
    try{
        await connectDB();
app.listen(ENV.PORT,()=>{
    console.log("Server is running on port",ENV.PORT);

})
    }
    catch(error){
        console.error("💥Error starting server:",error)
        process.exit(1);
    }
}
startServer();