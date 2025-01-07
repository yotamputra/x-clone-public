const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

const database = client.db("p3-gc01");

module.exports = { database };
