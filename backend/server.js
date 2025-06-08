import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { connectDB } from "./config/db.js";
connectDB();

// import all the routes
import userRoutes from "./components/user/user.routes.js";
import ratioRoutes from "./components/ratio/ratio.routes.js"


const app = express();
app.use(cors())
app.use(express.json()); // allow us to accept JSON data in the req.body

app.get("/", (req,res) =>{
    res.send("Welcome to XChangeIt")
})
app.use("/api/user", userRoutes);
app.use("/api/ratio", ratioRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
});
