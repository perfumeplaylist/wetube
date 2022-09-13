import express from "express";
import { home, search } from "../controller/videoController";
import {
  getLogin,
  postLogin,
  getJoin,
  postJoin,
} from "../controller/userController";
import { publicMiddleWare } from "../middleware";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").all(publicMiddleWare).get(getLogin).post(postLogin);
rootRouter.route("/join").all(publicMiddleWare).get(getJoin).post(postJoin);
rootRouter.get("/search", search);

export default rootRouter;
