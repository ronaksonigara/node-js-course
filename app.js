const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const { uri } = require("./util/database");

const { get404 } = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6553c5794216375ddadd3e7c")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRouter);

app.use(get404);

mongoose.connect(uri).then(() => {
  console.log("Mongo Connected!!");
  app.listen(3000);
});
