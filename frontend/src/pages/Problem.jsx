import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import ProblemSlider from '@/components/ProblemSlider';
import ProblemCard from '@/components/ProblemCard';
import ProblemStats from '@/components/ProblemStats';
import Footer from '@/components/Footer';

const Problems = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user._id)
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All Topics');
  const [currentPage, setCurrentPage] = useState(1);
  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const userProgressLevel = 3;
  const problemsPerPage = userProgressLevel * 5;

  const topics = ['All Topics', 'Array', 'Hash Table', 'String', 'Linked List', 'Math', 'Binary Search', 'Dynamic Programming', 'Brute Force', 'Geometry'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses = ['All', 'Solved', 'Unsolved'];

  // ✅ Fetch solved problem IDs once
  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user._id}/solved-problems`, {
          withCredentials: true,
        });
        if (data.success) {
          setSolvedProblems(data.solvedProblemIds);
        }
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    if (user?._id) fetchSolved();
  }, [user?._id]);

  // 🔄 Fetch filtered problems
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: problemsPerPage,
        };
        if (difficultyFilter !== 'All') params.difficulty = difficultyFilter;
        if (topicFilter !== 'All Topics') params.tags = topicFilter;
        if (statusFilter !== 'All') {
          if (statusFilter === 'Solved') params.solved = 'true';
          if (statusFilter === 'Unsolved') params.solved = 'false';
        }
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`, {
          params,
          withCredentials: true,
        });

        if (data.success) {
          // ✅ Add `solved: true/false` flag per problem
          const withSolved = data.problems.map((p) => ({
            ...p,
            solved: solvedProblems.includes(p._id.toString()),
          }));
          setProblems(withSolved);
          setTotal(data.total);
        }
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [searchTerm, difficultyFilter, statusFilter, topicFilter, currentPage, solvedProblems]);

  const totalPages = Math.ceil(total / problemsPerPage);

  const handleNextPage = () => setCurrentPage((cp) => Math.min(cp + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((cp) => Math.max(cp - 1, 1));

  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === 'difficulty') setDifficultyFilter(value);
    if (type === 'status') setStatusFilter(value);
    if (type === 'topic') setTopicFilter(value);
    if (type === 'search') setSearchTerm(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      {/* Hero */}
      <section className="px-4 py-12 bg-gradient-to-br from-dark-bg via-dark-card/30 to-dark-bg">
        <div className="container text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Coding{' '}
            <span className="bg-gradient-to-r from-code-blue to-code-purple bg-clip-text text-transparent">
              Problems
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Solve problems, practice algorithms, and improve your coding skills
          </p>
        </div>
      </section>

      {/* Slider */}
      <section className="px-4 py-8">
        <div className="container">
          <ProblemSlider />
        </div>
      </section>

      {/* Main */}
      <section className="flex-1 px-4 py-8">
        <div className="container grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      onClick={() => handleFilterChange('difficulty', d)}
                      className={
                        difficultyFilter === d
                          ? 'bg-gradient-to-r from-code-purple to-code-blue text-white shadow-lg font-semibold'
                          : 'border-gray-500 text-gray-900 bg-gray-100 hover:bg-dark-card/80 hover:text-white hover:border-code-blue/50 font-semibold'
                      }
                    >
                      {d}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {statuses.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      onClick={() => handleFilterChange('status', s)}
                      className={
                        statusFilter === s
                          ? 'bg-gradient-to-r from-code-purple to-code-blue text-white shadow-lg font-semibold'
                          : 'border-gray-500 text-gray-900 bg-gray-100 hover:bg-dark-card/80 hover:text-white hover:border-code-blue/50 font-semibold'
                      }
                    >
                      {s}
                    </Button>
                  ))}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="border-gray-500 text-gray-900 bg-gray-100 hover:bg-dark-card/80 hover:text-white hover:border-code-blue/50 font-semibold min-w-[120px] justify-between"
                    >
                      {topicFilter}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-dark-card border-gray-600 shadow-xl z-50" align="start">
                    {topics.map((t) => (
                      <DropdownMenuItem
                        key={t}
                        onClick={() => handleFilterChange('topic', t)}
                        className={`text-white hover:bg-code-blue/20 hover:text-code-blue cursor-pointer font-medium ${
                          topicFilter === t ? 'bg-code-blue/20 text-code-blue' : ''
                        }`}
                      >
                        {t}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Summary */}
            <p className="text-gray-400 text-sm mb-4">
              {loading ? 'Loading…' : `${total} problems found`} (Level {userProgressLevel}: {problemsPerPage} per page)
            </p>

            {/* Problem Cards */}
            <div className="space-y-3 mb-6">
              {problems.map((p) => (
                <ProblemCard key={p._id} problem={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-code-purple to-code-blue text-white shadow-lg min-w-[2.5rem] font-bold"
                >
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              <ProblemStats />
            </div>
          </div>
        </div>
      </section>

      {/* Footer (optional) */}
    </div>
  );
};

export default Problems;
