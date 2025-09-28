import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Zap } from 'lucide-react';
import { getProfile } from '@/store/authSlice';

const ProblemStats = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  const [platform, setPlatform] = useState({ Easy: 0, Medium: 0, Hard: 0, total: 0 });
  const [userStats, setUserStats] = useState({ easy: 0, medium: 0, hard: 0, total: 0 });

  useEffect(() => {
    if (status === 'idle') dispatch(getProfile());
  }, [dispatch, status]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/problems/summary`, { withCredentials: true })
      .then(({ data }) => data.success && setPlatform(data.stats))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user._id}/stats`, { withCredentials: true })
      .then(({ data }) => data.success && setUserStats(data.stats))
      .catch(console.error);
  }, [user?._id]);

  if (status === 'loading' || !user) return null;

  const pct = (num, denom) => (denom ? ((num / denom) * 100).toFixed(1) : '0.0');

  const { Easy, Medium, Hard, total: pTotal } = platform;
  const { easy: uEasy, medium: uMed, hard: uHard, total: uTotal } = userStats;

  const overallPct = pct(uTotal, pTotal);
  const easyPct    = pct(uEasy, Easy);
  const medPct     = pct(uMed, Medium);
  const hardPct    = pct(uHard, Hard);

  return (
    <Card className="bg-dark-card/95 border-gray-600 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-code-blue" />
          Your Progress
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{uTotal}</div>
          <div className="text-sm text-gray-300 mb-3">
            problems solved out of {pTotal}
          </div>
          <div className="bg-gray-700/50 rounded-full h-3 w-full mx-auto" style={{ maxWidth: 300 }}>
            <div
              className="bg-gradient-to-r from-code-purple to-code-blue h-3 rounded-full"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">{overallPct}%</div>
        </div>

        
        <StatRow
          icon={<Target className="h-4 w-4 text-green-500" />}
          label="Easy"
          solved={uEasy}
          total={Easy}
          percentage={easyPct}
          barClass="bg-green-500"
          textClass="text-green-500"
        />
        <StatRow
          icon={<Zap className="h-4 w-4 text-yellow-500" />}
          label="Medium"
          solved={uMed}
          total={Medium}
          percentage={medPct}
          barClass="bg-yellow-500"
          textClass="text-yellow-500"
        />
        <StatRow
          icon={<Trophy className="h-4 w-4 text-red-600" />}
          label="Hard"
          solved={uHard}
          total={Hard}
          percentage={hardPct}
          barClass="bg-red-600"
          textClass="text-red-600"
        />
      </CardContent>
    </Card>
  );
};

const StatRow = ({ icon, label, solved, total, percentage, barClass, textClass }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        
        <span className={`${textClass} font-medium`}>{label}</span>
      </div>
      <span className="text-sm text-gray-300 font-medium">
        {solved}/{total}
      </span>
    </div>
    <div className="bg-gray-700/50 rounded-full h-2 w-full">
      <div
        className={`${barClass} h-2 rounded-full`}
        style={{ width: `${percentage}%` }}
      />
    </div>
    <div className="text-xs text-gray-400 text-right">{percentage}%</div>
  </div>
);

export default ProblemStats;
