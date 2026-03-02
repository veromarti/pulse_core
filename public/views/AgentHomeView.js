import { formatDate } from "../../src/utils/helpers.js";

export default class AgentHomeView {
  constructor(router) {
    this.router = router;
    this.email = "";
    this.password = "";
    this.error = "";
    this.loading = false;
  }

  async render() {
    const app = document.getElementById("app");
    const mainContent = await fetch(`./../public/pages/agent-home.html`).then(
      (r) => r.text(),
    );
    app.innerHTML = mainContent;

    await this.loadTickets();
    this.attachEventHandlers();
  }

  getStatusBadge(status) {
    const colors = {
      OPEN: "primary",
      IN_PROGRESS: "warning",
      RESOLVED: "success",
      CLOSED: "secondary",
    };

    return `<span class="badge bg-${colors[status] || "dark"}">${status}</span>`;
  }

  async updateStatus(id, newStatus) {
    if (!newStatus) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:1115/tickets/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      this.loadTickets(); // recargar lista
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async loadTickets() {
    try {
      const token = localStorage.getItem("token");
      const tbody = document.querySelector("tbody");

      tbody.innerHTML = "";

      const ticketsResponse = await fetch("http://localhost:1115/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!ticketsResponse.ok) {
        throw new Error("Error fetching tickets");
      }

      const tickets = await ticketsResponse.json();
      if (!tickets.length) {
        tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">No tickets found</td>
        </tr>
      `;
        return;
      }

      // 🔹 Construir HTML primero (más eficiente)
      let rows = "";

      tickets.forEach((ticket) => {
        rows += `
        <tr>
          <th scope="row">${ticket.ticket_id}</th>
          <td>${ticket.subject}</td>
          <td>${ticket.category}</td>
          <td>${ticket.priority}</td>
          <td>${this.getStatusBadge(ticket.status)}</td>
          <td>
            <select 
              class="form-select form-select-sm status-select"
              data-id="${ticket._id}"
            >
              <option value="">Select</option>
              <option value="OPEN" ${ticket.status === "OPEN" ? "selected" : ""}>Open</option>
              <option value="IN_PROGRESS" ${ticket.status === "IN_PROGRESS" ? "selected" : ""}>In Progress</option>
              <option value="RESOLVED" ${ticket.status === "RESOLVED" ? "selected" : ""}>Resolved</option>
              <option value="CLOSED" ${ticket.status === "CLOSED" ? "selected" : ""}>Closed</option>
            </select>
          </td>
        </tr>
      `;
      });

      tbody.innerHTML = rows;
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  }

  attachEventHandlers() {
    document.addEventListener("change", async (e) => {
      if (e.target.classList.contains("status-select")) {
        const id = e.target.dataset.id;
        const value = e.target.value;
        await this.updateStatus(id, value);
      }
    });
  }
}
