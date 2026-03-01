export default class LoginView {
  constructor(router) {
    this.router = router;
    this.email = "";
    this.password = "";
    this.error = "";
    this.loading = false;
  }

  async render() {
    const app = document.getElementById("app");
    const mainContent = await fetch(`./../public/pages/login.html`).then((r) =>
      r.text(),
    );
    app.innerHTML = mainContent;

    this.attachEventHandlers();
  }

  attachEventHandlers() {
    const form = document.querySelector("form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const response = await fetch("http://localhost:1115/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      // 🔥 Guardar token
      localStorage.setItem("token", data.token);

      alert("Login successful");
    });
  }
}
