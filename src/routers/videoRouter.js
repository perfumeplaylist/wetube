import express from "express";
import {
  getWatch,
  getEditVideo,
  putEditVideo,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controller/videoController";
import { protectedMiddleWare, VideoMulter } from "../middleware";

const videoRouter = express.Router();

videoRouter.get("/:id([a-f\\d+]{24})", getWatch);
videoRouter
  .route("/:id([a-f\\d+]{24})/edit")
  .all(protectedMiddleWare)
  .get(getEditVideo)
  .put(VideoMulter.single("video"), putEditVideo);
videoRouter
  .route("/:id([a-f\\d+]{24})/delete")
  .get(protectedMiddleWare, deleteVideo);
videoRouter
  .route("/upload")
  .all(protectedMiddleWare)
  .get(getUpload)
  .post(VideoMulter.single("video"), postUpload);
// videoRouter.route("/delete").get(deleteVideo).delete()
export default videoRouter;
