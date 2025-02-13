import express from "express";
import { getAllUsers, signUp, logIn, getsingleUser } from "../controllers/userController.js";

import multer from "multer";
import path from "path";

// Set up storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store files in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });


// added router for video routes

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getsingleUser);

router.post("/signup", upload.single("avatar"), signUp); 

router.post("/login", logIn);


export default router;