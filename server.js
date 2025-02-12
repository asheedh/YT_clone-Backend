import express from "express"
import dotenv from "dotenv"
dotenv.config();
import "./config/connection.js"
const app = express();
const port = process.env.PORT || 5300;

// added home route
app.get("/", (req, res) => {
    res.send("Home page of YTclone")
})

// server running at port 
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}/api`)
})