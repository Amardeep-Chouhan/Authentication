import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const ENV=({
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    JWT_SECRET:process.env.JWT_SECRET
});

if(!ENV.DB_URL){
   throw new Error("DB_URL is not defined in the environment variable"); 
}

if(!ENV.JWT_SECRET){
   throw new Error("JWT_SECRET is not defined in the environment variable"); 
        }    


