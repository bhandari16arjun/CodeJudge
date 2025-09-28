const express = require("express");
const router  = express.Router();
const { createRun, getRunStatus } = require("../controllers/runController");

router.post("/run", createRun);

router.get("/run/:runId", getRunStatus);

module.exports = router;
