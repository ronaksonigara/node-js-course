const { Schema } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

class Product {
  constructor(title, price, description, imageUrl, _id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = _id;
    this.userId = userId;
  }

  save() {
    const db = getDb();

    if (this._id) {
      const { _id, ...rest } = this;
      return db.collection("products").updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: rest,
        }
      );
    }

    return db.collection("products").insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("products").find().toArray();
  }

  static findById(productId) {
    const db = getDb();
    return db.collection("products").findOne({ _id: new ObjectId(productId) });
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });
  }
}

module.exports = Product;
