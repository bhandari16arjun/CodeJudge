import React from "react";
import { Editor } from "@monaco-editor/react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Code2, Play, Send } from "lucide-react";

const CodeEditor = ({
  language,
  code,
  onCodeChange,
  onLanguageChange,
  running,
  submitting,
  onRun,
  onSubmit,
}) => {
  const languages = [
    { value: "cpp",    label: "C++"     },
    { value: "python", label: "Python"  },
  ];

  return (
    <div className="h-full bg-[#0f1419] flex flex-col">
      
      <div className="flex items-center justify-between p-4 border-b border-[#1e2328] bg-[#0f1419]">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-blue-400" />
          <span className="font-medium text-gray-200">Code Editor</span>
        </div>

        <div className="flex items-center gap-3">
          
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-28 bg-[#1e2328] border-[#2a2f36] text-gray-200 hover:bg-[#2a2f36] gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e2328] border-[#2a2f36] z-50">
              {languages.map((l) => (
                <SelectItem
                  key={l.value}
                  value={l.value}
                  className="text-gray-200"
                >
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          
          <Button
            onClick={onRun}
            variant="outline"
            size="sm"
            disabled={running || submitting}
            className="bg-[#1e2328] border-[#2a2f36] text-gray-200 "
          >
            <Play className="h-4 w-4 mr-0" />
            {running ? "Running…" : "Run"}
          </Button>

          
          <Button
            onClick={onSubmit}
            size="sm"
            disabled={running || submitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </div>

      
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(v) => onCodeChange(v || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
