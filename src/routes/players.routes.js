const express = require("express");

const router =
  express.Router();

const controller = require(
  "../controllers/players.controller"
);

// ADD PLAYER
router.post(
  "/",
  controller.addPlayer
);

// GET PLAYERS
router.get(
  "/",
  controller.getPlayers
);

// DELETE PLAYER
router.delete(
  "/:id",
  controller.deletePlayer
);

module.exports = router;