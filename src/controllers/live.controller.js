const { ObjectId } = require("mongodb");
const client = require("../config/db");

const liveCollection = client
  .db("olympicTournament")
  .collection("liveMatches");

const matchCollection = client
  .db("olympicTournament")
  .collection("matches");

const teamsCollection = client
  .db("olympicTournament")
  .collection("teams");

/* =========================
   START LIVE MATCH
========================= */

exports.startLiveMatch = async (req, res) => {
  try {
    const { matchId } = req.body;

    const match =
      await matchCollection.findOne({
        _id: new ObjectId(matchId),
      });

    if (!match) {
      return res.status(404).send({
        message: "Match not found",
      });
    }

    const homeTeam =
      await teamsCollection.findOne({
        name: match.homeTeam,
      });

    const awayTeam =
      await teamsCollection.findOne({
        name: match.awayTeam,
      });

    // Previous live match stop
    await liveCollection.updateMany(
      {
        status: "LIVE",
      },
      {
        $set: {
          status: "Finished",
          isRunning: false,
        },
      }
    );

    const liveData = {
      matchId,

      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,

      homePlayers:
        homeTeam?.players || [],

      awayPlayers:
        awayTeam?.players || [],

      homeScore: 0,
      awayScore: 0,

      timerSeconds: 0,
      isRunning: false,

      minute: 0,

      status: "LIVE",

      goals: [],
      yellowCards: [],
      redCards: [],

      createdAt: new Date(),
    };

    const result =
      await liveCollection.insertOne(
        liveData
      );

    res.send({
      insertedId:
        result.insertedId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message:
        "Failed to start live match",
    });
  }
};

/* =========================
   GET SINGLE LIVE MATCH
========================= */

exports.getLiveMatch = async (
  req,
  res
) => {
  try {
    const result =
      await liveCollection.findOne({
        _id: new ObjectId(
          req.params.id
        ),
      });

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message:
        "Failed to fetch live match",
    });
  }
};

/* =========================
   CURRENT LIVE MATCH
========================= */

exports.getCurrentLiveMatch =
  async (req, res) => {
    try {
      const result =
        await liveCollection.findOne(
          {
            status: "LIVE",
          },
          {
            sort: {
              createdAt: -1,
            },
          }
        );

      res.send(result || null);
    } catch (error) {
      res.status(500).send({
        message:
          "Failed to fetch current live match",
      });
    }
  };

/* =========================
   UPDATE SCORE
========================= */

exports.updateScore = async (
  req,
  res
) => {
  try {
    const result =
      await liveCollection.updateOne(
        {
          _id: new ObjectId(
            req.params.id
          ),
        },
        {
          $set: req.body,
        }
      );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message:
        "Failed to update score",
    });
  }
};

/* =========================
   ADD GOAL
========================= */

exports.addGoal = async (
  req,
  res
) => {
  try {
    const result =
      await liveCollection.updateOne(
        {
          _id: new ObjectId(
            req.params.id
          ),
        },
        {
          $push: {
            goals: req.body,
          },
        }
      );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message:
        "Failed to add goal",
    });
  }
};

/* =========================
   YELLOW CARD
========================= */

exports.addYellowCard =
  async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).send({
        message:
          "Failed to add yellow card",
      });
    }
  };

/* =========================
   RED CARD
========================= */

exports.addRedCard = async (
  req,
  res
) => {
  try {
    const result =
      await liveCollection.updateOne(
        {
          _id: new ObjectId(
            req.params.id
          ),
        },
        {
          $push: {
            redCards: req.body,
          },
        }
      );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message:
        "Failed to add red card",
    });
  }
};

/* =========================
   TIMER UPDATE
========================= */

exports.updateTimer = async (
  req,
  res
) => {
  try {
    const result =
      await liveCollection.updateOne(
        {
          _id: new ObjectId(
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
  } catch (error) {
    res.status(500).send({
      message:
        "Failed to update timer",
    });
  }
};