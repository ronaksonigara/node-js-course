const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://root:root1234@cluster0.hng1qpr.mongodb.net/shop?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let _db;

const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found!";
};

module.exports = { mongoConnect, getDb };
