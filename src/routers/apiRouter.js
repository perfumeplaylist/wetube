import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([a-f\\d+]{24})/view", registerView);
apiRouter.post("/video/:id([a-f\\d+]{24})/comment", createComment);
apiRouter.delete("/video/:id([a-f\\d+]{24})/comment", deleteComment);

export default apiRouter;
