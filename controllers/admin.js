const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  const description = req.body.description;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/");
    })
    .catch(() => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode === "true",
        product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price -_id")
    // .populate("userId", "name -_id")
    .then((products) => {
      res.render("admin/products", {
        products: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  const description = req.body.description;

  Product.findById(id)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;

  Product.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};
