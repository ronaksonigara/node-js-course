const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const { get404 } = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

const { mongoConnect } = require("./util/database");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6553c5794216375ddadd3e7c")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRouter);

app.use(get404);

mongoConnect(() => {
  app.listen(3000);
});
