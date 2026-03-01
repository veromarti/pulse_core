import mysql from "mysql2";

const mysqlConnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "pulse_core_system"
});

mysqlConnect.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

export default mysqlConnect;