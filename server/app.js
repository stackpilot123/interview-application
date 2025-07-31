import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import debug from "debug";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import candidateRouter from "./routes/candidateRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import channelRouter from "./routes/channelRoutes.js";
import setUpSocket from "./config/socketConfig.js";



const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
const databaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))


const log = debug("development:app");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/candidate", candidateRouter);
app.use("/api/admin",adminRouter);
app.use("/api/chat",chatRouter);
app.use("/api/channel",channelRouter);



server.listen(port, (err) => {
    if (err) log("error in assigning the port: ", err.message);
    log(`Server successfully running on port : ${port}`);
});

setUpSocket(server);

mongoose.connect(databaseUrl)
    .then(() => { log("DB connection successfull") })
    .catch((err) => { log("DB connection failed: ", err.message) });
