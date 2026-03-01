import { findUserByEmail } from "../services/user.service.js";

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