const { ObjectId } = require("mongodb");

const client = require("../config/db");

const teamsCollection =
  client
    .db("olympicTournament")
    .collection("teams");

const playersCollection =
  client
    .db("olympicTournament")
    .collection("players");

// ADD TEAM
exports.addTeam = async (
  req,
  res
) => {
  try {

    const teamData =
      req.body;

    const selectedPlayers =
      teamData.players || [];

    // TEAM SAVE
    const result =
      await teamsCollection.insertOne(
        teamData
      );

    // PLAYER UPDATE
    if (
      selectedPlayers.length >
      0
    ) {

      for (const player of selectedPlayers) {

        await playersCollection.updateOne(
          {
            _id:
              new ObjectId(
                player._id
              ),
          },
          {
            $push: {
              teamMembers: {
                teamName:
                  teamData.name,

                year:
                  new Date().getFullYear(),

                goals: 0,

                match: 0,
              },
            },
          }
        );
      }
    }

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message:
        "Failed to add team",
    });
  }
};

// GET TEAM
exports.getTeams =
  async (req, res) => {
    try {

      const result =
        await teamsCollection
          .find()
          .toArray();

      res.send(result);

    } catch (error) {

      console.log(error);
    }
  };

// DELETE TEAM
exports.deleteTeam =
  async (req, res) => {
    try {

      const id =
        req.params.id;

      const result =
        await teamsCollection.deleteOne(
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
    }
  };

// SEARCH PLAYERS
exports.searchPlayers =
  async (req, res) => {
    try {

      const search =
        req.query.search;

      const query = {

        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },

          {
            phoneNumber: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };

      const result =
        await playersCollection
          .find(query)
          .limit(10)
          .toArray();

      res.send(result);

    } catch (error) {

      console.log(error);
    }
  };