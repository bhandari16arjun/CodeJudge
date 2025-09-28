import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const ActivityHeatmap = ({ data = [], year: initialYear = new Date().getFullYear() }) => {
  const [selectedYear, setSelectedYear] = useState(initialYear)

  const lookup = new Map()
  data.forEach(({ date, count }) => {
    if (date.startsWith(String(selectedYear))) {
      lookup.set(date, count)
    }
  })

  const yearStart = new Date(selectedYear, 0, 1)
  const firstSunday = new Date(yearStart)
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay())
  const yearEnd = new Date(selectedYear, 11, 31)

  const days = []
  let cursor = new Date(firstSunday)
  while (cursor <= yearEnd || days.length % 7 !== 0) {
    const iso = cursor.toISOString().split('T')[0]
    const count = lookup.get(iso) || 0
    days.push({ date: iso, count, isCurrentYear: cursor.getFullYear() === selectedYear })
    cursor.setDate(cursor.getDate() + 1)
  }

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const getIntensity = (c) => {
    if (!c) return 'bg-gray-800 border-gray-700'
    if (c <= 1) return 'bg-green-900 border-green-800'
    if (c <= 2) return 'bg-green-700 border-green-600'
    if (c <= 3) return 'bg-green-500 border-green-400'
    return 'bg-green-300 border-green-200'
  }

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

  const monthPositions = [0, 92, 165, 240, 330, 403, 478, 570, 642, 716, 795, 867]
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const currentYear = new Date().getFullYear()
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2]

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Activity Heatmap</h2>
        </div>
        <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(+v)}>
          <SelectTrigger className="w-20 h-8 bg-slate-800 border-slate-700 text-white text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {yearOptions.map((y) => (
              <SelectItem key={y} value={String(y)} className="text-white hover:bg-slate-700">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="relative min-w-max">
          <div className="relative mb-3 h-4 text-white text-sm">
            {monthNames.map((m, i) => (
              <p key={m} className="absolute text-xs text-gray-300 font-medium" style={{ left: `${monthPositions[i]}px` }}>
                {m}
              </p>
            ))}
          </div>

          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 flex-1 min-w-[14px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`aspect-square rounded-sm border transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-green-400 ${getIntensity(day.count)} ${!day.isCurrentYear ? 'opacity-40' : ''}`}
                    title={`${formatDate(day.date)}: ${day.count} activities`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-300">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-800 border border-gray-700" />
              <div className="w-3 h-3 rounded-sm bg-green-900 border border-green-800" />
              <div className="w-3 h-3 rounded-sm bg-green-700 border border-green-600" />
              <div className="w-3 h-3 rounded-sm bg-green-500 border border-green-400" />
              <div className="w-3 h-3 rounded-sm bg-green-300 border border-green-200" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap
