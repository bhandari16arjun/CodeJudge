import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateProblemForm from "@/components/problem-setter/CreateProblemForm";
import ProblemsList from "@/components/problem-setter/ProblemsList";

const ProblemSetter = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editingProblem, setEditingProblem] = useState(null);

  const handleEditProblem = (problem) => {
    setEditingProblem(problem);
    setActiveTab("manage");
  };

  const handleProblemSaved = () => {
    setEditingProblem(null);
    setActiveTab("list");
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value !== "manage") setEditingProblem(null); // clear edit state
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">

      {/* Hero Section */}
      <section className="px-4 py-12 bg-gradient-to-br from-dark-bg via-dark-card/30 to-dark-bg">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Problem{" "}
              <span className="bg-gradient-to-r from-code-blue to-code-purple bg-clip-text text-transparent">
                Setter
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create and manage coding problems for the community
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 px-4 py-4">
        <div className="container max-w-6xl">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-dark-card/50 border border-gray-600">
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-code-purple data-[state=active]:to-code-blue data-[state=active]:text-white text-gray-300"
              >
                <FileText className="h-4 w-4 mr-2" />
                Browse Problems
              </TabsTrigger>

              <TabsTrigger
                value="manage"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-code-purple data-[state=active]:to-code-blue data-[state=active]:text-white text-gray-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage Problems
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              <ProblemsList onEditProblem={handleEditProblem} />
            </TabsContent>

            <TabsContent value="manage" className="mt-4">
              <CreateProblemForm
                editingProblem={editingProblem}
                onProblemSaved={handleProblemSaved}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ProblemSetter;