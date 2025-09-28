const express = require('express');
const router = express.Router();
const { getBoilerplate } = require('../controllers/boilerplateController');

router.get('/:language', getBoilerplate);

module.exports = router;