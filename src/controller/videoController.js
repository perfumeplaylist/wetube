import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comments";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.status(401).render("404", { pageTitle: `${error._message}` });
  }
};

export const search = (req, res) => {
  res.send("search");
};

export const getWatch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(401).render("404", { pageTitle: `${error._message}` });
  }

  return res.render("video/watch", { pageTitle: `${video.title}`, video });
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(401).render("404", { pageTitle: `Not Found video` });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(401).render("404", { pageTitle: `Not Account User` });
  }
  return res.render("video/edit", { pageTitle: `${video.title}`, video });
};

export const putEditVideo = async (req, res) => {
  const {
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
    params: { id },
    file,
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(401).render("404", { pageTitle: `${error._message}` });
    }
    if (String(video.owner) !== String(_id)) {
      return res.status(401).render("404", { pageTitle: `Not Account User` });
    }
    await Video.findByIdAndUpdate(id, {
      title,
      videoUrl: file ? file.path : file,
      description,
      hashtags: Video.formatfunction(hashtags),
    });
    return res.status(200).redirect(`/video/${id}`);
  } catch (error) {
    return res.status(401).render("404", { pageTitle: `${error._message}` });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(401).render("404", { pageTitle: `${error._message}` });
    }
    if (String(video.owner) !== String(_id)) {
      return res.status(401).render("404", { pageTitle: `Not Account User` });
    }
    await Video.findByIdAndDelete(id);
    return res.status(200).redirect("/");
  } catch (error) {
    return res.status(401).render("404", { pageTitle: `${error._message}` });
  }
};

export const getUpload = (req, res) => {
  return res.render("video/upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    file,
  } = req;
  try {
    const uploadVideo = await Video.create({
      title,
      videoUrl: file.path,
      description,
      hashtags: Video.formatfunction(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(401)
        .render("video/upload", { pageTitle: `Not Found User` });
    }
    user.videos.push(uploadVideo);
    await user.save();
    return res.status(200).redirect("/");
  } catch (error) {
    return res.status(401).render("404", { pageTitle: `${error._message}` });
  }
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    video: video._id,
    owner: user._id,
  });
  video.comments.push(comment);
  video.save();
  return res.status(201).json({ newCommentId: comment.id });
};

export const deleteComment = async (req, res) => {
  const {
    session: { user },
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  if (!comment && String(user._id) !== String(comment.owner._id)) {
    return res.sendStatus(404);
  }
  const video = await Video.findById(comment.video._id);
  video.comments.splice(video.comments.indexOf(id), 1);
  await video.save();
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(201);
};
