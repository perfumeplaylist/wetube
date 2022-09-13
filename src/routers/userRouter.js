import express from "express";
import {
  see,
  getEdit,
  postEdit,
  deleteUser,
  logout,
  LoginstartGithub,
  LoginFinshGithub,
  LoginStartKakao,
  LoginFinishKakao,
  getChangePassowrd,
  postChangePassword,
} from "../controller/userController";
import {
  AvatarMulter,
  protectedMiddleWare,
  publicMiddleWare,
} from "../middleware";
const userRouter = express.Router();

userRouter.get("/:id([a-f\\d]{24})", see);
userRouter.get("/logout", protectedMiddleWare, logout);
userRouter
  .route("/edit")
  .all(protectedMiddleWare)
  .get(getEdit)
  .post(AvatarMulter.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectedMiddleWare)
  .get(getChangePassowrd)
  .post(postChangePassword);
userRouter.get("/delete", protectedMiddleWare, deleteUser);
userRouter.get("/github/start", publicMiddleWare, LoginstartGithub);
userRouter.get("/github/finish", LoginFinshGithub);
userRouter.get("/kakao/start", publicMiddleWare, LoginStartKakao);
userRouter.get("/kakao/finish", LoginFinishKakao);

export default userRouter;
