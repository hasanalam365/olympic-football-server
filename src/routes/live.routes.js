const express =
  require("express");

const router =
  express.Router();

const {
  startLiveMatch,
  getLiveMatch,
  updateScore,
  addGoal,
  addYellowCard,
  addRedCard,
} = require(
  "../controllers/live.controller"
);
const { updateTimer } = require("../controllers/live.controller");

router.post(
  "/start",
  startLiveMatch
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

module.exports =
  router;