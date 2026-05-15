const express = require("express");
const router = express.Router();
const controller = require("../controllers/freeSample.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.post("/freeSampleRequest", controller.createSampleRequest);

router.get("/freeSampleRequest/:email", verifyToken, controller.getUserSamples);

router.get("/admin/sampleRequests", verifyToken, verifyAdmin, controller.getAllSamples);

router.get("/admin/sampleRequests/:id", verifyToken, verifyAdmin, controller.getSampleDetails);

router.patch("/admin/sampleRequests/:id/status", verifyToken, verifyAdmin, controller.updateSampleStatus);

router.patch("/admin/sampleRequests/:id/cancel", verifyToken, verifyAdmin, controller.cancelSample);

router.delete("/admin/sampleRequests/:id", verifyToken, verifyAdmin, controller.deleteSample);

module.exports = router;
