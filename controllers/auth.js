const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("656e1066eb7bf98d075ffd58")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((error) => {
        if (error) console.log(error);
        res.redirect("/");
      });
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) console.log(error);
    res.redirect("/");
  });
};
