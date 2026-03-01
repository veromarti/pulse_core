import { findCampaigns, createCampaign } from "../services/campaign.service.js";

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await findCampaigns();

    if (!campaigns) {
      return res.status(404).json({ message: "Campaigns not found" });
    }

    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const postCampaign = async (req, res) => {
  console.log("BODY:", req.body);
  try {
    const { title, city, startDate, endDate } = req.body;
    const result = await createCampaign(title, city, startDate, endDate);

    res.status(201).json({
      message: "Campaign created successfully",
      campaignId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
