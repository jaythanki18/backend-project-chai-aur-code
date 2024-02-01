import express from "express"
import cors from "cors"
import cookieParse from "cookie-parser"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentiels: true,
}))
app.use(express.json({limit: "16kb"}))  
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParse())

//routes import
import userRouter from './routes/user.routes.js'
import videoRoutes from "./routes/video.routes.js";

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos", videoRoutes);

//http://localhost:8080/api/v1/users/register

export { app }