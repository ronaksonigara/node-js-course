const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const { uri } = require("./util/database");

const { get404 } = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");

const User = require("./models/user");

const app = express();

var store = new MongoDBStore({
  uri,
  collection: "sessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.redirect("/login");
      }
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRouter);
app.use(authRouter);

app.use(get404);

mongoose.connect(uri).then(() => {
  User.findOne().then((user) => {
    if (!user) {
      const newUser = new User({
        name: "Admin",
        email: "admin@gmail.com",
        cart: { items: [] },
      });

      newUser.save();
    }
  });

  console.log("Mongo Connected!!");
  app.listen(3000);
});
