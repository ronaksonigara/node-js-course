const express = require("express");

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  getOrders,
  getCheckout,
  postCartDeleteProduct,
  postOrder,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/product/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/create-order", postOrder);

// router.get("/orders", getOrders);

// // router.get("/checkout", getCheckout);

router.post("/cart-delete-item", postCartDeleteProduct);

module.exports = router;
