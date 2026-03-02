import { MongoClient } from "mongodb";

const mongodbClient = new MongoClient("mongodb://veromarti:p8zCyUtKKH3Hv6aU@ac-ajenmto-shard-00-00.kwxpmvj.mongodb.net:27017/pulse_core?tls=true&authSource=admin");

let db;

export async function mongodbConnect() {
  try {
    if (!db) {
      await mongodbClient.connect();
      console.log("✅ Connected to MongoDB");
      db = mongodbClient.db("pulse_core");
    }
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

export function getTicketsCollection() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db.collection("tickets");
}