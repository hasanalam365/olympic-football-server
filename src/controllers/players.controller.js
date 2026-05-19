const { ObjectId } = require("mongodb");

const client = require("../config/db");

const playersCollection =
  client
    .db("olympicTournament")
    .collection("players");

/* ======================================
    ADD PLAYER
====================================== */
exports.addPlayer =
  async (req, res) => {
    try {
      const playerData =
        req.body;

      const result =
        await playersCollection.insertOne(
          playerData
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to add player",
      });
    }
  };

/* ======================================
    GET ALL PLAYERS
====================================== */
exports.getPlayers =
  async (req, res) => {
    try {
      const result =
        await playersCollection
          .find()
          .toArray();

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to get players",
      });
    }
  };

/* ======================================
    GET SINGLE PLAYER
====================================== */
exports.getSinglePlayer =
  async (req, res) => {
    try {
      const id =
        req.params.id;

      const result =
        await playersCollection.findOne(
          {
            _id:
              new ObjectId(
                id
              ),
          }
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to get player",
      });
    }
  };

/* ======================================
    UPDATE PLAYER
====================================== */
exports.updatePlayer =
  async (req, res) => {
    try {
      const id =
        req.params.id;

      const updatedData =
        req.body;

      const result =
        await playersCollection.updateOne(
          {
            _id:
              new ObjectId(
                id
              ),
          },
          {
            $set:
              updatedData,
          }
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to update player",
      });
    }
  };

/* ======================================
    DELETE PLAYER
====================================== */
exports.deletePlayer =
  async (req, res) => {
    try {
      const id =
        req.params.id;

      const result =
        await playersCollection.deleteOne(
          {
            _id:
              new ObjectId(
                id
              ),
          }
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to delete player",
      });
    }
  };