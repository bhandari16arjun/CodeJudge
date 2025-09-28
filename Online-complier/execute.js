const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");

function cleanUp(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {}
}

module.exports = async function runCode({ language, code, testCases }) {
  const workDir = path.join("/tmp", `run_${crypto.randomUUID().slice(0, 8)}`);
  fs.mkdirSync(workDir);

  const srcBase = path.join(workDir, "main");

  try {
    if (language === "cpp") {
      fs.writeFileSync(`${srcBase}.cpp`, code);
      execSync(`g++ -O2 -std=c++17 "${srcBase}.cpp" -o "${workDir}/a.out"`);
    } else if (language === "python") {
      fs.writeFileSync(`${srcBase}.py`, code);
    } else {
      throw new Error("Unsupported language");
    }
  } catch (err) {
    err.isCompile = true;
    cleanUp(workDir);
    throw err;
  }

  const TIME_LIMIT = 2000;
  const MEMORY_LIMIT = 256 * 1024; // KB = 256 MB
  const MAX_BUF = 10 * 1024 * 1024;

  const runner =
    language === "cpp"
      ? `${workDir}/a.out`
      : `python3 ${srcBase}.py`;

  const outputs = [];

  for (const { input } of testCases) {
    try {
      const wrapped = `bash -c "ulimit -v ${MEMORY_LIMIT}; exec ${runner}"`;
      const stdout = execSync(wrapped, {
        input,
        timeout: TIME_LIMIT,
        maxBuffer: MAX_BUF,
        shell: true,
        cwd: workDir,
        encoding: "utf8",
      }).trim();

      outputs.push({ output: stdout || "" });
    } catch (err) {
      if (
        err.signal === "SIGTERM" ||
        err.signal === "SIGKILL" ||
        err.signal === "SIGTRAP" ||
        /timed out/i.test(err.message)
      ) {
        outputs.push({ output: "Time Limit Exceeded" });
      } else {
        const errorOutput =
          (err.stderr || err.message || "").toString().split("\n").find(l => l.trim()) || "Runtime Error";

        outputs.push({
          output: "Runtime Error",
          error: errorOutput.slice(0, 300),
        });
      }
    }
  }

  cleanUp(workDir);
  return outputs;
};
