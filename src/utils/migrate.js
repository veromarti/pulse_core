import csv from "csvtojson";
import fs from "fs";
import {mongodbConnect} from "./../config/mongodb.js"; // ajusta la ruta

function parseDate(dateString) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");

  return new Date(`${year}-${month}-${day}T${timePart}:00`);
}

const loadCSV = async () => {
  const jsonArray = await csv({ delimiter: ";" }).fromFile(
    "./src/DATA/tickets.csv",
  );
  console.log(jsonArray[0]); // mostramos solo el primero

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
    }))
    };

    

  }
    await mongodbConnect().insertOne(ticketData);
};

// async function migrate() {
//   try {
//     const jsonArray = await csv({
//       delimiter: ";",
//     }).fromFile("../../DATA/tickets.csv");

//     // 🔹 1. Agrupar por ticket_id
//     const grouped = {};

//     for (const row of jsonArray) {
//       if (!grouped[row.ticket_id]) {
//         grouped[row.ticket_id] = [];
//       }

//       grouped[row.ticket_id].push(row);
//     }

//     // 🔹 2. Construir array final de tickets
//     const ticketsToInsert = [];

//     for (const ticketId in grouped) {
//       const rows = grouped[ticketId];
//       const firstRow = rows[0];

//       const ticketData = {
//         ticket_id: firstRow.ticket_id,
//         subject: firstRow.ticket_subject,
//         category: firstRow.ticket_category,
//         priority: firstRow.ticket_priority,
//         status: firstRow.ticket_status,
//         tags: [
//           firstRow.ticket_tag_1,
//           firstRow.ticket_tag_2,
//           firstRow.ticket_tag_3,
//         ].filter(Boolean),

//         events: rows.map((row) => ({
//           type: row.event_type,
//           at: parseDate(row.event_at),
//           message: {
//             author_type: row.message_author_type,
//             author_name: row.message_author_name,
//             body: row.message_body,
//             attachment_url: row.attachment_url || null,
//           },
//           related: row.related_type
//             ? {
//                 type: row.related_type,
//                 ref: row.related_ref,
//               }
//             : null,
//         })),
//       };

//       ticketsToInsert.push(ticketData);
//     }

//     // 🔹 3. Insertar todo en una sola operación
//     const result = await mongodbConnect.insertMany(ticketsToInsert);

//     console.log(`✅ Migración completada.`);
//     console.log(`📦 Documentos insertados: ${result.insertedCount}`);

//     process.exit();
//   } catch (error) {
//     console.error("❌ Error en migración:", error);
//   }
// }

// migrate();

await loadCSV();
