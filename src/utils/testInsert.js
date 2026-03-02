import { mongodbConnect } from "../config/mongodb.js";

async function insertTestTicket() {
  try {
    const db = await mongodbConnect();
    const tickets = db.collection("tickets");

    const testTicket = {
      ticket_id: "TICKET-001",
      subject: "Error al iniciar sesión",
      category: "Login",
      priority: "High",
      status: "Open",
      tags: ["auth", "frontend"],
      events: [
        {
          type: "message",
          at: new Date(),
          message: {
            author_type: "customer",
            author_name: "Veronica",
            body: "No puedo iniciar sesión en la plataforma",
            attachment_url: null,
          },
          related: null,
        },
      ],
    };

    const result = await tickets.insertOne(testTicket);

    console.log("✅ Documento insertado con ID:", result.insertedId);

  } catch (error) {
    console.error("❌ Error insertando documento:", error.message);
  }
}

insertTestTicket();