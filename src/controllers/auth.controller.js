import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/user.service.js";

const SECRET = "super_secret_key";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const users = await findUserByEmail(email);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // ⚠️ Si aún no usas bcrypt, comparación simple:
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, 
        email: user.user_email, 
        role: user.role },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};