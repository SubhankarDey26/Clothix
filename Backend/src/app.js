import cookieParser from "cookie-parser"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import authrouter from "./routes/auth.routes.js"
import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from "./config/config.js"
import productRouter from "./routes/product.routes.js"

const app=express()



app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(passport.initialize());


// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));


// Routes: Authentication endpoints
app.use("/api/auth",authrouter)
app.use("/api/products",productRouter)



// app.use(cors({
//     origin:"http://localhost:5173",
//     methods:["GET","POST","PUT","DELETE"],
//     credentials:true
// }))


export default app