import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import campaignRoutes from "./routes/admin.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/campaigns", campaignRoutes);
app.use("/tickets", ticketsRoutes);

const PORT = 1115;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
