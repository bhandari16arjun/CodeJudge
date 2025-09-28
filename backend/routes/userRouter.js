const express     = require('express')
const router      = express.Router()
const userCtrl    = require("../controllers/userController")
const { updateSolvedProblem } = require("../controllers/userController");
const auth = require('../middleware/authMiddleware')

router.get('/:id/stats',   userCtrl.getStats)
router.get('/:id/heatmap', userCtrl.getHeatmap)
router.post("/solved",auth,updateSolvedProblem);
router.get('/:id/solved-Problems', userCtrl.getSolvedProblemIds);
router.get('/:id/monthly-ranks', userCtrl.getUserMonthlyRanks);
router.get("/:id/current-rank", userCtrl.getCurrentRank);
module.exports = router
