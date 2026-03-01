export default class LoginView {
  constructor(router) {
    this.router = router;
    this.email = "";
    this.password = "";
    this.error = "";
    this.loading = false;
  }

  async render(){
    console.log('entra')
    const app = document.getElementById("app");
    const mainContent = await fetch (`./../Frontend/pages/login.html`).then(r => r.text())
    app.innerHTML = mainContent;
  }
}
