import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Lock } from 'lucide-react';

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();

  const difficultyStyles = {
    Easy:   "border-green-500/30 bg-green-500/20 text-green-500",
    Medium: "border-yellow-500/30 bg-yellow-500/20 text-yellow-400",
    Hard:   "border-red-600/30 bg-red-600/20 text-red-600",
  };

  const goToProblem = () => {
    navigate(`/problems/${problem.problemNumber}`);
  };

  return (
    <Card
      onClick={goToProblem}
      className="cursor-pointer bg-dark-card/95 border-gray-600 hover:bg-dark-card hover:border-code-blue/50 transition-all duration-300 p-4 shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          
          <div className="flex items-center justify-center w-6 h-6">
            {problem.solved ? (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-4 h-3 text-white" />
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-500 rounded-full hover:border-code-blue transition-colors"></div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 font-medium">
                {problem.problemNumber}.
              </span>
              <h3 className="text-white font-medium">
                {problem.title}
              </h3>
              {problem.premium && <Lock className="w-4 h-4 text-code-orange" />}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {problem.tags.slice(0, 3).map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-gray-700/80 text-gray-200 hover:bg-gray-600/80 border border-gray-600/50"
                >
                  {tag}
                </Badge>
              ))}
              {problem.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{problem.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Badge
            variant="outline"
            className={`font-semibold ${difficultyStyles[problem.difficulty]}`}
          >
            {problem.difficulty}
          </Badge>
          <span className="text-gray-300 font-bold">
            {problem.acceptance}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProblemCard;
