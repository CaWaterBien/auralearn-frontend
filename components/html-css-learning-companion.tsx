'use client'

import { useState, useEffect } from 'react'
import { Code, Palette, Target, TrendingUp, Award, ChevronRight, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface LearningStats {
  htmlProgress: number
  cssProgress: number
  currentLesson: string
  streak: number
  completedLessons: number
  totalLessons: number
  nextSuggestion: string
  questionsAsked: number
  skillLevel: string
}

export default function HTMLCSSLearningCompanion() {
  const [stats, setStats] = useState<LearningStats>({
    htmlProgress: 45,
    cssProgress: 20,
    currentLesson: 'HTML Elements & Attributes',
    streak: 3,
    completedLessons: 8,
    totalLessons: 24,
    nextSuggestion: 'CSS Box Model',
    questionsAsked: 0,
    skillLevel: 'beginner'
  })

  const [learningTips, setLearningTips] = useState([
    "Great progress with HTML elements! Try creating a simple webpage structure.",
    "Ready to start CSS? Begin with basic styling like colors and fonts.",
    "Practice combining HTML structure with CSS styling for better understanding."
  ])

  useEffect(() => {
    const savedProgress = localStorage.getItem('userProgress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setStats(prev => ({
        ...prev,
        questionsAsked: progress.questionsAsked?.length || 0,
        skillLevel: progress.skillLevel || 'beginner',
        htmlProgress: Math.min(progress.htmlTopics?.length * 15 || 45, 100),
        cssProgress: Math.min(progress.cssTopics?.length * 20 || 20, 100)
      }))

      if (progress.strugglingWith?.length > 0) {
        const personalizedTips = [
          `I notice you've been working on ${progress.strugglingWith[0]}. Let's focus on mastering this concept!`,
          `Based on your questions, you might benefit from more practice with ${progress.strugglingWith.join(' and ')}.`,
          "Keep asking questions! Each question helps me understand how to better guide your learning."
        ]
        setLearningTips(personalizedTips)
      }
    }

    const interval = setInterval(() => {
      const currentProgress = localStorage.getItem('userProgress')
      if (currentProgress) {
        const progress = JSON.parse(currentProgress)
        setStats(prev => ({
          ...prev,
          questionsAsked: progress.questionsAsked?.length || 0,
          skillLevel: progress.skillLevel || 'beginner'
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const htmlTopics = [
    { name: 'HTML Basics', completed: true, current: false },
    { name: 'Elements & Tags', completed: true, current: false },
    { name: 'Attributes', completed: false, current: true },
    { name: 'Text Formatting', completed: false, current: false },
    { name: 'Links & Images', completed: false, current: false },
    { name: 'Lists & Tables', completed: false, current: false },
    { name: 'Forms', completed: false, current: false },
    { name: 'Semantic HTML', completed: false, current: false }
  ]

  const cssTopics = [
    { name: 'CSS Basics', completed: false, current: false },
    { name: 'Selectors', completed: false, current: false },
    { name: 'Colors & Fonts', completed: false, current: false },
    { name: 'Box Model', completed: false, current: false },
    { name: 'Layout & Positioning', completed: false, current: false },
    { name: 'Flexbox', completed: false, current: false },
    { name: 'Grid', completed: false, current: false },
    { name: 'Responsive Design', completed: false, current: false }
  ]

  const achievements = [
    { name: 'HTML Starter', icon: '🏗️', unlocked: true, description: 'Created your first HTML page' },
    { name: 'Question Master', icon: '❓', unlocked: stats.questionsAsked >= 5, description: 'Asked 5+ questions to the AI' },
    { name: 'CSS Explorer', icon: '🎨', unlocked: stats.cssProgress > 30, description: 'Applied your first CSS styles' },
    { name: 'Learning Streak', icon: '🔥', unlocked: stats.streak >= 7, description: 'Maintained a 7-day learning streak' }
  ]

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#9929EA]">
            <Brain className="h-5 w-5" />
            <span>AI-Powered Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">{stats.currentLesson}</h3>
            <p className="text-gray-700 mb-4 font-medium">
              {stats.completedLessons} of {stats.totalLessons} lessons completed
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#9929EA] to-[#CC66DA] text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                  <div className="text-sm font-medium">Questions Asked</div>
                  <div className="text-2xl font-bold">{stats.questionsAsked}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Skill Level</div>
                  <div className={`text-sm px-2 py-1 rounded ${getSkillLevelColor(stats.skillLevel)} text-black font-medium`}>
                    {stats.skillLevel}
                  </div>
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-[#E34F26]" />
                <span className="font-medium">HTML</span>
              </div>
              <span className="text-sm font-medium">{stats.htmlProgress}%</span>
            </div>
            <Progress value={stats.htmlProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-[#1572B6]" />
                <span className="font-medium">CSS</span>
              </div>
              <span className="text-sm font-medium">{stats.cssProgress}%</span>
            </div>
            <Progress value={stats.cssProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-[#FAEB92] rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.streak}</div>
              <div className="text-sm font-medium text-gray-800">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-[#CC66DA] text-white rounded-lg">
              <div className="text-2xl font-bold">🤖</div>
              <div className="text-sm font-medium">AI Guided</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#9929EA]">
            <Target className="h-5 w-5" />
            <span>Your Learning Path</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-[#E34F26] mb-3 flex items-center">
              <Code className="h-4 w-4 mr-2" />
              HTML Topics
            </h4>
            <div className="space-y-2">
              {htmlTopics.slice(0, 4).map((topic, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                    topic.completed
                      ? 'bg-green-50 text-green-700'
                      : topic.current
                      ? 'bg-[#9929EA] bg-opacity-10 text-[#9929EA] font-medium'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="font-medium">{topic.name}</span>
                  {topic.completed && <span>✅</span>}
                  {topic.current && <span>📍</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#1572B6] mb-3 flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              CSS Topics
            </h4>
            <div className="space-y-2">
              {cssTopics.slice(0, 4).map((topic, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                    topic.completed
                      ? 'bg-green-50 text-green-700'
                      : topic.current
                      ? 'bg-[#9929EA] bg-opacity-10 text-[#9929EA] font-medium'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <span className="font-medium">{topic.name}</span>
                  {topic.completed && <span>✅</span>}
                  {topic.current && <span>📍</span>}
                  {!topic.completed && !topic.current && <span>🔒</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#9929EA] to-[#CC66DA] text-white rounded-lg">
            <h4 className="font-semibold mb-2">AI Recommended Next:</h4>
            <p className="text-sm mb-3 font-medium">{stats.nextSuggestion}</p>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white text-[#9929EA] hover:bg-gray-100"
            >
              Continue Learning <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#9929EA]">
            <TrendingUp className="h-5 w-5" />
            <span>Personalized AI Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {learningTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-[#9929EA] mt-0.5">🤖</div>
                <p className="text-sm text-gray-800 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#9929EA]">
            <Award className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                  achievement.unlocked
                    ? 'border-[#9929EA] bg-[#9929EA] bg-opacity-10'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{achievement.name}</div>
                  <div className="text-sm text-gray-700 font-medium">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <div className="text-[#9929EA] font-bold">✓</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


