const express = require("express");

const router =
  express.Router();

const controller = require(
  "../controllers/players.controller"
);

/* ======================================
    ADD PLAYER
====================================== */
router.post(
  "/",
  controller.addPlayer
);

/* ======================================
    GET ALL PLAYERS
====================================== */
router.get(
  "/",
  controller.getPlayers
);

/* ======================================
    GET SINGLE PLAYER
====================================== */
router.get(
  "/:id",
  controller.getSinglePlayer
);

/* ======================================
    UPDATE PLAYER
====================================== */
router.patch(
  "/:id",
  controller.updatePlayer
);

/* ======================================
    DELETE PLAYER
====================================== */
router.delete(
  "/:id",
  controller.deletePlayer
);

module.exports = router;