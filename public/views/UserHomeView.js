import { formatDate } from "../../src/utils/helpers.js";

export default class UserHomeView {
  constructor(router) {
    this.router = router;
  }

  async render() {
    const app = document.getElementById("app");

    const mainContent = await fetch(`./../public/pages/user-home.html`).then(
      (r) => r.text(),
    );
    app.innerHTML = mainContent;

    await this.loadProfile();
    this.attachEvents();
  }

  async loadProfile() {
    const token = localStorage.getItem("token");

    const profileResponse = await fetch(
      "http://localhost:1115/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const profileData = await profileResponse.json();

    console.log(profileData)

    document.getElementById("user-info").innerHTML = `
      <strong>Email:</strong> ${profileData.email}<br/>
      <strong>Role:</strong> ${profileData.role}
    `;

    const formatedDate = formatDate(profileData.donor.lastDonationDate)

    document.getElementById("donor-info").innerHTML = `
      <strong>Donor Status:</strong> ${profileData.donor.status}<br/>
      <strong>Donor Level:</strong> ${profileData.donor.donorLevel}<br/>
      <strong>Last donation date:</strong> ${formatedDate}<br/>
      <strong>City:</strong> ${profileData.donor.city}
    `;
  }

  attachEvents() {
    const form = document.getElementById("ticket-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");

      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;

      const response = await fetch("http://localhost:1115/api/users/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Ticket created successfully");
      form.reset();
    });
  }
}
