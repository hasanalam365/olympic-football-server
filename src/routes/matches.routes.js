// routes/matches.routes.js

const express =
  require("express");

const router =
  express.Router();

const {
  getAllMatches,
  getSingleMatch,
  addMatch,
  updateMatch,
  deleteMatch,
} = require(
  "../controllers/matches.controller"
);

router.get(
  "/",
  getAllMatches
);

router.get(
  "/:id",
  getSingleMatch
);

router.post(
  "/",
  addMatch
);

router.patch(
  "/:id",
  updateMatch
);

router.delete(
  "/:id",
  deleteMatch
);

module.exports = router;