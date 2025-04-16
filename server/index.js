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

app.use(cors({
    origin: 'https://note-taking-app-five-wine.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
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