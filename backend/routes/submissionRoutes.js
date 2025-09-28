const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submit',authMiddleware ,submissionController.createSubmission);
router.get('/submit/:id',authMiddleware,submissionController.getSubmissionStatus);
router.get('/recent', authMiddleware, submissionController.getRecentSubmissions);

module.exports = router;
