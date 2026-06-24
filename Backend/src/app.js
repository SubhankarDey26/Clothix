import cookieParser from "cookie-parser"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import authrouter from "./routes/auth.routes.js"
import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from "./config/config.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app=express()



app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

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
app.use("/api/cart",cartRouter)

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, "../public")))

// Wildcard route to serve index.html for client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

export default app