import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

async function createDB() {
  try {
    await client.connect();
    const dbName = process.env.DB_NAME || "dmi_anesthesie";
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

createDB();
