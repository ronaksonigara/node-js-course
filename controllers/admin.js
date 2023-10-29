const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = +req.body.price;
  const description = req.body.description;

  Product.create({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  })
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
    res.redirect("/");
    return;
  }

  const productId = req.params.productId;

  Product.findByPk(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode === "true",
        product,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
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
  const updatedProduct = new Product(id, title, imageUrl, description, price);
  updatedProduct.save(() => {
    res.redirect("/admin/products");
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteById(id, () => {
    res.redirect("/admin/products");
  });
};
