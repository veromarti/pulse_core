import csv from "csvtojson";
import { mongodbConnect } from "./src/config/mongodb.js";

function parseDate(dateString) {
  if (!dateString) return null;

  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");

  return new Date(`${year}-${month}-${day}T${timePart}:00`);
}

async function loadOneTicket() {
  try {
    const db = await mongodbConnect();
    const ticketsCollection = db.collection("tickets");

    const jsonArray = await csv({ delimiter: ";" }).fromFile(
      "./src/DATA/tickets.csv"
    );

    console.log("Total filas CSV:", jsonArray.length);

    // 🔹 Agrupar por ticket_id
    const grouped = {};

    for (const row of jsonArray) {
      if (!grouped[row.ticket_id]) {
        grouped[row.ticket_id] = [];
      }
      grouped[row.ticket_id].push(row);
    }

    const firstTicketId = Object.keys(grouped)[0];
    const rows = grouped[firstTicketId];

    console.log("Insertando ticket:", firstTicketId);

    const firstRow = rows[0];

    const ticketData = {
      ticket_id: firstRow.ticket_id,
      subject: firstRow.ticket_subject,
      category: firstRow.ticket_category,
      priority: firstRow.ticket_priority,
      status: firstRow.ticket_status,
      tags: [
        firstRow.ticket_tag_1,
        firstRow.ticket_tag_2,
        firstRow.ticket_tag_3,
      ].filter(Boolean),

      events: rows.map((row) => ({
        type: row.event_type,
        at: parseDate(row.event_at),
        message: {
          author_type: row.message_author_type,
          author_name: row.message_author_name,
          body: row.message_body,
          attachment_url: row.attachment_url || null,
        },
        related: row.related_type
          ? {
              type: row.related_type,
              ref: row.related_ref,
            }
          : null,
      })),
    };

    console.log("Documento a insertar:");
    console.dir(ticketData, { depth: null });

    const result = await ticketsCollection.insertOne(ticketData);

    console.log("✅ Insertado con ID:", result.insertedId);

  } catch (error) {
    console.error("❌ Error cargando CSV:", error);
  }
}

loadOneTicket();