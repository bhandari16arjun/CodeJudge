import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function monthName(monthNumber) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[monthNumber - 1] || null;
}

function getCodingTitle(solvedTotal) {
  if (solvedTotal < 10) return 'Newbie';
  if (solvedTotal < 30) return 'Pupil';
  if (solvedTotal < 60) return 'Specialist';
  if (solvedTotal < 100) return 'Expert';
  if (solvedTotal < 150) return 'Candidate Master';
  if (solvedTotal < 250) return 'Master';
  return 'Grand Master';
}

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user._id}/stats`);
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return null;

  const [year, month] = user.createdAt.split('T')[0].split('-');
  const joinDate = `${monthName(parseInt(month))} ${year}`;

  const codingTitle = getCodingTitle(stats?.total || 0);

  return (
    <Card className="bg-dark-card border-gray-700">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src="/placeholder.svg" alt={user.name} />
          <AvatarFallback className="bg-indigo-500 text-white text-xl font-bold">
            {user.name
              .split(' ')
              .map((n) => n[0].toUpperCase())
              .join('')}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-bold text-white">
          {user.name}
        </CardTitle>
        <p className="text-indigo-500 font-medium">{user.email}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-code-purple/20 text-code-purple border-code-purple">
            {codingTitle}
          </Badge>
          <span className="text-sm font-medium text-gray-300">
            {user.globalRank === 0 ? '' : user.globalRank}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            Joined {joinDate}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Trophy className="w-4 h-4 mr-2" />
            No Contest Yet
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
