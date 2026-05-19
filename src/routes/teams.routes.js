const express = require("express");

const router =
  express.Router();

const controller = require(
  "../controllers/teams.controller"
);

router.post(
  "/",
  controller.addTeam
);

router.get(
  "/",
  controller.getTeams
);

router.get(
  "/searchPlayers",
  controller.searchPlayers
);

router.delete(
  "/:id",
  controller.deleteTeam
);

module.exports = router;

router.get(
  "/:id",
  controller.getSingleTeam
);

router.patch(
  "/:id",
  controller.updateTeam
);