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
    const mainContent = await fetch(`./../Frontend/pages/login.html`).then(
      (r) => r.text(),
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

      const response = await fetch(`http://localhost:1115/user?email=${email}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        alert("user not found");
        return;
      }

      const data = await response.json();

      if (data.length > 0) {
        if (password == data[0].password) {
          alert("nice");
        } else {
          alert("bad auth");
        }
      } else {
        alert("user not found");
      }
    });
  }
}
