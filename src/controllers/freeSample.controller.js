const client = require("../config/db");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");

const freeSampleCollection = client
  .db("Arabian-Essense")
  .collection("FreeSampleRequests");

exports.createSampleRequest = async (req, res) => {
  const requestId = "FS-" + Date.now() + "-" + crypto.randomBytes(3).toString("hex");

  const data = {
    ...req.body,
    requestId,
    status: [{ step: "pending", date: new Date() }],
    createdAt: new Date(),
  };

  const result = await freeSampleCollection.insertOne(data);
  res.send({ success: true, requestId, insertedId: result.insertedId });
};

exports.getUserSamples = async (req, res) => {
  const result = await freeSampleCollection.find({
    "shippingInfo.email": req.params.email,
  }).toArray();

  res.send(result);
};

exports.getAllSamples = async (req, res) => {
  const result = await freeSampleCollection.find().sort({ _id: -1 }).toArray();
  res.send(result);
};

exports.getSampleDetails = async (req, res) => {
  const result = await freeSampleCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(result);
};

exports.updateSampleStatus = async (req, res) => {
  const result = await freeSampleCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $push: { status: { step: req.body.step, date: new Date() } } }
  );
  res.send(result);
};

exports.cancelSample = async (req, res) => {
  const result = await freeSampleCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $push: { status: { step: "cancelled", date: new Date() } } }
  );
  res.send(result);
};

exports.deleteSample = async (req, res) => {
  const result = await freeSampleCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(result);
};
