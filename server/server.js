import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import serverless from "serverless-http";
import { connectDB } from "../database/connection.js";

import authRouter from "../routes/authRoute.js";
import noteRouter from "../routes/noteRoute.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: 'https://note-taking-app-five-wine.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
    res.send("Hello World from Vercel");
});

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);

export const handler = serverless(app);
