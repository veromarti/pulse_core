import mysqlConnect from "../config/mysqldb.js";

export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    mysqlConnect.query(
      "SELECT * FROM users WHERE user_email = ?",
      [email],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};