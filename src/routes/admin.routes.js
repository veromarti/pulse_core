import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getCampaigns } from "../controllers/admin-campaign.controller.js";
import { postCampaign } from "../controllers/admin-campaign.controller.js";

const router = express.Router();

router.get(
  "/", 
  verifyToken, 
  authorizeRoles("ADMIN"), 
  getCampaigns);

// 🔥 Solo ADMIN puede crear campañas
router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  postCampaign
);

export default router;