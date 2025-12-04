import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import UserRoutes from "./routes/UserRoutes.js"
import BookRoutes from "./routes/BookRoutes.js"
import RequestRoutes from "./routes/RequestRoutes.js"
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));


import cors from "cors";
app.use(cors());


app.use("/api/requests", RequestRoutes)
app.use("/api/books", BookRoutes)

app.use("/api/user", UserRoutes)

const Port = process.env.PORT || 5000;

connectDB();

app.listen(Port, () => {
    console.log("Running on ", Port)
})