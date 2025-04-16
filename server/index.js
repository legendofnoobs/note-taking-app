import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/connection.js";
import cors from "cors";

import authRouter from "./routes/authRoute.js";
import noteRouter from "./routes/noteRoute.js";

// https://note-taking-app-five-wine.vercel.app
// http://localhost:5173

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://note-taking-app-five-wine.vercel.app'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    next();
});

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);

// REMOVE app.listen(...)
app.listen(process.env.PORT, () => {
    console.log(`Server is running`); 
})
// Instead, export the app for Vercel:
export default app;