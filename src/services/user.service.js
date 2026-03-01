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

export const getUserWithDonorInfo = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.id,
        u.user_email,
        u.role,
        d.id AS donorId,
        d.user_phone,
        d.user_city,
        d.user_status, 
        d.donor_level,
        d.last_donation_date
      FROM users u
      LEFT JOIN donors d ON d.user_id = u.id
      WHERE u.id = ?
    `;

    mysqlConnect.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      const user = results[0];

      resolve({
        id: user.id,
        email: user.user_email,
        role: user.role,
        donor: user.donorId
          ? {
              id: user.donorId,
              phone: user.user_phone,
              city: user.user_city,
              status: user.user_status,
              phone: user.user_phone,
              donorLevel: user.donor_level,
              lastDonationDate: user.last_donation_date
            }
          : null
      });
    });
  });
};