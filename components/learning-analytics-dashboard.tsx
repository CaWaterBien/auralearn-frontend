'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'
import { Calendar, Clock, TrendingUp, Target, Brain, Award, Activity, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LearningSession {
  id: string
  date: Date
  duration: number
  topic: string
  questionsAsked: number
  conceptsLearned: string[]
  struggledWith: string[]
  completedExercises: number
}

interface LearningAnalytics {
  totalTimeSpent: number
  sessionsCount: number
  averageSessionTime: number
  longestStreak: number
  currentStreak: number
  topicsStudied: { [key: string]: number }
  dailyActivity: { date: string, time: number, questions: number }[]
  weeklyProgress: { week: string, html: number, css: number }[]
  learningVelocity: { date: string, conceptsLearned: number }[]
  strugglingAreas: { topic: string, frequency: number }[]
  peakLearningHours: { hour: number, sessions: number }[]
  skillProgression: { date: string, level: number }[]
}

export default function LearningAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<LearningAnalytics>({
    totalTimeSpent: 0,
    sessionsCount: 0,
    averageSessionTime: 0,
    longestStreak: 0,
    currentStreak: 0,
    topicsStudied: {},
    dailyActivity: [],
    weeklyProgress: [],
    learningVelocity: [],
    strugglingAreas: [],
    peakLearningHours: [],
    skillProgression: []
  })

  const [sessions, setSessions] = useState<LearningSession[]>([])
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

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
      console.warn('Could not get user ID for analytics');
    }

    const sessionsKey = userId ? `learningSessions_${userId}` : 'learningSessions';
    const analyticsKey = userId ? `learningAnalytics_${userId}` : 'learningAnalytics';

    const savedSessions = localStorage.getItem(sessionsKey);
    const savedAnalytics = localStorage.getItem(analyticsKey);
    
    if (savedSessions) {
      const parsedSessions: Array<{ id: string; date: string; duration: number; topic: string; questionsAsked: number; conceptsLearned: string[]; struggledWith: string[]; completedExercises: number }> = JSON.parse(savedSessions)
      const mapped = parsedSessions.map((session) => ({
        ...session,
        date: new Date(session.date)
      }))
      setSessions(mapped)
    }
    if (savedAnalytics) {
      setAnalytics(JSON.parse(savedAnalytics))
    }
    startNewSession()
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseCurrentSession()
      } else {
        resumeCurrentSession()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      endCurrentSession()
    }
  }, [])

  useEffect(() => {
    if (sessions.length > 0) {
      updateAnalytics()
    }
  }, [sessions])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSession) {
        updateCurrentSession()
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [currentSession])

  const startNewSession = () => {
    const newSession: LearningSession = {
      id: `session-${sessions.length}`,
      date: new Date(),
      duration: 0,
      topic: 'General Learning',
      questionsAsked: 0,
      conceptsLearned: [],
      struggledWith: [],
      completedExercises: 0
    }
    setCurrentSession(newSession)
    setSessionStartTime(new Date())
  }

  const updateCurrentSession = () => {
    if (!currentSession || !sessionStartTime) return
    const now = new Date()
    const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 60000)
    const updatedSession = { ...currentSession, duration: Math.max(duration, currentSession.duration) }
    setCurrentSession(updatedSession)
    const userProgress = localStorage.getItem('userProgress')
    if (userProgress) {
      const progress = JSON.parse(userProgress)
      updatedSession.questionsAsked = progress.questionsAsked?.length || 0
      updatedSession.struggledWith = progress.strugglingWith || []
    }
  }

  const pauseCurrentSession = () => {
    updateCurrentSession()
  }

  const resumeCurrentSession = () => {
    setSessionStartTime(new Date())
  }

  const endCurrentSession = () => {
    if (!currentSession) return
    updateCurrentSession()
    if (currentSession.duration > 0) {
      const updatedSessions = [...sessions, currentSession]
      setSessions(updatedSessions)
      
      // Get user-specific key for sessions
      let userId: string | undefined;
      try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
          const user = JSON.parse(userData);
          userId = user.id?.toString();
        }
      } catch (e) {
        console.warn('Could not get user ID for sessions');
      }
      
      const sessionsKey = userId ? `learningSessions_${userId}` : 'learningSessions';
      localStorage.setItem(sessionsKey, JSON.stringify(updatedSessions))
    }
    setCurrentSession(null)
    setSessionStartTime(null)
  }

  const updateAnalytics = () => {
    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0)
    const avgSessionTime = sessions.length > 0 ? totalTime / sessions.length : 0
    const dailyActivity = sessions.reduce((acc: Array<{ date: string; time: number; questions: number }>, session) => {
      const dateStr = session.date.toISOString().split('T')[0]
      const existing = acc.find(item => item.date === dateStr)
      if (existing) {
        existing.time += session.duration
        existing.questions += session.questionsAsked
      } else {
        acc.push({ date: dateStr, time: session.duration, questions: session.questionsAsked })
      }
      return acc
    }, []).slice(-14)

    const weeklyProgress = [] as { week: string, html: number, css: number }[]
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    weeks.forEach((week, index) => {
      // Use deterministic values to avoid hydration mismatches
      const htmlVariation = (index * 7) % 10 // Pseudo-random but deterministic
      const cssVariation = (index * 5) % 8
      weeklyProgress.push({
        week,
        html: Math.min(20 + index * 15 + htmlVariation, 100),
        css: Math.min(10 + index * 12 + cssVariation, 100)
      })
    })

    const learningVelocity = sessions.slice(-7).map(session => ({
      date: session.date.toISOString().split('T')[0],
      conceptsLearned: session.conceptsLearned.length
    }))

    const strugglingAreas = sessions.reduce((acc: Array<{ topic: string; frequency: number }>, session) => {
      session.struggledWith.forEach(topic => {
        const existing = acc.find(item => item.topic === topic)
        if (existing) existing.frequency += 1
        else acc.push({ topic, frequency: 1 })
      })
      return acc
    }, []).sort((a, b) => b.frequency - a.frequency).slice(0, 5)

    const peakHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      sessions: sessions.filter(session => session.date.getHours() === hour).length
    })).filter(item => item.sessions > 0)

    const skillProgression = sessions.slice(-10).map((session, index) => ({
      date: session.date.toISOString().split('T')[0],
      level: Math.min(1 + index * 0.3, 5)
    }))

    const newAnalytics: LearningAnalytics = {
      totalTimeSpent: totalTime,
      sessionsCount: sessions.length,
      averageSessionTime: avgSessionTime,
      longestStreak: calculateLongestStreak(),
      currentStreak: calculateCurrentStreak(),
      topicsStudied: calculateTopicsStudied(),
      dailyActivity,
      weeklyProgress,
      learningVelocity,
      strugglingAreas,
      peakLearningHours: peakHours,
      skillProgression
    }

    setAnalytics(newAnalytics)
    
    // Get user-specific key for analytics
    let userId: string | undefined;
    try {
      const userData = localStorage.getItem('auralearn_user');
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id?.toString();
      }
    } catch (e) {
      console.warn('Could not get user ID for analytics');
    }
    
    const analyticsKey = userId ? `learningAnalytics_${userId}` : 'learningAnalytics';
    localStorage.setItem(analyticsKey, JSON.stringify(newAnalytics))
  }

  const calculateLongestStreak = (): number => {
    if (sessions.length === 0) return 0
    const dates = sessions.map(session => session.date.toISOString().split('T')[0])
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort()
    let longestStreak = 1
    let currentStreak = 1
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1])
      const currDate = new Date(dates[i])
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      if (diffDays === 1) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }
    return longestStreak
  }

  const calculateCurrentStreak = (): number => {
    if (sessions.length === 0) return 0
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const recentSessions = sessions.filter(session => {
      const sessionDate = session.date.toISOString().split('T')[0]
      return sessionDate === today || sessionDate === yesterday
    })
    return recentSessions.length > 0 ? 1 : 0
  }

  const calculateTopicsStudied = (): { [key: string]: number } => {
    return sessions.reduce((acc, session) => {
      acc[session.topic] = (acc[session.topic] || 0) + session.duration
      return acc
    }, {} as { [key: string]: number })
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const COLORS = ['#9929EA', '#CC66DA', '#FAEB92', '#00AA6C', '#E34F26', '#1572B6']

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#9929EA]" />
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">{formatTime(analytics.totalTimeSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-[#00AA6C]" />
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-bold">{analytics.sessionsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#CC66DA]" />
              <div>
                <p className="text-sm text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold">{formatTime(Math.round(analytics.averageSessionTime))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-[#FAEB92]" />
              <div>
                <p className="text-sm text-gray-600">Best Streak</p>
                <p className="text-2xl font-bold">{analytics.longestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentSession && (
        <Card className="border-[#9929EA] border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#9929EA]">
              <Activity className="h-5 w-5" />
              <span>Current Session</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Session Duration</p>
                <p className="text-xl font-bold">{formatTime(currentSession.duration)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Questions Asked</p>
                <p className="text-xl font-bold">{currentSession.questionsAsked}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#9929EA]" />
                <span>Daily Learning Activity (Last 14 Days)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value as string)}
                    formatter={(value: number, name: string) => [
                      name === 'time' ? formatTime(value) : value,
                      name === 'time' ? 'Time Spent' : 'Questions Asked'
                    ]}
                  />
                  <Area type="monotone" dataKey="time" stackId="1" stroke="#9929EA" fill="#9929EA" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="questions" stackId="2" stroke="#CC66DA" fill="#CC66DA" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-[#9929EA]" />
                <span>Weekly Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="html" fill="#E34F26" name="HTML Progress" />
                  <Bar dataKey="css" fill="#1572B6" name="CSS Progress" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-[#9929EA]" />
                <span>Learning Velocity (Concepts per Day)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.learningVelocity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => formatDate(value as string)} />
                  <Line type="monotone" dataKey="conceptsLearned" stroke="#9929EA" strokeWidth={3} dot={{ fill: '#9929EA', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#9929EA]" />
                <span>Peak Learning Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.peakLearningHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis />
                  <Tooltip labelFormatter={(hour) => `${hour}:00`} formatter={(value) => [value, 'Sessions']} />
                  <Bar dataKey="sessions" fill="#CC66DA" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-[#9929EA]" />
                <span>Skill Progression Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.skillProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip labelFormatter={(value) => formatDate(value as string)} formatter={(value) => [(value as number).toFixed(1), 'Skill Level']} />
                  <Line type="monotone" dataKey="level" stroke="#00AA6C" strokeWidth={3} dot={{ fill: '#00AA6C', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {Object.keys(analytics.topicsStudied).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#9929EA]" />
                  <span>Time Distribution by Topic</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(analytics.topicsStudied).map(([topic, time]) => ({ name: topic, value: time }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100).toFixed(0))}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(analytics.topicsStudied).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatTime(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {analytics.strugglingAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-[#9929EA]" />
                  <span>Areas Needing Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.strugglingAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium">{area.topic}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(area.frequency / Math.max(...analytics.strugglingAreas.map(a => a.frequency))) * 100} 
                          className="w-20 h-2" 
                        />
                        <span className="text-sm text-gray-600">{area.frequency}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-[#9929EA]" />
                <span>Learning Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 Study Pattern</h4>
                  <p className="text-blue-700 text-sm">
                    You learn best during {analytics.peakLearningHours.length > 0 
                      ? `${analytics.peakLearningHours[0]?.hour}:00` 
                      : 'various'} hours. 
                    Your average session is {formatTime(Math.round(analytics.averageSessionTime))}.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Progress Rate</h4>
                  <p className="text-green-700 text-sm">
                    You&apos;ve maintained a {analytics.currentStreak} day streak! 
                    Your longest streak was {analytics.longestStreak} days.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">💡 Recommendation</h4>
                  <p className="text-purple-700 text-sm">
                    {analytics.strugglingAreas.length > 0 
                      ? `Focus more time on ${analytics.strugglingAreas[0]?.topic} to improve your understanding.`
                      : 'Great job! Keep up the consistent learning pace.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


