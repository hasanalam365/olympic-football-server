const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   GLOBAL CORS CONFIG
======================= */
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://olympic-tournaments.vercel.app",
    
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 🔥 MUST BE FIRST
app.use(cors(corsOptions));

// 🔥 MUST HANDLE PREFLIGHT
app.options("*", cors(corsOptions));

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use("/", require("./routes/auth.routes"));
app.use("/users", require("./routes/users.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/orders", require("./routes/orders.routes"));
app.use("/", require("./routes/payments.routes"));
app.use("/", require("./routes/freeSample.routes"));

app.use("/teams", require("./routes/teams.routes"));
app.use("/players", require("./routes/players.routes"));


/* =======================
   ROOT
======================= */
app.get("/", (req, res) => {
  res.send("Arabian Essense Server is Working");
});

module.exports = app;
