const { ObjectId } = require("mongodb");

const client = require("../config/db");

const teamsCollection =
  client.db("olympicTournament").collection("teams");

// ADD TEAM
exports.addTeam = async (req, res) => {
  try {

    const teamData = req.body;

    const result =
      await teamsCollection.insertOne(teamData);

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message: "Failed to add team",
    });
  }
};

// GET ALL TEAMS
exports.getTeams = async (req, res) => {
  try {

    const result =
      await teamsCollection.find().toArray();

    res.send(result);

  } catch (error) {
    console.log(error);
  }
};

// DELETE TEAM
exports.deleteTeam = async (req, res) => {
  try {

    const id = req.params.id;

    const result =
      await teamsCollection.deleteOne({
        _id: new ObjectId(id),
      });

    res.send(result);

  } catch (error) {
    console.log(error);
  }
};