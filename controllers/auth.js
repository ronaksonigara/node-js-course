exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true;
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
