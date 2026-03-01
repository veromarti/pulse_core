import { getCurrentUser } from "./../src/utils/helpers.js";
import { isAuthenticated } from "./../src/utils/auth.js";
import LoginView from "./../public/views/LoginView.js";
import UserHomeView from "./views/UserHomeView.js";

class App {
  constructor() {
    this.app = document.getElementById("app");
    this.currentView = null;
    this.user = getCurrentUser();
    this.currentParams = {};
    this.init();
  }

  async checkSession() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:1115/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      const data = await response.json();

      // 🔥 Guardar usuario validado
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Session check failed:", error);
    }
  }

  async init() {
    const user = getCurrentUser();
    await this.checkSession();
    this.user = user;
    if (!isAuthenticated()) {
      this.navigate("login");
      return;
    }
    console.log("USER FROM STORAGE:", this.user);
    console.log("ROLE:", this.user?.role);

    console.log("User:", this.user);
    console.log("Role:", this.user?.role);
    console.log("Authenticated:", isAuthenticated());
    switch (this.user?.role) {
      case "ADMIN":
        this.navigate("dashboard");
        break;
      case "AGENT":
        console.log("hello");
        this.navigate("tickets");
        break;
      case "USER":
        console.log("hello");
        this.navigate("user");
        break;
      default:
        this.navigate("login");
    }
  }

  navigate(route, params = {}) {
    this.app.innerHTML = "";
    this.currentRoute = route;
    this.currentParams = params;

    switch (route) {
      case "login":
        this.currentView = new LoginView(this);
        break;
      case "user":
        this.currentView = new UserHomeView(this);
        break;
      //   case "events":
      //     this.currentView = new EventsView(this);
      //     break;
      //   case "events/create":
      //     this.currentView = new CreateEvent(this);
      //     break;
      //   case "details":
      //     this.currentView = new EventDetails(this, params);
      //     break;
      //   case "projects":
      //     this.currentView = new Teams(this);
      //     break;
      //   case "ranking":
      //     this.currentView = new Ranking(this);
      //     break;
      //   case "qr-voting":
      //     this.currentView = new QRVoting(this);
      //     break;
      //   case "coderHome":
      //     this.currentView = new coderHome(this);
      //     break;
      //   case "projectSettings":
      //     this.currentView = new ProjectSettings(this);
      //     break;
      //   case "profile":
      //     this.currentView = new ProfileView(this);
      //     break;
      default:
        return this.navigate("login");
    }

    if (!this.currentView) {
      console.error("No view created for route:", route);
      return;
    }
    this.currentView.render();
  }
}

new App();
