const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart?.items?.filter(
    (cp) => cp.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = model("User", userSchema);

// const { ObjectId } = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//   constructor(name, email, cart, _id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart; // {  items: []  }
//     this._id = _id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart?.items?.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...(this.cart?.items || [])];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();
//     return db.collection("users").updateOne(
//       { _id: new ObjectId(this._id) },
//       {
//         $set: { cart: updatedCart },
//       }
//     );
//   }

//   getCart() {
//     const db = getDb();

//     const productIds = this.cart?.items?.map((cp) => cp.productId);

//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds || [] } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (cp) => cp.productId.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       })
//       .catch((error) => {
//         throw error;
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart?.items?.filter(
//       (cp) => cp.productId.toString() !== productId.toString()
//     );

//     const db = getDb();
//     return db.collection("users").updateOne(
//       { _id: new ObjectId(this._id) },
//       {
//         $set: {
//           cart: {
//             items: updatedCartItems,
//           },
//         },
//       }
//     );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };

//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = {
//           items: [],
//         };

//         return db.collection("users").updateOne(
//           { _id: new ObjectId(this._id) },
//           {
//             $set: {
//               cart: {
//                 items: [],
//               },
//             },
//           }
//         );
//       })
//       .catch((error) => {
//         throw error;
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new ObjectId(userId) });
//   }
// }

// module.exports = User;
