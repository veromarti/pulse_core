import { MongoClient } from "mongodb";

const mongodbClient = new MongoClient("mongodb+srv://veromarti:p8zCyUtKKH3Hv6aU@clustervmc.kwxpmvj.mongodb.net/");

await mongodbClient.connect();

const mongodbConnect = mongodbClient
  .db("pulse_core")
  .collection("tickets");

export default mongodbConnect;