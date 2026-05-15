const express = require("express");
const cors = require("cors");
const router = express.Router();
const controller = require("../controllers/auth.controller");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://arabian-essense.vercel.app",
    "https://arabianessence.co.uk",
    "https://www.arabianessence.co.uk"
  ],
  credentials: true,
};

// 🔥 VERY IMPORTANT
router.use(cors(corsOptions));
router.options("/jwt", cors(corsOptions));

// JWT create
router.post("/jwt", controller.createJWT);

module.exports = router;
