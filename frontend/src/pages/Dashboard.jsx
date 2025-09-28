// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

import UserProfile from '@/components/dashboard/UserProfile'
import UpcomingContests from '@/components/dashboard/UpcomingContests'
import RatingChart from '@/components/dashboard/RatingChart'
import RecentSubmissions from '@/components/dashboard/RecentSubmissions'
import SubmissionModal from '@/components/dashboard/SubmissionModal'
import ProgressShowcase from '@/components/ProgressShowCase'
import ActivityHeatmap from '@/components/ActivityHeatMap'

const Dashboard = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [activityData, setActivityData] = useState({})
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${user._id}/heatmap`,
  { withCredentials: true }
);
        if (res.data.success) {
          setActivityData(res.data.activity)
        }
      } catch (err) {
        console.error('Failed to fetch activity data:', err)
      }
    }

    if (user?._id) fetchActivity()
  }, [user])

  const heatmapData = Object.entries(activityData).map(([date, count]) => ({
    date,
    count
  }))
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8 w-full">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <UserProfile />
            <UpcomingContests />
          </div>
          <div className="lg:col-span-9 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ProgressShowcase />
              <RatingChart userId={user._id}/>
            </div>

            <ActivityHeatmap data={heatmapData} />

            <RecentSubmissions onSubmissionClick={setSelectedSubmission} />
          </div>
        </div>
      </div>

      <SubmissionModal 
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  )
}

export default Dashboard
