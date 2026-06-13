import cookieParser from "cookie-parser"
import express from "express"
import morgan from "morgan"
import authrouter from "./routes/auth.routes.js"

const app=express()

// Middleware: Parse incoming JSON requests
app.use(express.json())

// Middleware: Log HTTP requests in development
app.use(morgan("dev"))

// Middleware: Parse cookies from requests
app.use(cookieParser())

// Routes: Authentication endpoints
app.use("/api/auth",authrouter)

// TODO: Add error handling middleware for global error management
// TODO: Add rate limiting middleware to prevent brute force attacks

export default app