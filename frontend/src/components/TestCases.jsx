import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

export default function TestCases({
  testCases,
  setTestCases,
  running,
  outputs = [],
  runCompileError = null,
  verdict = null,
  submissionError = null,
  failedCase = null,
  onAiReview,
  aiReviewLoading,
  aiAnalysis,
}) {
  const [activeTab, setActiveTab]   = useState("testcase");
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (running) setActiveTab("testcase");
  }, [running]);

  useEffect(() => {
    if (verdict) setActiveTab("result");
  }, [verdict]);

  const addCase = () => {
    if (testCases.length >= 5) return;
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
    setSelectedIdx(testCases.length);
  };
  const delCase = (idx) => {
    if (testCases.length <= 1) return;
    const next = testCases.filter((_, i) => i !== idx);
    setTestCases(next);
    setSelectedIdx(Math.min(idx, next.length - 1));
  };
  const updateInput = (idx, val) => {
    const next = [...testCases];
    next[idx] = { ...next[idx], input: val };
    setTestCases(next);
  };

  return (
    <div className="h-full bg-[#0f1419] border-t border-[#1e2328]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#1e2328]">
          <TabsList className="bg-[#1e2328] border-[#2a2f36]">
            <TabsTrigger value="testcase">Testcase</TabsTrigger>
            <TabsTrigger value="result">Test Result</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="testcase" className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex gap-2 p-4 border-b border-[#1e2328]/50">
              {testCases.map((_, idx) => (
                <div key={idx} className="relative group">
                  <Button
                    variant={selectedIdx === idx ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIdx(idx)}
                    className={
                      selectedIdx === idx
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-[#1e2328] border-[#2a2f36] text-gray-300 hover:bg-[#2a2f36]"
                    }
                  >
                    Case {idx + 1}
                  </Button>
                  {testCases.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); delCase(idx); }}
                      className="absolute -top-1 -left-1 w-3 h-3 bg-[#1e2328] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-[#2a2f36]"
                    >
                      <X className="w-1.5 h-1.5 text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
              {testCases.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCase}
                  className="bg-[#1e2328] border-[#2a2f36] text-gray-300 hover:bg-[#2a2f36]"
                >
                  +
                </Button>
              )}
            </div>

            <div className="p-4 space-y-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Input</h4>
              <Textarea
                value={testCases[selectedIdx]?.input || ""}
                onChange={(e) => updateInput(selectedIdx, e.target.value)}
                className="bg-[#1e2328]/50 border-[#2a2f36] text-gray-100 font-mono text-sm min-h-[80px] resize-none"
              />
            </div>

            <div className="p-4 space-y-4">
              {running ? (
                <div className="text-center text-gray-400">Running…</div>
              ) : (
                <>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Output</h4>
                  <div className="bg-[#1e2328]/50 rounded p-3 border border-[#2a2f36] min-h-[80px]">
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                      {runCompileError ?? outputs[selectedIdx] ?? (
                        <span className="text-gray-500 italic">
                          No output yet. Run your code to see results.
                        </span>
                      )}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="result" className="flex-1 overflow-auto p-6">
          {!verdict ? (
            <div className="text-gray-400">Submit code to see verdict.</div>
          ) : verdict === "Accepted" ? (
            <>
              <div className="text-green-500 text-2xl font-semibold">Accepted ✔️</div>
              <div className="mt-4 text-white">
                <Button
                  onClick={onAiReview}
                  disabled={aiReviewLoading}
                  variant="outline"
                  size="lg"
                  className=" text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg shadow border-0 text-lg hover:text-white"
                >
                  {aiReviewLoading ? "Reviewing…" : "Ask CodeWizzy"}
                </Button>
              </div>
              {aiAnalysis && (
                <pre className="mt-4 font-jetbrains bg-gray-900  p-4 rounded-lg whitespace-pre-wrap">
                  {aiAnalysis}
                </pre>
              )}
            </>
          ) : (
            <div className="text-red-500 space-y-4">
              <h3 className="font-semibold">{verdict}</h3>
              {failedCase && (
                <>
                  <div>
                    <span className="font-medium text-gray-300">Input:</span>
                    <pre className="whitespace-pre-wrap text-sm text-gray-200">
                      {failedCase.input}
                    </pre>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Expected:</span>
                    <pre className="whitespace-pre-wrap text-sm text-gray-200">
                      {failedCase.expectedOutput}
                    </pre>
                  </div>
                  {failedCase.actualOutput && (
                    <div>
                      <span className="font-medium text-gray-300">Your Output:</span>
                      <pre className="whitespace-pre-wrap text-sm text-gray-200">
                        {failedCase.actualOutput}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
