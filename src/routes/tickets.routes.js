import express from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getAllTickets } from "../controllers/tickets.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { mongodbConnect, getTicketsCollection} from "../config/mongodb.js";
import mysqlConnect from "../config/mysqldb.js";

const router = express.Router();

router.use(async (req, res, next) => {
  req.user = { role: "AGENT" };
  await mongodbConnect();
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

router.get("/:id/related", async (req, res) => {
  try {
    const ticketId = req.params.id;

    // 1️⃣ MongoDB: traer ticket
    const ticket = await getTicketsCollection().findOne({ _id: new ObjectId(ticketId) });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    let relatedData = null;

    // 2️⃣ SQL: traer datos relacionados si existe
    if (ticket.related) {
      const { type, ref } = ticket.related;

      if (type === "APPOINTMENT") {
        const [rows] = await mysqlConnect.query(
          "SELECT * FROM appointments WHERE id = ?",
          [ref]
        );
        relatedData = rows[0] || null;
      }

      if (type === "NOTIFICATION") {
        const [rows] = await mysqlConnect.query(
          "SELECT * FROM notifications WHERE id = ?",
          [ref]
        );
        relatedData = rows[0] || null;
      }
    }

    // 3️⃣ Devolver combinado
    res.json({
      ticket,
      related: relatedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;