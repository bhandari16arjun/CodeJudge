const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

async function runCode({ language, code, testcases = [], limits = {} }) {
  const timeLimitMs = limits.time || 2000;
  const memoryCapKb = (limits.memory || 256) * 1024; // Default 256MB

  const tmp = "/tmp/exec";
  fs.mkdirSync(tmp, { recursive: true });

  const timeCmd = "/usr/bin/time -v";

  const getMem = out => {
    const m = out.match(/Maximum resident set size.*?: (\d+)/);
    return m ? +m[1] : 0;
  };

  const stripNoise = raw =>
    raw
      .split("\n")
      .filter(
        l =>
          !l.includes("Maximum resident") &&
          !l.includes("Command being timed") &&
          !l.startsWith("\t")
      )
      .join("\n")
      .trim();

  const shortErr = raw => {
    const l =
      raw.split("\n").find(x => x.includes("error:")) ||
      raw.split("\n").find(x => x.includes("Exception")) ||
      raw.split("\n").find(x => x.includes("Command terminated"));
    return l ? l.replace(tmp, "").trim() : "Unknown error";
  };

  let binary = "", compile = "";
  switch (language) {
    case "cpp":
      fs.writeFileSync(`${tmp}/main.cpp`, code);
      compile = `g++ ${tmp}/main.cpp -o ${tmp}/a.out`;
      binary = `${tmp}/a.out`;
      break;
    case "python":
      fs.writeFileSync(`${tmp}/main.py`, code);
      binary = `python3 ${tmp}/main.py`;
      break;
    default:
      throw new Error("Unsupported language");
  }

  if (compile) {
    try {
      execSync(compile, { timeout: 10000 });
    } catch (e) {
      return {
        status: "Compilation Error",
        failedTestcase: null,
        actualOutput: null,
        totalTimeMs: 0,
        totalMemoryKb: 0,
        error: shortErr(e.stderr?.toString() || e.message),
      };
    }
  }

  let totalTime = 0, totalMem = 0;
  let verdict = "Accepted", failed = null, actualOut = null, errMsg = null;

  for (let i = 0; i < testcases.length; ++i) {
    const { input, expectedOutput = "" } = testcases[i];
    fs.writeFileSync(`${tmp}/input.txt`, input);

    try {
      const start = Date.now();
      const wrapped = `bash -c "ulimit -v ${memoryCapKb}; exec ${timeCmd} ${binary} < ${tmp}/input.txt"`;

      const raw = execSync(wrapped, {
        shell: true,
        timeout: timeLimitMs,
      }).toString();

      const elapsed = Date.now() - start;
      const memKb = getMem(raw);
      const out = stripNoise(raw);

      totalTime += elapsed;
      totalMem += memKb;

      if (memKb > memoryCapKb) {
        verdict = "Memory Limit Exceeded";
        failed = i + 1;
        break;
      }

      if (elapsed > timeLimitMs) {
        verdict = "Time Limit Exceeded";
        failed = i + 1;
        break;
      }

      if (out !== expectedOutput.trim()) {
        verdict = "Wrong Answer";
        actualOut = out;
        failed = i + 1;
        break;
      }

    } catch (e) {
      if (e.signal === "SIGKILL") {
        verdict = "Memory Limit Exceeded";
      } else if (e.signal === "SIGTERM") {
        verdict = "Time Limit Exceeded";
      } else {
        verdict = "Runtime Error";
        errMsg = shortErr(e.stderr?.toString() || e.message);
      }
      failed = i + 1;
      break;
    }
  }

  try {
    fs.rmSync(tmp, { recursive: true, force: true });
  } catch (_) {}

  return {
    status: verdict,
    failedTestcase: failed,
    actualOutput: verdict === "Wrong Answer" ? actualOut : null,
    totalTimeMs: verdict === "Accepted" ? totalTime : 0,
    totalMemoryKb: verdict === "Accepted" ? totalMem : 0,
    error: errMsg,
  };
}

module.exports = runCode;
