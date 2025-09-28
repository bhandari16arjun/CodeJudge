const { aiReview } = require("../utils/gemini");

exports.reviewSolution = async (req, res) => {
  const {
    problemStatement,
    constraints = [],
    sampleTests = [],
    userCode
  } = req.body;

  if (!problemStatement || !userCode) {
    return res.status(400).json({
      success: false,
      message: "problemStatement and userCode are required",
    });
  }

  const safeSampleTests = Array.isArray(sampleTests) ? sampleTests : [];
  const safeConstraints = Array.isArray(constraints) ? constraints : [];

  const promptLines = [
    "You are CodeWizzy, an expert algorithm tutor.",
    "Review the solution below and respond in brief, structured points.",
    "",
    "Only provide feedback on algorithmic logic, efficiency, and correctness.",
    "Do NOT comment on language‑specific headers, style, or formatting.",
    "If the code is already optimal, simply say: 'No major improvements required.'",
    "",
    "Problem Statement:",
    problemStatement.trim(),
    "",
    "Constraints:",
    ...safeConstraints.map((c) => `  - ${c.trim()}`),
    "",
    "Sample Test Cases:",
    ...safeSampleTests.map(
      ({ input = "", output = "" }, i) =>
        `  ${i + 1}. Input: ${input.trim()} → Output: ${output.trim()}`
    ),
    "",
    "User Code:",
    "```",
    userCode.trim(),
    "```",
    "",
    "Provide only:",
    "1. Time Complexity.",
    "2. Space Complexity.",
    "3. Best possible time and space complexities.",
    "4. Up to 2 bullet‑point improvements that impact performance or correctness.",
  ];

  const prompt = promptLines.join("\n");

  try {
    const analysis = await aiReview(prompt);
    return res.json({ success: true, analysis });
  } catch (err) {
    console.error("AI review failed:", err);
    return res.status(500).json({
      success: false,
      message: "AI review failed",
    });
  }
};
