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

export const config={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET
}

