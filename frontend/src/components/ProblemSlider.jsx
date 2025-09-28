import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Zap } from 'lucide-react';

const ICON_MAP = {
  Easy: Trophy,
  Medium: Star,
  Hard: Zap,
};

const DESCRIPTIONS = {
  "Maximum of Two Numbers": "Given two numbers, compute and print their maximum",
  "Absoute Difference":      "Compute the absolute difference |a – b| for two integers.",
  "Area of a Rectangle":      "Provided with length and width, compute the area.",
  "Two Sum":                  "Given two numbers, compute and print their sum."
};

export default function ProblemSlider() {
  const [hotProblems, setHotProblems] = useState([]);
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHot() {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/problems/hot`,
          { withCredentials: true }
        );
        if (data.success) setHotProblems(data.problems);
      } catch (err) {
        console.error('Failed to load hot problems:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHot();
  }, []);

  if (loading) return <p className="text-gray-400">Loading challenges…</p>;
  if (!hotProblems.length) return <p className="text-gray-400">No hot problems right now.</p>;

  const goTo = (num) => navigate(`/problems/${num}`);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Top Challenging Problems</h2>
        <p className="text-gray-400">Test your skills on the freshest problems</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hotProblems.map((p) => {
          const Icon = ICON_MAP[p.difficulty] || Trophy;
          const desc = DESCRIPTIONS[p.title] || "";

          return (
            <Card
              key={p._id}
              className="group bg-dark-card/90 border-gray-700 hover:bg-dark-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardHeader className="pb-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                    p.difficulty === 'Hard'
                      ? 'from-red-500 to-pink-500'
                      : p.difficulty === 'Medium'
                      ? 'from-yellow-400 to-orange-400'
                      : 'from-green-500 to-teal-500'
                  } flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <CardTitle className="text-lg text-white line-clamp-2 leading-tight">
                  {p.title}
                </CardTitle>

                {desc && (
                  <p className="text-gray-400 text-sm mt-1 mb-2 line-clamp-3">
                    {desc}
                  </p>
                )}

                <div>
                  <Badge
                    variant="outline"
                    className={`font-semibold ${
                      p.difficulty === 'Hard'
                        ? 'border-red-500/30 text-red-400 bg-red-500/20'
                        : p.difficulty === 'Medium'
                        ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/20'
                        : 'border-green-500/30 text-green-500 bg-green-500/20'
                    }`}
                  >
                    {p.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-gray-700/50 text-gray-300 flex justify-center"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-code-purple to-code-blue hover:from-code-blue hover:to-code-purple text-white transition-all text-sm"
                  onClick={() => goTo(p.problemNumber)}
                >
                  Solve Challenge
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
