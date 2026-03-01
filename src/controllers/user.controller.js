import { findUserByEmail, getUserWithDonorInfo } from "../services/user.service.js";

export const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    const user = await findUserByEmail(email);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await getUserWithDonorInfo(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};