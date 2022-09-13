import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
export const getLogin = (req, res) => {
  res.render("user/login", { pageTitle: "login" });
};

export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const pageTitle = "join";
  try {
    // only username,password
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
      return res.status(400).render("user/join", {
        pageTitle,
        errorMessage: "Confrim username",
      });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).render("user/join", {
        pageTitle,
        errorMessage: "Confrim password",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } catch (error) {
    return res.status(404).render("404", {
      pageTitle: `${error._message}`,
    });
  }
};

export const getJoin = (req, res) => {
  return res.render("user/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const {
    body: { username, location, name, email, password, password1 },
  } = req;
  const pageTitle = "Join";
  // 비밀번호 확인
  if (password !== password1) {
    return res
      .status(400)
      .render("user/join", { pageTitle, errorMessage: "Password dissacount" });
  }
  try {
    // 중복된 유저 확인
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(400).render("user/join", {
        pageTitle,
        errorMessage: "Duplication username or email",
      });
    }
    await User.create({
      username,
      name,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(404).render("404", { pageTitle: `Error` });
  }
};

export const LoginstartGithub = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(`${finalUrl}`);
};

export const LoginFinshGithub = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.SECRET_CLIENT_ID,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const response = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await response.json();
  if ("access_token" in json) {
    const { access_token } = json;
    const apiUrl = "https://api.github.com";
    const userData = await fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const userObj = await userData.json();
    const emailData = await fetch(`${apiUrl}/user/emails`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const emailInfo = await emailData.json();
    const emailObj = emailInfo.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userObj.avatar_url,
        username: userObj.login,
        socialOnly: true,
        email: emailObj.email,
        password: "",
        location: userObj.location,
        name: userObj.name === null ? "undefined" : userObj.name,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const LoginStartKakao = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_KEY,
    redirect_uri: process.env.REDIRECT_URL,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const LoginFinishKakao = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_KEY,
    redirect_uri: process.env.REDIRECT_URL,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const json = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();
  if ("access_token" in json) {
    const { access_token } = json;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const userInfo = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
    ).json();
    if (!("properties" in userInfo && "kakao_account" in userInfo)) {
      return res.redirect("/login");
    }
    let user = await User.findOne({
      email: userInfo.kakao_account.email,
    });
    if (!user) {
      user = await User.create({
        username: userInfo.kakao_account.email,
        email: userInfo.kakao_account.email,
        socialOnly: true,
        password: "",
        name: userInfo.properties.nickname,
        avatarUrl: userInfo.properties.thumbnail_image_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const see = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).redirect("/");
  }
  return res
    .status(301)
    .render("user/see", { pageTitle: `${user.name}`, user });
};

export const getEdit = (req, res) => {
  return res.render("user/edit-profile", {
    pageTitle: `${req.session.user.name} Edit profile`,
  });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: {
        _id,
        avatarUrl,
        email: beforeEmail,
        username: beforeUsername,
        socialOnly,
      },
    },
    body: { username, email, location, name },
    file,
  } = req;
  // sociallogin한 유저가 수정하고 저장하면 db가 새로 생성된다.
  // 다시 로그인하면 username과 비교하기 떄문에 social로그인 유저는 username을 변경 못하게 해야한다.
  if (beforeEmail === email || beforeUsername === username) {
    return res.status(404).render("user/edit-profile", {
      pageTitle: `Edit profile`,
      errorMessage: "This username/email is already taken.",
    });
  }
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(404).render("user/edit-profile", {
      pageTitle: `Edit profile`,
      errorMessage: "This username/email is already taken.",
    });
  }
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      username,
      email,
      location,
      name,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/user/edit");
};

export const getChangePassowrd = (req, res) => {
  const {
    session: { user },
  } = req;
  if (!user.socialOnly) {
    return res.render("user/change-password", {
      pageTitle: `${user.name} change password`,
    });
  }
  return res.redirect("/user/edit");
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassoword, confirmNewPassowrd },
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id);
  const PageUrl = "user/change-password";
  const pageTitle = `${user.name} change password`;
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res
      .status(404)
      .render(PageUrl, { pageTitle, errorMessage: "Confirm Old password" });
  }
  if (newPassoword !== confirmNewPassowrd) {
    return res
      .status(404)
      .render(PageUrl, { pageTitle, errorMessage: `Confirm new Password` });
  }
  user.password = newPassoword;
  await user.save();
  return res.redirect("edit");
};

export const deleteUser = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  await User.findByIdAndDelete(_id);
  return res.redirect("/user/logout");
};
