import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'

function formatTimeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const sec = 1000, min = sec * 60, hr = min * 60, day = hr * 24

  if (diff < min) {
    const s = Math.max(1, Math.floor(diff / sec))
    return `${s} sec${s > 1 ? 's' : ''} ago`
  }
  if (diff < hr) {
    const m = Math.floor(diff / min)
    return `${m} min${m > 1 ? 's' : ''} ago`
  }
  if (diff < day) {
    const h = Math.floor(diff / hr)
    return `${h} hr${h > 1 ? 's' : ''} ago`
  }
  const d = Math.floor(diff / day)
  return `${d} day${d > 1 ? 's' : ''} ago`
}

function formatMemory(kb) {
  if (kb == null) return '0 KB'
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

export default function RecentSubmissions({ onSubmissionClick }) {
  const [subs, setSubs]         = useState([])
  const [page, setPage]         = useState(1)
  const [totalPages, setTotal]  = useState(1)
  const perPage = 5

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions/recent?page=${page}&limit=${perPage}`, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setSubs(data.submissions)
          setTotal(data.totalPages)
        }
      })
      .catch(console.error)
  }, [page])

  const getBadgeClass = diff => ({
    Easy:   'bg-green-900/50 text-green-500 border-green-700',
    Medium: 'bg-yellow-900/50 text-yellow-500 border-yellow-700',
    Hard:   'bg-red-900/50 text-red-500   border-red-600'
  })[diff] || 'bg-gray-900/50 text-gray-400 border-gray-700'

  return (
    <Card className="bg-dark-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-white">Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subs.map(s => (
            <div
              key={s.id}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700/50"
              onClick={() => onSubmissionClick(s)}
            >
              <div className="flex justify-between mb-2">
                <h3 className="text-white font-semibold">{s.problemTitle}</h3>
                <Badge className={getBadgeClass(s.difficulty)}>
                  {s.difficulty}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-400 mb-2">
                <div>Lang: <span className="text-gray-300">{s.language}</span></div>
                <div>Runtime: <span className="text-gray-300">{s.runtime ?? '—'}</span></div>
                <div>
                  Memory:{' '}
                  <span className="text-gray-300">
                    {s.verdict === 'Accepted'
                      ? formatMemory(s.totalMemoryKb)
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-gray-300">{formatTimeAgo(s.submittedAt)}</span>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                  s.verdict === 'Accepted'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                {s.verdict}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            size="sm"
            variant="outline"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            size="sm"
            variant="outline"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
