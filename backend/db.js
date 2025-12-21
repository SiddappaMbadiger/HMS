const mysql = require("mysql2");

/*
  MySQL Database Connection
  This file is used by server.js
*/

const db = mysql.createConnection({
  host: "localhost",
  user: "root",              // MySQL username
  password: "Siddha@123",       // ⚠️ change if your MySQL password is different
  database: "ssdbms",     // Your HDMS database name
  port: 3306
});

/* Connect to MySQL */
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL Connected Successfully");
});

module.exports = db;
