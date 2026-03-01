const API = "http://localhost:3000";
const app = document.getElementById("app");
const logoutBtn = document.getElementById("logoutBtn");

// function getToken() {
//   return localStorage.getItem("token");
// }

// function getRole() {
//   return localStorage.getItem("role");
// }

// function setSession(token, role) {
//   localStorage.setItem("token", token);
//   localStorage.setItem("role", role);
// }

// function clearSession() {
//   localStorage.clear();
// }

// logoutBtn.addEventListener("click", () => {
//   clearSession();
//   renderLogin();
// });

function renderLogin() {
  logoutBtn.classList.add("d-none");

  app.innerHTML = `
    <div class="card shadow mx-auto" style="max-width:400px">
      <div class="card-body">
        <h4 class="mb-3 text-center">Login</h4>
        <input class="form-control mb-2" placeholder="Email" id="email">
        <input type="password" class="form-control mb-2" placeholder="Password" id="password">
        <button class="btn btn-danger w-100" onclick="login()">Ingresar</button>
        <div class="text-center mt-2">
          <a href="#" onclick="renderRegister()">Crear cuenta</a>
        </div>
      </div>
    </div>
  `;
}

// function renderRegister() {
//   app.innerHTML = `
//     <div class="card shadow mx-auto" style="max-width:400px">
//       <div class="card-body">
//         <h4 class="mb-3 text-center">Registro</h4>
//         <input class="form-control mb-2" placeholder="Nombre" id="name">
//         <input class="form-control mb-2" placeholder="Email" id="email">
//         <input type="password" class="form-control mb-2" placeholder="Password" id="password">
//         <button class="btn btn-danger w-100" onclick="register()">Crear cuenta</button>
//         <div class="text-center mt-2">
//           <a href="#" onclick="renderLogin()">Volver</a>
//         </div>
//       </div>
//     </div>
//   `;
// }

async function login() {
  const response = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await response.json();
  if(!response.ok) return alert(data.message);

  setSession(data.token, data.role);
  renderDashboard();
}

async function register() {
  await fetch(`${API}/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    })
  });
  renderLogin();
}

function renderDashboard() {
  logoutBtn.classList.remove("d-none");

  const role = getRole();

  app.innerHTML = `
    <div class="row">
      <div class="col-md-3">
        <div class="list-group">
          <button class="list-group-item" onclick="renderTickets()">Tickets</button>
          ${role === "ADMIN" ? `<button class="list-group-item" onclick="renderCampaigns()">Campañas</button>` : ""}
        </div>
      </div>
      <div class="col-md-9" id="content"></div>
    </div>
  `;
}

async function renderTickets() {
  const content = document.getElementById("content");

  const response = await fetch(`${API}/tickets`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  const tickets = await response.json();

  content.innerHTML = `
    <h4>Tickets</h4>
    <button class="btn btn-danger mb-3" onclick="createTicket()">Nuevo Ticket</button>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-danger">
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.map(t => `
            <tr>
              <td>${t.title}</td>
              <td>${t.status}</td>
              <td>${t.priority}</td>
              <td>
                <button class="btn btn-sm btn-warning" onclick="changeStatus('${t._id}')">Cambiar</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function renderCampaigns() {
  const content = document.getElementById("content");

  const response = await fetch(`${API}/campaigns`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  const campaigns = await response.json();

  content.innerHTML = `
    <h4>Campañas</h4>
    <button class="btn btn-danger mb-3" onclick="createCampaign()">Nueva Campaña</button>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-danger">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${campaigns.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.description}</td>
              <td>${c.start_date}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

if(getToken()){
  renderDashboard();
} else {
  renderLogin();
}