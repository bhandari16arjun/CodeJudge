import React from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const ProblemDescription = ({ problem, sampleTestCases }) => {
  const navigate = useNavigate();
  if (!problem) return null;

  const [description, , inputDesc, , outputDesc] = problem.statement.split("\n");
  const constraints = problem.constraints.split("\n");

  return (
    <div className="h-full bg-[#0f1419] border-r border-[#1e2328] relative">
      
   

      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
       
          <div className="border-b border-[#1e2328] pb-4">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-gray-100">
                {problem.problemNumber}. {problem.title}
                </span>
                <Badge
                variant="secondary"
                className={`${
                  problem.difficulty === "Easy"
                    ? "bg-green-900/50 text-green-500"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-700/50 text-yellow-500"
                    : "bg-red-900/50 text-red-600"
                }`}
              >
                {problem.difficulty}
                </Badge>
                <Button
          variant="ghost"
          size="sm"
          className="bg-[#1e2328] border-[#2a2f36] hover:text-black"
          onClick={() => navigate("/problems")}
        >
          <span className="text-sm">View Problems</span>

                </Button>
            </div>
            <div className="flex gap-2 ml-7">
              {problem.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-gray-300 border-gray-500/30 bg-gray-700/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

         
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-100">
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-100">
              Input / Output
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong>Input:</strong> {inputDesc}
              </p>
              <p>
                <strong>Output:</strong> {outputDesc}
              </p>
            </div>
          </div>

          {sampleTestCases?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-100">
                Examples
              </h3>
              {sampleTestCases.map((ex, idx) => (
                <div
                  key={idx}
                  className="mb-6 bg-[#1e2328]/50 rounded-lg p-4 border border-[#2a2f36]"
                >
                  <h4 className="font-medium mb-3 text-gray-200">
                    Example {idx + 1}:
                  </h4>
                  <div className="space-y-3 font-mono text-sm">
                    <div>
                      <span className="text-gray-400 block mb-1">Input</span>
                      <pre className="text-gray-100 bg-[#0f1419] p-2 rounded border border-[#2a2f36]">
                        {ex.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Output</span>
                      <pre className="text-gray-100 bg-[#0f1419] p-2 rounded border border-[#2a2f36]">
                        {ex.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-100">
              Constraints
            </h3>
            <div className="space-y-2">
              {constraints.map((c, i) => (
                <div
                  key={i}
                  className="bg-[#2a2f36] rounded-lg p-3 border border-[#3a3f46]"
                >
                  <div className="text-gray-300 font-mono text-sm flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                    {c}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProblemDescription;
