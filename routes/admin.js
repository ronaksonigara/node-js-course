const express = require("express");

const {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
} = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", getAddProduct);

// /admin/products => GET
router.get("/products", getProducts);

// /admin/add-product => POST
router.post("/add-product", postAddProduct);

router.get("/edit-product/:productId", getEditProduct);

module.exports = router;
