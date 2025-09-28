import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Trophy,
  Clock,
  Users,
  Code,
  Star,
  Target,
  Medal,
  ExternalLink,
  Check,
  AlertCircle,
  Calendar
} from "lucide-react";
import Header from "@/components/Header";

const Contests = () => {
  const [selectedContest, setSelectedContest] = useState(null);
  const [allContestsPage, setAllContestsPage] = useState(1);
  const [myContestsPage, setMyContestsPage] = useState(1);
  const contestsPerPage = 3; // Reduced to show pagination more easily

  // Limit to 2 upcoming contests
  const upcomingContests = [
    {
      id: 1,
      name: "Weekly Contest 456",
      date: "Sunday 8:00 AM GMT+5:30",
      countdown: "5d 10h 4m 6s",
      type: "Weekly",
      gradient: "from-blue-600 via-blue-500 to-cyan-400"
    },
    {
      id: 2,
      name: "Biweekly Contest 160",
      date: "Saturday 8:00 PM GMT+5:30",
      countdown: "11d 22h 4m 6s",
      type: "Biweekly",
      gradient: "from-emerald-600 via-teal-500 to-cyan-400"
    }
  ];

  // Limit to 3 recent contests
  const recentContests = [
    {
      id: 4,
      name: "Weekly Contest 291",
      date: "May 1, 2022",
      participants: 18642,
      winner: "alice_codes",
      type: "Weekly",
      gradient: "from-orange-600 via-red-500 to-pink-400",
      problems: [
        { id: 1, title: "Two Sum Variants", difficulty: "Easy", status: "solved" },
        { id: 2, title: "Binary Tree Paths", difficulty: "Medium", status: "attempted" },
        { id: 3, title: "Graph Coloring", difficulty: "Hard", status: "not-attempted" },
        { id: 4, title: "Dynamic Programming", difficulty: "Hard", status: "solved" }
      ]
    },
    {
      id: 5,
      name: "Weekly Contest 290",
      date: "Apr 24, 2022",
      participants: 25431,
      winner: "code_ninja",
      type: "Weekly",
      gradient: "from-gray-600 via-gray-500 to-slate-400",
      problems: [
        { id: 5, title: "Array Manipulation", difficulty: "Easy", status: "solved" },
        { id: 6, title: "String Algorithms", difficulty: "Medium", status: "solved" },
        { id: 7, title: "Tree Traversal", difficulty: "Medium", status: "attempted" },
        { id: 8, title: "Advanced DP", difficulty: "Hard", status: "not-attempted" }
      ]
    },
    {
      id: 6,
      name: "Biweekly Contest 85",
      date: "Aug 20, 2022",
      participants: 14567,
      winner: "algo_master",
      type: "Biweekly",
      gradient: "from-indigo-600 via-blue-500 to-cyan-400",
      problems: [
        { id: 9, title: "Linked List Operations", difficulty: "Easy", status: "solved" },
        { id: 10, title: "Binary Search Trees", difficulty: "Medium", status: "solved" },
        { id: 11, title: "Graph Algorithms", difficulty: "Hard", status: "attempted" },
        { id: 12, title: "Advanced Mathematics", difficulty: "Hard", status: "not-attempted" }
      ]
    }
  ];

  const allContests = [
    {
      id: 7,
      name: "Weekly Contest 433",
      date: "Dec 14, 2024",
      participants: 16234,
      problems: [
        { id: 13, title: "Two Sum Variants", difficulty: "Easy", status: "solved" },
        { id: 14, title: "Binary Tree Paths", difficulty: "Medium", status: "attempted" },
        { id: 15, title: "Graph Coloring", difficulty: "Hard", status: "not-attempted" },
        { id: 16, title: "Dynamic Programming", difficulty: "Hard", status: "solved" }
      ]
    },
    {
      id: 8,
      name: "Biweekly Contest 124",
      date: "Dec 7, 2024",
      participants: 14567,
      problems: [
        { id: 17, title: "Array Manipulation", difficulty: "Easy", status: "solved" },
        { id: 18, title: "String Algorithms", difficulty: "Medium", status: "solved" },
        { id: 19, title: "Tree Traversal", difficulty: "Medium", status: "attempted" },
        { id: 20, title: "Advanced DP", difficulty: "Hard", status: "not-attempted" }
      ]
    },
    {
      id: 9,
      name: "Weekly Contest 432",
      date: "Dec 7, 2024",
      participants: 19845,
      problems: [
        { id: 21, title: "Hash Table Problems", difficulty: "Easy", status: "solved" },
        { id: 22, title: "Sliding Window", difficulty: "Medium", status: "solved" },
        { id: 23, title: "Backtracking", difficulty: "Hard", status: "attempted" },
        { id: 24, title: "Graph Theory", difficulty: "Hard", status: "not-attempted" }
      ]
    },
    {
      id: 10,
      name: "Biweekly Contest 123",
      date: "Nov 23, 2024",
      participants: 12389,
      problems: [
        { id: 25, title: "Two Pointers", difficulty: "Easy", status: "solved" },
        { id: 26, title: "Binary Search", difficulty: "Medium", status: "attempted" },
        { id: 27, title: "Dynamic Programming", difficulty: "Hard", status: "not-attempted" },
        { id: 28, title: "Greedy Algorithms", difficulty: "Hard", status: "solved" }
      ]
    },
    {
      id: 11,
      name: "Weekly Contest 431",
      date: "Nov 30, 2024",
      participants: 21567,
      problems: [
        { id: 29, title: "Stack Problems", difficulty: "Easy", status: "solved" },
        { id: 30, title: "Tree Algorithms", difficulty: "Medium", status: "solved" },
        { id: 31, title: "Advanced DP", difficulty: "Hard", status: "attempted" },
        { id: 32, title: "Graph Coloring", difficulty: "Hard", status: "not-attempted" }
      ]
    },
    {
      id: 33,
      name: "Weekly Contest 430",
      date: "Nov 23, 2024",
      participants: 18765,
      problems: [
        { id: 41, title: "Array Problems", difficulty: "Easy", status: "solved" },
        { id: 42, title: "String Manipulation", difficulty: "Medium", status: "solved" },
        { id: 43, title: "Tree Problems", difficulty: "Hard", status: "attempted" },
        { id: 44, title: "Graph Algorithms", difficulty: "Hard", status: "not-attempted" }
      ]
    }
  ];

  const myContests = [
    {
      id: 4,
      name: "Weekly Contest 291",
      date: "May 1, 2022",
      solved: 3,
      total: 4,
      rank: 1247,
      rating: "+25",
      problems: [
        { id: 1, title: "Two Sum Variants", difficulty: "Easy", status: "solved" },
        { id: 2, title: "Binary Tree Paths", difficulty: "Medium", status: "attempted" },
        { id: 3, title: "Graph Coloring", difficulty: "Hard", status: "not-attempted" },
        { id: 4, title: "Dynamic Programming", difficulty: "Hard", status: "solved" }
      ]
    },
    {
      id: 5,
      name: "Weekly Contest 290",
      date: "Apr 24, 2022",
      solved: 2,
      total: 4,
      rank: 2156,
      rating: "-12",
      problems: [
        { id: 5, title: "Array Manipulation", difficulty: "Easy", status: "solved" },
        { id: 6, title: "String Algorithms", difficulty: "Medium", status: "solved" },
        { id: 7, title: "Tree Traversal", difficulty: "Medium", status: "attempted" },
        { id: 8, title: "Advanced DP", difficulty: "Hard", status: "not-attempted" }
      ]
    },
    {
      id: 12,
      name: "Biweekly Contest 89",
      date: "Mar 15, 2022",
      solved: 4,
      total: 4,
      rank: 567,
      rating: "+45",
      problems: [
        { id: 33, title: "String Matching", difficulty: "Easy", status: "solved" },
        { id: 34, title: "Linked Lists", difficulty: "Medium", status: "solved" },
        { id: 35, title: "Binary Trees", difficulty: "Medium", status: "solved" },
        { id: 36, title: "Advanced Algorithms", difficulty: "Hard", status: "solved" }
      ]
    },
    {
      id: 13,
      name: "Weekly Contest 289",
      date: "Mar 8, 2022",
      solved: 1,
      total: 4,
      rank: 3245,
      rating: "-18",
      problems: [
        { id: 37, title: "Array Sorting", difficulty: "Easy", status: "solved" },
        { id: 38, title: "Graph Traversal", difficulty: "Medium", status: "attempted" },
        { id: 39, title: "Dynamic Programming", difficulty: "Hard", status: "not-attempted" },
        { id: 40, title: "Number Theory", difficulty: "Hard", status: "not-attempted" }
      ]
    },
    {
      id: 45,
      name: "Weekly Contest 288",
      date: "Mar 1, 2022",
      solved: 2,
      total: 4,
      rank: 1876,
      rating: "+8",
      problems: [
        { id: 45, title: "Binary Search", difficulty: "Easy", status: "solved" },
        { id: 46, title: "Sliding Window", difficulty: "Medium", status: "solved" },
        { id: 47, title: "Tree Algorithms", difficulty: "Hard", status: "attempted" },
        { id: 48, title: "Graph Theory", difficulty: "Hard", status: "not-attempted" }
      ]
    }
  ];

  const globalRanking = [
    { rank: 1, username: "coding_master", rating: 2847, contests: 156 },
    { rank: 2, username: "algo_wizard", rating: 2763, contests: 142 },
    { rank: 3, username: "data_guru", rating: 2698, contests: 138 },
    { rank: 4, username: "code_ninja", rating: 2634, contests: 129 },
    { rank: 5, username: "problem_solver", rating: 2587, contests: 134 },
    { rank: 6, username: "binary_beast", rating: 2523, contests: 118 },
    { rank: 7, username: "recursion_king", rating: 2489, contests: 125 },
    { rank: 8, username: "dp_demon", rating: 2456, contests: 112 }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-900 text-green-300 border-green-700";
      case "Medium":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      case "Hard":
        return "bg-red-900 text-red-300 border-red-700";
      default:
        return "bg-gray-800 text-gray-300 border-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "solved":
        return <Check className="w-4 h-4 text-green-400" />;
      case "attempted":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const handleContestClick = (contest) => {
    setSelectedContest(contest);
  };

  // Pagination logic
  const allContestsTotalPages = Math.ceil(allContests.length / contestsPerPage);
  const myContestsTotalPages = Math.ceil(myContests.length / contestsPerPage);

  const paginatedAllContests = allContests.slice(
    (allContestsPage - 1) * contestsPerPage,
    allContestsPage * contestsPerPage
  );

  const paginatedMyContests = myContests.slice(
    (myContestsPage - 1) * contestsPerPage,
    myContestsPage * contestsPerPage
  );

  const renderPagination = (currentPage, totalPages, onPageChange) => (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={`${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } bg-white text-black hover:bg-gray-100 border border-gray-300`}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              onClick={() => onPageChange(i + 1)}
              isActive={currentPage === i + 1}
              className={`cursor-pointer bg-white text-black hover:bg-gray-100 border border-gray-300 ${
                currentPage === i + 1 ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={`${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } bg-white text-black hover:bg-gray-100 border border-gray-300`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <div className="min-h-screen bg-dark-bg">

      {/* Top Section */}
      <div className="bg-gradient-to-b from-gray-800 to-dark-bg">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-400 mb-2 relative">
              <span className="relative inline-block">&lt;&gt;</span>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-normal text-white mr-2">CodeCraft</span>
              <span className="text-4xl font-light text-white">Contests</span>
            </div>
            <p className="text-sm font-light text-gray-400 max-w-xl mx-auto">
              Contest every week. Compete and see your ranking!
            </p>
          </div>

          {/* Upcoming Contests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center mb-6">
              Upcoming Contests
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {upcomingContests.map((contest) => (
                  <Card
                    key={contest.id}
                    className="bg-dark-card border-2 border-gray-800 overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer w-80 shadow-2xl hover:shadow-gray-900/50"
                  >
                    <div
                      className={`h-44 bg-gradient-to-br ${contest.gradient} relative flex items-center justify-center`}
                    >
                      <Calendar className="w-10 h-10 text-white opacity-80" />
                      <div className="absolute top-4 left-4 text-white">
                        <Clock className="w-4 h-4 inline mr-1" />
                        <span className="text-sm font-medium">
                          Starts in {contest.countdown}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4 pt-3">
                      <h3 className="text-xl font-light text-white mb-1">
                        {contest.name}
                      </h3>
                      <p className="text-gray-300 text-sm">{contest.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Contests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center mb-6">
              Featured Contests
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                {recentContests.map((contest) => (
                  <Card
                    key={contest.id}
                    className="bg-dark-card border-2 border-gray-800 overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer w-64 shadow-2xl hover:shadow-gray-900/50"
                    onClick={() => handleContestClick(contest)}
                  >
                    <div
                      className={`h-36 bg-gradient-to-br ${contest.gradient} relative flex items-center justify-center`}
                    >
                      <Trophy className="w-7 h-7 text-white opacity-80" />
                    </div>
                    <CardContent className="p-4 pt-3">
                      <h3 className="text-lg font-light text-white mb-2">
                        {contest.name}
                      </h3>
                      <div className="text-xs text-gray-300">
                        <div>Ended {contest.date}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-dark-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-start gap-8 max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="w-full max-w-2xl">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700 h-10 p-1">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm py-1 h-8 flex items-center justify-center"
                  >
                    All Contests
                  </TabsTrigger>
                  <TabsTrigger
                    value="my-contests"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm py-1 h-8 flex items-center justify-center"
                  >
                    My Contests
                  </TabsTrigger>
                </TabsList>

                {/* All Contests Tab */}
                <TabsContent value="all" className="space-y-2 mt-4">
                  <div className="bg-dark-card border-2 border-gray-800 rounded-lg">
                    {paginatedAllContests.map((contest, index) => (
                      <div
                        key={contest.id}
                        className={`flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                          index !== paginatedAllContests.length - 1
                            ? "border-b border-gray-700"
                            : ""
                        }`}
                        onClick={() => handleContestClick(contest)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {contest.name}
                            </h3>
                            <div className="text-sm text-gray-400">
                              {contest.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {contest.participants.toLocaleString()} participants
                        </div>
                      </div>
                    ))}
                  </div>
                  {renderPagination(
                    allContestsPage,
                    allContestsTotalPages,
                    setAllContestsPage
                  )}
                </TabsContent>

                {/* My Contests Tab */}
                <TabsContent value="my-contests" className="space-y-2 mt-4">
                  <div className="bg-dark-card border-2 border-gray-800 rounded-lg">
                    {paginatedMyContests.map((contest, index) => (
                      <div
                        key={contest.id}
                        className={`flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                          index !== paginatedMyContests.length - 1
                            ? "border-b border-gray-700"
                            : ""
                        }`}
                        onClick={() => handleContestClick(contest)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <Medal className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {contest.name}
                            </h3>
                            <div className="text-sm text-gray-400">
                              {contest.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-8 text-sm">
                          <div className="text-center">
                            <div className="text-gray-400">Solved</div>
                            <div className="font-medium text-white text-base">
                              {contest.solved}/{contest.total}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-400">Rank</div>
                            <div className="font-medium text-white text-base">
                              #{contest.rank}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-400">Rating</div>
                            <div
                              className={`font-medium text-base ${
                                contest.rating.startsWith("+")
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {contest.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {renderPagination(
                    myContestsPage,
                    myContestsTotalPages,
                    setMyContestsPage
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Global Ranking Sidebar */}
            <div className="w-80 flex-shrink-0">
              <Card className="bg-dark-card border-2 border-gray-800 sticky top-8 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl font-bold text-white">
                    <Trophy className="w-6 h-6 mr-2 text-code-orange" />
                    Global Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {globalRanking.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            user.rank <= 3
                              ? "bg-code-orange text-white"
                              : "bg-gray-700 text-white"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <div>
                          <div
                            className={`font-medium text-sm ${
                              user.rank <= 3
                                ? "text-yellow-400"
                                : "text-white"
                            }`}
                          >
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-400">
                            {user.contests} contests
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-code-blue text-sm">
                          {user.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Problems Modal */}
      <Dialog
        open={!!selectedContest}
        onOpenChange={() => setSelectedContest(null)}
      >
        <DialogContent className="max-w-2xl bg-dark-card border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {selectedContest?.name} - Problems
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedContest?.problems?.map((problem, index) => (
              <div
                key={problem.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-code-blue transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-code-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    {getStatusIcon(problem.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{problem.title}</h3>
                    <Badge
                      className={`${getDifficultyColor(
                        problem.difficulty
                      )} border mt-1`}
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-code-green hover:bg-code-green/90 text-white"
                >
                  <Code className="w-4 h-4 mr-1" />
                  Solve
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contests;
