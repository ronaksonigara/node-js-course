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

  const product = new Product(title, price, description, imageUrl);

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
  req.user
    .getProducts({ where: { id: productId } })
    // Product.findByPk(productId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
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
  // Product.findAll()
  req.user
    .getProducts()
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

  Product.update(
    {
      title,
      imageUrl,
      price,
      description,
    },
    {
      where: {
        id,
      },
    }
  )
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });

  // Product.findByPk(id)
  //   .then((product) => {
  //     product.title = title;
  //     product.imageUrl = imageUrl;
  //     product.price = price;
  //     product.description = description;
  //     return product.save();
  //   })
  //   .then(() => {
  //     console.log("updated product");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;

  Product.destroy({
    where: {
      id,
    },
  })
    .then(() => {
      console.log("Destroyed");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });

  // Product.findByPk(id)
  //   .then((product) => {
  //     return product.destroy();
  //   })
  //   .then(() => {
  //     console.log("Destroyed");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};
