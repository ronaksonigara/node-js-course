const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const filePath = path.join(rootDir, "data", "cart.json");

const getProductsFromFile = (cb) => {
  fs.readFile(filePath, (error, fileContent) => {
    if (error) {
      cb({
        products: [],
        totalPrice: 0,
      });
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice, cb) {
    // Fetch the previous cart

    getProductsFromFile((cart) => {
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
        if (!error) {
          cb();
        }
      });
    });
  }

  static deleteProduct(id, productPrice, cb) {
    getProductsFromFile((cart) => {
      const product = cart.products.find((product) => product.id === id);
      cart.products = cart.products.filter((product) => product.id !== id);
      cart.totalPrice = cart.totalPrice - product.qty * productPrice;
      fs.writeFile(filePath, JSON.stringify(cart), (error) => {
        console.log(error);
        if (!error) {
          cb();
        }
      });
    });
  }
};
