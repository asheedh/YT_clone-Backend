import express from "express"
import { addComment, deleteComment, getAllComments, getSingleComment, getSingleVideoComments, updateComment } from "../controllers/commentController.js";

// added router for comment routes

const router = express.Router();

router.get("/", getAllComments);

router.get("/:id", getSingleComment);

router.get("/videoComments/:id", getSingleVideoComments);

router.post("/addComment", addComment);

router.delete("/deleteComment/:id/:vId/:uId", deleteComment);

router.put("/updateComment/:id/:vId/:uId", updateComment);


export default router;
 