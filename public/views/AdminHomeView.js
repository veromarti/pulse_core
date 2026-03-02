import { formatDate } from "../../src/utils/helpers.js";

export default class AdminHomeView {
  constructor(router) {
    this.router = router;
    this.email = "";
    this.password = "";
    this.error = "";
    this.loading = false;
  }

  async render() {
    const app = document.getElementById("app");
    const mainContent = await fetch(`./../public/pages/admin-home.html`).then(
      (r) => r.text(),
    );
    app.innerHTML = mainContent;

    await this.loadCampaigns();
    this.attachEventHandlers();
  }

  async loadCampaigns() {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("tbody");

    const campaignsResponse = await fetch(
      "http://localhost:1115/api/admin/campaigns",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const campaigns = await campaignsResponse.json();
    console.log(campaigns);

    campaigns.forEach((campaign) => {
      const startDate = formatDate(campaign.campaign_start_date);
      const endDate = formatDate(campaign.campaign_end_date);
      tbody.innerHTML += `<tr>
          <th scope="row">${campaign.id}</th>
          <td>${campaign.campaign_name}</td>
          <td>${campaign.campaign_city}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
        </tr>`;
    });
  }

  attachEventHandlers() {
    const form = document.getElementById("campaign-form");
    const token = localStorage.getItem("token");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const city = document.getElementById("city").value;
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;
        console.log(title, city, startDate, endDate)
        console.log(JSON.stringify({ title, city, startDate, endDate }))
      const response = await fetch("http://localhost:1115/api/admin/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, city, startDate, endDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

    alert("Campaign created successfully");
      form.reset();
    });
  }
}
