const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user:" + process.env.MONGO_PASS + "@cluster0.ccvjx.gcp.mongodb.net/" + process.env.MONGO_PROJECT + "?retryWrites=true&w=majority";
const client = new MongoClient(uri);
export default client;