import mariadb, { Pool } from "mariadb";
import dotenv from "dotenv";
dotenv.config();

// database connection
const pool: Pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || "", 10),
  database:
    process.env.NODE_ENV === "test"
      ? process.env.DB_TEST_NAME
      : process.env.DB_NAME,
  connectionLimit: 5,
});
export default { pool };
