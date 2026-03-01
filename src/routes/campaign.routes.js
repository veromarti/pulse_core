import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// 🔥 Solo ADMIN puede crear campañas
router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Campaign created" });
  }
);

export default router;