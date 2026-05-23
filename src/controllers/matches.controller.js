// controllers/matches.controller.js

const { ObjectId } =
  require("mongodb");

const client =
  require("../config/db");

/* =========================================
   MATCH COLLECTION
========================================= */
const matchCollection =
  client
    .db("olympicTournament")
    .collection("matches");

/* =========================================
   GET ALL MATCHES
========================================= */
const getAllMatches =
  async (req, res) => {
    try {
      const matches =
        await matchCollection
          .find()
          .sort({
            createdAt: -1,
          })
          .toArray();

      res.send(matches);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to get matches",
      });
    }
  };

/* =========================================
   GET SINGLE MATCH
========================================= */
const getSingleMatch =
  async (req, res) => {
    try {
      const { id } = req.params;

      const match =
        await matchCollection.findOne(
          {
            _id: new ObjectId(
              id
            ),
          }
        );

      res.send(match);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to get match",
      });
    }
  };

/* =========================================
   ADD MATCH
========================================= */
const addMatch =
  async (req, res) => {
    try {
      const newMatch = {
        ...req.body,

        status:
          req.body.status ||
          "scheduled",

        homeScore: 0,

        awayScore: 0,

        createdAt:
          new Date(),
      };

      const result =
        await matchCollection.insertOne(
          newMatch
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to add match",
      });
    }
  };

/* =========================================
   UPDATE MATCH
========================================= */
const updateMatch =
  async (req, res) => {
    try {
      const { id } = req.params;

      const updatedData =
        req.body;

      const result =
        await matchCollection.updateOne(
          {
            _id: new ObjectId(
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
          "Failed to update match",
      });
    }
  };

/* =========================================
   DELETE MATCH
========================================= */
const deleteMatch =
  async (req, res) => {
    try {
      const { id } = req.params;

      const result =
        await matchCollection.deleteOne(
          {
            _id: new ObjectId(
              id
            ),
          }
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to delete match",
      });
    }
  };

module.exports = {
  getAllMatches,
  getSingleMatch,
  addMatch,
  updateMatch,
  deleteMatch,
};