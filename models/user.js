const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // {  items: []  }
    this._id = _id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart?.items?.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...(this.cart?.items || [])];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: { cart: updatedCart },
      }
    );
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart?.items?.map((cp) => cp.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds || [] } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (cp) => cp.productId.toString() === product._id.toString()
            ).quantity,
          };
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart?.items?.filter(
      (cp) => cp.productId.toString() !== productId.toString()
    );

    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: {
          cart: {
            items: updatedCartItems,
          },
        },
      }
    );
  }

  addOrder() {
    const db = getDb();
    return db
      .collection("orders")
      .insertOne(this.cart)
      .then((result) => {
        this.cart = {
          items: [],
        };

        return db.collection("users").updateOne(
          { _id: new ObjectId(this._id) },
          {
            $set: {
              cart: {
                items: [],
              },
            },
          }
        );
      })
      .catch((error) => {
        throw error;
      });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
