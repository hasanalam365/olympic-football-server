const express = require("express");
const router = express.Router();

const {
  startLiveMatch,
  getLiveMatch,
  getCurrentLiveMatch,
  updateScore,
  addGoal,
  addYellowCard,
  addRedCard,
  updateTimer,
} = require(
  "../controllers/live.controller"
);

router.post(
  "/start",
  startLiveMatch
);

router.get(
  "/current",
  getCurrentLiveMatch
);

router.get(
  "/:id",
  getLiveMatch
);

router.patch(
  "/score/:id",
  updateScore
);

router.patch(
  "/goal/:id",
  addGoal
);

router.patch(
  "/yellow/:id",
  addYellowCard
);

router.patch(
  "/red/:id",
  addRedCard
);

router.patch(
  "/timer/:id",
  updateTimer
);

module.exports = router;