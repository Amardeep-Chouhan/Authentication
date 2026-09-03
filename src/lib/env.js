import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const ENV=({
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER
    
});

if(!ENV.DB_URL){
   throw new Error("DB_URL is not defined in the environment variable"); 
}

if(!ENV.JWT_SECRET){
   throw new Error("JWT_SECRET is not defined in the environment variable"); 
        }    

if (!ENV.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!ENV.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables");
}

if (!ENV.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in environment variables");
}

if (!ENV.GOOGLE_USER) {
    throw new Error("GOOGLE_USER is not defined in environment variables");
}
