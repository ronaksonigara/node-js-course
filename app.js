const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const db = require("./util/database");
const { get404 } = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRouter);

app.use(get404);

app.listen(3000);
