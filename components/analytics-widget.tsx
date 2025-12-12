'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Clock, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LearningAnalyticsDashboard from './learning-analytics-dashboard'

export default function AnalyticsWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [todayTime, setTodayTime] = useState(0)
  const [weeklyStreak, setWeeklyStreak] = useState(0)

  useEffect(() => {
    // Get user-specific keys for analytics data
    let userId: string | undefined;
    try {
      const userData = localStorage.getItem('auralearn_user');
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id?.toString();
      }
    } catch (e) {
      console.warn('Could not get user ID for analytics widget');
    }

    const sessionsKey = userId ? `learningSessions_${userId}` : 'learningSessions';
    const analyticsKey = userId ? `learningAnalytics_${userId}` : 'learningAnalytics';

    const sessions = localStorage.getItem(sessionsKey);
    if (sessions) {
      const parsedSessions: Array<{ date: string; duration: number }> = JSON.parse(sessions)
      const today = new Date().toISOString().split('T')[0]
      const todaySessions = parsedSessions.filter((session) => 
        new Date(session.date).toISOString().split('T')[0] === today
      )
      const totalTime = todaySessions.reduce((sum: number, session) => sum + session.duration, 0)
      setTodayTime(totalTime)
    }

    const analytics = localStorage.getItem(analyticsKey);
    if (analytics) {
      const parsed: { currentStreak?: number } = JSON.parse(analytics)
      setWeeklyStreak(parsed.currentStreak || 0)
    }
  }, [])

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-[#9929EA] bg-opacity-20 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-[#9929EA]">Learning Analytics Dashboard</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <LearningAnalyticsDashboard />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsOpen(true)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-[#9929EA] text-lg">
          <BarChart3 className="h-5 w-5" />
          <span>Learning Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Today</span>
          </div>
          <span className="font-semibold">{formatTime(todayTime)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Streak</span>
          </div>
          <span className="font-semibold">{weeklyStreak} days</span>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3 border-[#9929EA] text-[#9929EA] hover:bg-[#9929EA] hover:text-white"
        >
          View Full Analytics
        </Button>
      </CardContent>
    </Card>
  )
}


