const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const Cart = require("./cart");

const filePath = path.join(rootDir, "data", "product.json");

const getProductsFromFile = (cb) => {
  fs.readFile(filePath, (error, fileContent) => {
    if (error) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save(cb) {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        products[existingProductIndex] = this;
      } else {
        this.id = products.length
          ? (parseInt(products[products.length - 1].id) + 1).toString()
          : "1";
        products.push(this);
      }

      fs.writeFile(filePath, JSON.stringify(products), (error) => {
        console.log(error);
        if (!error) {
          cb();
        }
      });
    });
  }

  static deleteById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const updatedProducts = products.filter((product) => product.id !== id);

      fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
        console.log(error);
        if (!error) {
          Cart.deleteProduct(id, product.price, () => {
            cb();
          });
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static finById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      cb(product);
    });
  }
};
