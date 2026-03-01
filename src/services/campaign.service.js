import mysqlConnect from "../config/mysqldb.js";

export const findCampaigns = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        *
      FROM campaigns
    `;

    mysqlConnect.query(query, (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      const campaign = results;

      resolve(campaign)
    });
  });
};

export const createCampaign = (name, city, startDate, endDate) => {
  console.log(name,city, startDate, endDate)
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO campaigns (campaign_name, campaign_city, campaign_start_date, campaign_end_date)
      VALUES (?, ?, ?, ?)
    `;

    mysqlConnect.query(
      query,
      [name, city, startDate, endDate],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};