import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));
app.use("/api/users", userRoutes);
const PORT = 1115;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//JSON server
// Apuntabamos a UL, con nombre, puerto y endopoint con metodo asociado
// url / path / method

// localhost:1115

app.get("/health", (request, response) => {
  response.json({ message: "alive" });
});

// path variable viven como cariables dentro de la URL
app.get("/greeting", (request, response) => {
  const name = "pretty";
  response.json({ message: `Hi ${name}` });
});

//con path variable
app.get("/hello/:name", (request, response) => {
  const { name } = request.params;
  response.json({ message: `Hi ${name}` });
});

//query
app.get("/hi", (request, response) => {
  const { name } = request.query;
  response.json({ message: `Hi ${name}` });
});

app.get("/users", (request, response) => {
  mysqlConnect.query("SELECT * FROM users;", (error, result) => {
    if (error) {
      console.error(error);
      return response.status(500).json({ error: "Database error" });
    }
    response.json(result);
  });
});

// un identificador con path variable
app.get("/users/:id", (request, response) => {
  const { id } = request.params;

  mysqlConnect.query(
    "SELECT * FROM users WHERE id = ?;",
    [id],
    (error, result) => {
      response.json(result);
    },
  );
});

app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  mysqlConnect.query(
    "INSERT INTO users (full_name, email, password) VALUES (?,?,?);",
    [name, email, password],
    (error, result) => {
      res.json(result);
    },
  );
});

app.get("/user", (request, response) => {
  const { email } = request.query;
  mysqlConnect.query(
    "SELECT * FROM users WHERE user_email = ?;",
    [email],
    (error, result) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Database error" });
      }

      if (result.length === 0) {
        return response.status(404).json({ message: "User not found" });
      }

      response.json(result);
    },
  );
});

app.listen("1115", (error) => {
  if (error) throw error;
  console.log("App nice in port 1115");
});
