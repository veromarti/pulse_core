import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile } from "../controllers/user.controller.js";

const router = express.Router();

/* 
   USER → SOLO puede ver su propia info
*/

// Ruta protegida
router.get("/profile", verifyToken, authorizeRoles("USER"), getProfile);

/*
   USER → Puede crear ticket
*/

router.post(
  "/tickets",
  verifyToken,
  authorizeRoles("USER"),
  (req, res) => {
    const { title, description } = req.body;

    // Simulación de creación
    res.json({
      message: "Ticket created",
      userId: req.user.id,
      title,
      description
    });
  }
);

export default router;