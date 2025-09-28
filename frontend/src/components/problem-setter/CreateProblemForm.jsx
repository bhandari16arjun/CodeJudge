import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileJson,
  Upload,
  X,
  Info,
  Code,
  TestTube,
  EyeOff,
  AlertCircle,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/problems`;

export default function CreateProblemForm({ editingProblem, onProblemSaved }) {
  const { toast } = useToast();

  const [activeStep, setActiveStep] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    difficulty: "",
    tags: [],
    statement: "",
    constraints: "",
    sampleTestCases: null,
    hiddenTestCases: null,
  });

  const [sampleJSON, setSampleJSON] = useState(null); 
  const [hiddenJSON, setHiddenJSON] = useState(null);
  const [currentTag, setCurrentTag] = useState("");

  useEffect(() => {
    (async () => {
      if (!editingProblem) return;

      setFormData({
        title: editingProblem.title || "",
        difficulty: editingProblem.difficulty || "",
        tags: editingProblem.tags || [],
        statement: editingProblem.statement || "",
        constraints: editingProblem.constraints || "",
        sampleTestCases: null,
        hiddenTestCases: null,
      });

      try {
        const { data } = await axios.get(
          `${BASE}/testcases/${editingProblem._id}`,
          { withCredentials: true }
        );
        setSampleJSON(data.sampleTestCases);
        setHiddenJSON(data.hiddenTestCases);
      } catch (err) {
        console.error(err);
        toast({
          title: "Warning",
          description: "Could not fetch existing test-case files.",
        });
      }
    })();
  }, [editingProblem, toast]);

  const isFormValid = useMemo(() => {
    return (
      formData.title.trim() &&
      formData.difficulty &&
      formData.statement.trim() &&
      formData.constraints.trim() &&
      (formData.sampleTestCases || sampleJSON) &&
      (formData.hiddenTestCases || hiddenJSON)
    );
  }, [formData, sampleJSON, hiddenJSON]);

  const handleAddTag = () => {
    const t = currentTag.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData((p) => ({ ...p, tags: [...p.tags, t] }));
    }
    setCurrentTag("");
  };
  const handleRemoveTag = (tag) =>
    setFormData((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

  const handleFileUpload = (type, file) => {
    if (file && file.type !== "application/json") {
      toast({
        title: "Invalid file",
        description: "Please upload a JSON file.",
        variant: "destructive",
      });
      return;
    }
    if (type === "sample") setSampleJSON(null);
    else setHiddenJSON(null);

    setFormData((p) => ({
      ...p,
      [type === "sample" ? "sampleTestCases" : "hiddenTestCases"]: file,
    }));
  };

  const downloadPrefetched = (json, filename) => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(json, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveProblem = async () => {
    if (!isFormValid) {
      toast({
        title: "Complete all fields",
        description: "Every required input & both JSON files must be present.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title.trim());
      fd.append("difficulty", formData.difficulty);
      fd.append("statement", formData.statement.trim());
      fd.append("constraints", formData.constraints.trim());
      fd.append("tags", JSON.stringify(formData.tags));

      formData.sampleTestCases &&
        fd.append("sampleTestCases", formData.sampleTestCases);
      formData.hiddenTestCases &&
        fd.append("hiddenTestCases", formData.hiddenTestCases);

      const url = editingProblem
        ? `${BASE}/updateProblem/${editingProblem._id}`
        : `${BASE}/addProblem`;
      const method = editingProblem ? "put" : "post";

      await axios({ url, method, data: fd, withCredentials: true });

      toast({
        title: editingProblem ? "Problem updated!" : "Problem created!",
        description: "Changes saved successfully.",
      });

      if (!editingProblem) {
        setFormData({
          title: "",
          difficulty: "",
          tags: [],
          statement: "",
          constraints: "",
          sampleTestCases: null,
          hiddenTestCases: null,
        });
        setSampleJSON(null);
        setHiddenJSON(null);
        setActiveStep("basic");
      }
      onProblemSaved?.();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileUpload = (type) => {
    const isEdit = !!editingProblem;
    const filename =
      type === "sample" ? "sampleTestCases.json" : "hiddenTestCases.json";
    const fileState =
      formData[type === "sample" ? "sampleTestCases" : "hiddenTestCases"];
    const prefetched = type === "sample" ? sampleJSON : hiddenJSON;

    return (
      <div className="space-y-4">
        <Label className="text-white mb-2 block">
          {type === "sample"
            ? "Sample Test Cases (JSON) *"
            : "Hidden Test Cases (JSON) *"}
        </Label>

        {isEdit && prefetched && !fileState && (
          <div className="mb-4 p-4 bg-dark-card/30 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileJson className="h-5 w-5 text-code-blue" />
                <p className="text-white font-medium">{filename}</p>
              </div>
              <Button
                onClick={() => downloadPrefetched(prefetched, filename)}
                className="bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          <FileJson className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {fileState ? (
            <>
              <p className="text-white">{fileState.name}</p>
              <p className="text-gray-400 text-sm">
                {(fileState.size / 1024).toFixed(2)} KB
              </p>
              <Button variant="outline" onClick={() => handleFileUpload(type, null)}>
                Remove File
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-4">
                {isEdit
                  ? "Upload a new JSON file to replace the existing one"
                  : "Drop JSON here or click to browse"}
              </p>
              <input
                id={`${type}-upload`}
                type="file"
                accept=".json"
                onChange={(e) =>
                  handleFileUpload(type, e.target.files?.[0] || null)
                }
                className="hidden"
              />
              <Button asChild>
                <label htmlFor={`${type}-upload`} className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {isEdit ? "Upload New File" : "Upload JSON File"}
                </label>
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };


  return (
    <Card className="bg-dark-card/95 border-gray-600 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Code className="h-6 w-6 text-code-blue" />
          {editingProblem ? "Edit Problem" : "Create Problem"}
        </CardTitle>
        <p className="text-gray-400">
          {editingProblem
            ? "Update an existing challenge"
            : "Craft a new challenge for the community"}
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
          
          <TabsList className="grid w-full grid-cols-5 bg-dark-card/50 border border-gray-600">
            {[
              { v: "basic",       i: <Info       className="h-4 w-4 mr-1" />, l: "Basic Info"   },
              { v: "statement",   i: <FileJson   className="h-4 w-4 mr-1" />, l: "Statement"   },
              { v: "constraints", i: <AlertCircle className="h-4 w-4 mr-1" />, l: "Constraints"},
              { v: "sample",      i: <TestTube   className="h-4 w-4 mr-1" />, l: "Sample Cases"},
              { v: "hidden",      i: <EyeOff     className="h-4 w-4 mr-1" />, l: "Hidden Tests"},
            ].map(({ v, i, l }) => (
              <TabsTrigger
                key={v}
                value={v}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-code-purple data-[state=active]:to-code-blue data-[state=active]:text-white text-gray-300"
              >
                {i}
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          
          <TabsContent value="basic" className="mt-6 space-y-6">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="title" className="text-white mb-2 block">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Two Sum"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  className="bg-dark-card/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Difficulty *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, difficulty: v }))
                  }
                >
                  <SelectTrigger className="bg-dark-card/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-card border-gray-600">
                    {["Easy", "Medium", "Hard"].map((d) => (
                      <SelectItem key={d} value={d} className="text-white">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white mb-2 block">Tags</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag and press Enter"
                    className="bg-dark-card/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={handleAddTag}
                    className="bg-gradient-to-r from-code-purple to-code-blue"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-code-blue/20 text-code-blue border-code-blue/30"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-red-400"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

        
          <TabsContent value="statement" className="mt-6">
            <Label className="text-white mb-2 block">Problem Statement *</Label>
            <Textarea
              value={formData.statement}
              onChange={(e) =>
                setFormData((p) => ({ ...p, statement: e.target.value }))
              }
              placeholder="Describe the problem..."
              className="min-h-[300px] bg-dark-card/50 border-gray-600 text-white"
            />
          </TabsContent>

       
          <TabsContent value="constraints" className="mt-6">
            <Label className="text-white mb-2 block">Constraints *</Label>
            <Textarea
              value={formData.constraints}
              onChange={(e) =>
                setFormData((p) => ({ ...p, constraints: e.target.value }))
              }
              placeholder="e.g., 1 ≤ n ≤ 10^4"
              className="min-h-[200px] bg-dark-card/50 border-gray-600 text-white"
            />
          </TabsContent>

        
          <TabsContent value="sample"	className="mt-6">
            {renderFileUpload("sample")}
          </TabsContent>
          <TabsContent value="hidden" className="mt-6">
            {renderFileUpload("hidden")}
          </TabsContent>
        </Tabs>

     
        <div className="mt-8 flex justify-end">
          <Button
            disabled={!isFormValid || isSubmitting}
            onClick={handleSaveProblem}
            className="bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple text-white px-8 py-2 font-semibold disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : editingProblem
              ? "Update Problem"
              : "Create Problem"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
