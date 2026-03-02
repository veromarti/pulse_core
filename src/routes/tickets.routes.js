import express from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getAllTickets } from "../controllers/tickets.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {mongodbConnect, getTicketsCollection} from "../config/mongodb.js";

const router = express.Router();

router.use((req, res, next) => {
  req.user = { role: "AGENT" };
  next();
});

router.get("/", verifyToken, authorizeRoles("AGENT"), getAllTickets);

router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    if (req.user.role !== "AGENT") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await getTicketsCollection().updateOne(
      { _id: new ObjectId(ticketId) },
      { $set: { status } }
    );

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ error: "Internal server error" });
    console.error("ERROR DETALLADO:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;