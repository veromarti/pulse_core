import { MongoClient } from "mongodb";

const uri = "mongodb://veromarti:p8zCyUtKKH3Hv6aU@ac-ajenmto-shard-00-00.kwxpmvj.mongodb.net:27017/pulse_core?tls=true&authSource=admin";
const client = new MongoClient(uri);


console.log("Intentando conectar...");
let db;
try {
  
      await client.connect();
    console.log("✅ Connected successfully to MongoDB");

    db = client.db("pulse_core");
    

    
} catch (err) {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  throw err;
}