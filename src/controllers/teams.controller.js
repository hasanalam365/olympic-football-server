const { ObjectId } = require("mongodb");

const client =
  require("../config/db");

const teamsCollection =
  client
    .db("olympicTournament")
    .collection("teams");

const playersCollection =
  client
    .db("olympicTournament")
    .collection("players");

/* =========================================
   ADD TEAM
========================================= */
exports.addTeam =
  async (req, res) => {
    try {
      const teamData =
        req.body;

      const selectedPlayers =
        teamData.players || [];

      const newTeam = {
        ...teamData,

        match: 0,
        win: 0,
        draw: 0,
        lose: 0,
        totalGoals: 0,
        points: 0,

        createdAt:
          new Date(),
      };

      const result =
        await teamsCollection.insertOne(
          newTeam
        );

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

/* =========================================
   GET ALL TEAMS
========================================= */
exports.getTeams =
  async (req, res) => {
    try {
      const result =
        await teamsCollection
          .find()
          .sort({
            points: -1,
            win: -1,
            totalGoals: -1,
          })
          .toArray();

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to fetch teams",
      });
    }
  };

/* =========================================
   GET SINGLE TEAM
========================================= */
exports.getSingleTeam =
  async (req, res) => {
    try {
      const id =
        req.params.id;

      const result =
        await teamsCollection.findOne(
          {
            _id:
              new ObjectId(id),
          }
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to fetch team",
      });
    }
  };

/* =========================================
   UPDATE TEAM
========================================= */
exports.updateTeam =
  async (req, res) => {
    try {
      const id =
        req.params.id;

      const updatedData =
        req.body;

      const points =
        Number(
          updatedData.win || 0
        ) *
          3 +
        Number(
          updatedData.draw || 0
        );

      const result =
        await teamsCollection.updateOne(
          {
            _id:
              new ObjectId(id),
          },
          {
            $set: {
              name:
                updatedData.name,

              shortName:
                updatedData.shortName,

              owner:
                updatedData.owner,

              ownerPhone:
                updatedData.ownerPhone,

              group:
                updatedData.group,

              logo:
                updatedData.logo,

              banner:
                updatedData.banner,

              players:
                updatedData.players,

              match:
                Number(
                  updatedData.match
                ),

              win:
                Number(
                  updatedData.win
                ),

              draw:
                Number(
                  updatedData.draw
                ),

              lose:
                Number(
                  updatedData.lose
                ),

              totalGoals:
                Number(
                  updatedData.totalGoals
                ),

              points,
            },
          }
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to update team",
      });
    }
  };

/* =========================================
   DELETE TEAM
========================================= */
exports.deleteTeam =
  async (req, res) => {
    try {
      const id =
        req.params.id;

      const result =
        await teamsCollection.deleteOne(
          {
            _id:
              new ObjectId(id),
          }
        );

      res.send(result);
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message:
          "Failed to delete team",
      });
    }
  };

/* =========================================
   SEARCH PLAYERS
========================================= */
exports.searchPlayers =
  async (req, res) => {
    try {
      const search =
        req.query.search;

      const query = {
        $or: [
          {
            name: {
              $regex:
                search,
              $options:
                "i",
            },
          },
          {
            phoneNumber: {
              $regex:
                search,
              $options:
                "i",
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

      res.status(500).send({
        message:
          "Failed to search players",
      });
    }
  };