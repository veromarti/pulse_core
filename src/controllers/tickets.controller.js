import { mongodbConnect } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

export const getAllTickets = async (req, res) => {
  try {
    const db = await mongodbConnect();
    const tickets = await db.collection("tickets").find().toArray();

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = await mongodbConnect();

    const result = await db.collection("tickets").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updated_by: req.user.id,
          updated_at: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
