const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const filePath = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(filePath, (error, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };

      if (!error) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      let updatedProduct;

      // Add new product/ increase quantity
      if (existingProductIndex !== -1) {
        const existingProduct = cart.products[existingProductIndex];
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1,
        };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + productPrice;
      fs.writeFile(filePath, JSON.stringify(cart), (error) => {
        console.log(error);
      });
    });
  }
};
