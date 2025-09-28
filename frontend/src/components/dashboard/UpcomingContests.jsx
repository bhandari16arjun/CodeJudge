import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';

const UpcomingContests = () => {
  const contests = [
    {
      id: 1,
      name: 'Biweekly Contest 430',
      type: 'Biweekly',
      date: 'Dec 28, 2024',
      time: '8:00 PM',
      duration: '1h 30m',
      participants: '12,453',
      registered: false,
    },
    {
      id: 2,
      name: 'Weekly Contest 435',
      type: 'Weekly',
      date: 'Dec 30, 2024',
      time: '10:30 AM',
      duration: '1h 30m',
      participants: '18,642',
      registered: true,
    },
    {
      id: 3,
      name: 'Monthly Challenge',
      type: 'Monthly',
      date: 'Jan 1, 2025',
      time: '12:00 PM',
      duration: '3h',
      participants: '8,231',
      registered: false,
    },
  ];

  return (
    <Card className="bg-dark-card border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-bold text-white">
          <Clock className="w-5 h-5 mr-2 text-code-green" />
          Upcoming Contests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="p-4 bg-gray-800 rounded-lg border border-gray-600"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white">{contest.name}</h3>
              <Badge
                variant={
                  contest.type === 'Weekly'
                    ? 'default'
                    : contest.type === 'Biweekly'
                    ? 'secondary'
                    : 'outline'
                }
                className="text-xs bg-code-purple/20 text-code-purple border-code-purple"
              >
                {contest.type}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-300 mb-3">
              <div>
                {contest.date} at {contest.time}
              </div>
              <div className="flex items-center justify-between">
                <span>Duration: {contest.duration}</span>
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {contest.participants}
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant={contest.registered ? 'secondary' : 'default'}
              disabled={contest.registered}
              className={
                contest.registered
                  ? 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                  : 'bg-code-green hover:bg-code-green/90 text-white'
              }
            >
              {contest.registered ? 'Registered' : 'Register'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingContests;
