const express        = require("express");
const router         = express.Router();
const upload         = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  addProblem,
  updateProblem,
  deleteProblem,
  getProblemMeta,
  getMyProblems,
  getProblemTestCases,
  getProblemSummary,
  listProblems,
  getHotProblems,
  getProblemMetaAndSampleByNumber
} = require("../controllers/problemController");

router.get(
  '/',
  authMiddleware,   
  listProblems
);

router.post(
  "/addProblem",
  authMiddleware,
  upload.fields([
    { name: "sampleTestCases",  maxCount: 1 },
    { name: "hiddenTestCases",  maxCount: 1 }
  ]),
  addProblem
);

router.get(
  "/meta/:id",              
  authMiddleware,
  getProblemMeta
);

router.get(
  "/my",
  authMiddleware,
  getMyProblems
);

router.get(
  "/testcases/:id",        
  authMiddleware,         
  getProblemTestCases
);

router.put(
  "/updateProblem/:id",
  authMiddleware,
  upload.fields([
    { name: "sampleTestCases", maxCount: 1 },
    { name: "hiddenTestCases", maxCount: 1 }
  ]),
  updateProblem
);

router.delete(
  "/deleteProblem/:id",
  authMiddleware,
  deleteProblem
);

router.get(
  "/summary",         
  authMiddleware,
  getProblemSummary
);

router.get(
  '/sample/number/:number',
  authMiddleware,
  getProblemMetaAndSampleByNumber
);

router.get(
  "/hot",              
  authMiddleware,
  getHotProblems
);

module.exports = router;
