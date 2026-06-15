import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGO_URI)
{
    throw new Error("MONGO_URI is not defined in Enviroment variables")
}

if(!process.env.JWT_SECRET)
{
    throw new Error("JWT SECRET KEY is not defined in Enviroment variables")
}

if(!process.env.GOOGLE_CLIENT_ID)
{
    throw new Error("GOOGLE CLIENT ID is not defined in Enviroment variables")
}

if(!process.env.GOOGLE_CLIENT_SECRET)
{
     throw new Error("GOOGLE SECRET KEY is not defined in Enviroment variables")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY)
{
    throw new Error("Imagekit private key is not defined in Enviroment variables")
}

if(!process.env.IMAGEKIT_PUBLIC_KEY)
{
    throw new Error("Imagekit public key is not defined in Enviroment variables")
}

export const config={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV:process.env.NODE_ENV || "development",
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY
}

