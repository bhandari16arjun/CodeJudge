const express = require("express");
const router = express.Router();
const { reviewSolution } = require("../controllers/aiReviewController");

router.post("/review", reviewSolution);

module.exports = router;
