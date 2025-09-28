import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import CircularProgress from './CircularProgress'
import { getProfile } from '@/store/authSlice'

export default function ProgressShowcase() {
  const dispatch = useDispatch()
  const { user, status } = useSelector((state) => state.auth)

  const [platformStats, setPlatformStats] = useState({
    Easy:   0,
    Medium: 0,
    Hard:   0,
    total:  0,
  })

  const [userStats, setUserStats] = useState({
    easy:   0,
    medium: 0,
    hard:   0,
    total:  0,
  })
  useEffect(() => {
    if (status === 'idle') dispatch(getProfile())
  }, [dispatch, status])
  useEffect(() => {
    async function fetchPlatform() {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/problems/summary`,
          { withCredentials: true }
        )
        if (data.success) setPlatformStats(data.stats)
      } catch (err) {
        console.error('Failed to fetch platform stats:', err)
      }
    }
    fetchPlatform()
  }, [])
  useEffect(() => {
    if (!user?._id) return
    async function fetchUser() {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${user._id}/stats`,
          { withCredentials: true }
        )
        if (data.success) setUserStats(data.stats)
      } catch (err) {
        console.error('Failed to fetch user stats:', err)
      }
    }
    fetchUser()
  }, [user?._id])

  if (status === 'loading' || !user) return null

  const pct = (num, denom) =>
    denom > 0 ? ((num / denom) * 100).toFixed(1) : '0.0'

  const { total: pTotal, Easy, Medium, Hard } = platformStats
  const { total: uTotal, easy: uEasy, medium: uMed, hard: uHard } = userStats

  const overallPct = pct(uTotal, pTotal)
  const easyPct  = pct(uEasy, Easy)
  const medPct   = pct(uMed, Medium)
  const hardPct  = pct(uHard, Hard)

  return (
    <div className="flex justify-center w-full">
      <Card className="bg-dark-card border-gray-700 w-full pb-3 pt-2">
    
        <div className="flex justify-center mb-6">
          <CircularProgress
            solved={uTotal}
            total={pTotal}
            attempting={0}
            size={200}
            strokeWidth={10}
          />
        </div>

        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center w-[90%] mx-auto">
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <div className="text-green-500 font-semibold mb-2">Easy</div>
            <div className="text-white text-lg mb-2">{uEasy}/{Easy}</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: Easy > 0 ? `${easyPct}%` : '0%' }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {easyPct}%
            </div>
          </div>

          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <div className="text-yellow-500 font-semibold mb-2">Medium</div>
            <div className="text-white text-lg mb-2">{uMed}/{Medium}</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: Medium > 0 ? `${medPct}%` : '0%' }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {medPct}%
            </div>
          </div>

          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <div className="text-red-600 font-semibold mb-2">Hard</div>
            <div className="text-white text-lg mb-2">{uHard}/{Hard}</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: Hard > 0 ? `${hardPct}%` : '0%' }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {hardPct}%
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
