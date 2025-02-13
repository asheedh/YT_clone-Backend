import express from "express"
import { createChannel, deleteChannel, getAllChannels, getmultipleChannels, getSpecificChannel, subscribeChannel, updateChannel } from "../controllers/channelController.js"
import checkAuth from "../middlewares/checkAuth.js";

// added router for channel routes

const router = express.Router();

router.get("/", getAllChannels);

router.post("/createChannel", checkAuth, createChannel);

router.post("/getmultipleChannels", getmultipleChannels);

router.get("/:id", getSpecificChannel);

router.put("/updateChannel/:id/:uId", checkAuth, updateChannel);

router.put("/subscribeChannel/:id/:uId", checkAuth, subscribeChannel);

router.delete("/deleteChannel/:id/:uId", checkAuth, deleteChannel);

export default router;