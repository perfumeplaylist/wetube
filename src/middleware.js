import multer from "multer";
export const localMiddleWare = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.user = req.session.user;
  next();
};

export const protectedMiddleWare = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};

export const publicMiddleWare = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};

export const AvatarMulter = multer({
  dest: "uploads/avatar/",
  limits: {
    fileSize: 3000000,
  },
});

export const VideoMulter = multer({
  dest: "uploads/video/",
  limits: {
    fileSize: 30000000,
  },
});
