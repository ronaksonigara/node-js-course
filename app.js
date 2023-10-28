const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const { routes } = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.engine(
  ".hbs",
  expressHbs.engine({
    extname: ".hbs",
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
  })
);
app.set("view engine", ".hbs");

// app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", routes);
app.use(shopRouter);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "404" });
  //   res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(3000);
