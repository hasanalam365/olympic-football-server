const {
  ObjectId,
} = require("mongodb");

const client =
  require("../config/db");

const liveCollection =
  client
    .db(
      "olympicTournament"
    )
    .collection(
      "liveMatches"
    );

const matchCollection =
  client
    .db(
      "olympicTournament"
    )
    .collection("matches");

const teamsCollection =
  client
    .db(
      "olympicTournament"
    )
    .collection("teams");

exports.startLiveMatch =
  async (req, res) => {
    try {
      const {
        matchId,
      } = req.body;

      const match =
        await matchCollection.findOne(
          {
            _id:
              new ObjectId(
                matchId
              ),
          }
        );

      const homeTeam =
        await teamsCollection.findOne(
          {
            name:
              match.homeTeam,
          }
        );

      const awayTeam =
        await teamsCollection.findOne(
          {
            name:
              match.awayTeam,
          }
        );

      const liveData = {
        matchId,

        homeTeam:
          match.homeTeam,

        awayTeam:
          match.awayTeam,

        homePlayers:
          homeTeam?.players ||
          [],

        awayPlayers:
          awayTeam?.players ||
          [],

        homeScore: 0,
        awayScore: 0,

        minute: 0,

        status: "live",

        goals: [],

        yellowCards:
          [],

        redCards: [],

        createdAt:
          new Date(),
      };

      const result =
        await liveCollection.insertOne(
          liveData
        );

      res.send({
        insertedId:
          result.insertedId,
      });
    } catch (
      error
    ) {
      res
        .status(500)
        .send(error);
    }
  };

exports.getLiveMatch =
  async (req, res) => {
    const result =
      await liveCollection.findOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        }
      );

    res.send(result);
  };

exports.updateScore =
  async (req, res) => {
    const result =
      await liveCollection.updateOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        },
        {
          $set:
            req.body,
        }
      );

    res.send(result);
  };

exports.addGoal =
  async (req, res) => {
    const result =
      await liveCollection.updateOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        },
        {
          $push: {
            goals:
              req.body,
          },
        }
      );

    res.send(result);
  };

exports.addYellowCard =
  async (req, res) => {
    const result =
      await liveCollection.updateOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        },
        {
          $push: {
            yellowCards:
              req.body,
          },
        }
      );

    res.send(result);
  };

exports.addRedCard =
  async (req, res) => {
    const result =
      await liveCollection.updateOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        },
        {
          $push: {
            redCards:
              req.body,
          },
        }
      );

    res.send(result);
  };

  exports.updateTimer =
  async (req, res) => {
    const result =
      await liveCollection.updateOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        },
        {
          $set: {
            timerSeconds:
              req.body.timerSeconds,

            isRunning:
              req.body.isRunning,

            startedAt:
              req.body.startedAt,

            status:
              req.body.status,
          },
        }
      );

    res.send(result);
  };