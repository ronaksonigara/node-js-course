const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://root:root1234@cluster0.hng1qpr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      console.log("Connected");
      callback(client);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = mongoConnect;
