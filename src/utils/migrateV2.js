import csv from "csvtojson";
import { mongodbConnect } from "../config/mongodb.js";

function parseDate(dateString) {
  if (!dateString) return null;

  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");

  return new Date(`${year}-${month}-${day}T${timePart}:00`);
}

const loadCSV = async () => {
  try {
    const db = await mongodbConnect();
    const ticketsCollection = db.collection("tickets");

    const jsonArray = await csv({ delimiter: ";" }).fromFile(
      "./src/DATA/tickets.csv"
    );

    const grouped = {};

    for (const row of jsonArray) {
      if (!grouped[row.ticket_id]) {
        grouped[row.ticket_id] = [];
      }
      grouped[row.ticket_id].push(row);
    }

    console.log(Object.keys(grouped).length, "tickets únicos");

    for (const ticketId in grouped) {
      const rows = grouped[ticketId];
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

      await ticketsCollection.insertOne(ticketData);
    }

    console.log("✅ Migración completada");
  } catch (error) {
    console.error("❌ Error en migración:", error);
  }
};

await loadCSV();