import cookieParser from "cookie-parser"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import authrouter from "./routes/auth.routes.js"

const app=express()



app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

// Routes: Authentication endpoints
app.use("/api/auth",authrouter)

// TODO: Add error handling middleware for global error management
// TODO: Add rate limiting middleware to prevent brute force attacks

export default app