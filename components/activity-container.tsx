'use client'

import { useState } from 'react'
import { Target, Code, ExternalLink, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Activity {
  id: string
  title: string
  description: string
  instructions: string[]
  initialCode: string
  expectedCode: string
  expectedOutput: string
  hints: string[]
}

interface ActivityContainerProps {
  activity: Activity
  isCompleted?: boolean
  onComplete?: (activityId: string) => void
}

export default function ActivityContainer({ activity, isCompleted = false, onComplete }: ActivityContainerProps) {
  const router = useRouter()

  const enterActivity = () => {
    // Navigate to the full-screen activity editor
    router.push(`/activity/${activity.id}`)
  }

  return (
    <div className={`w-full border-2 rounded-lg overflow-hidden ${
      isCompleted 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700' 
        : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700'
    }`}>
      {/* Activity Header */}
      <div className={`text-white px-6 py-4 ${
        isCompleted
          ? 'bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700'
          : 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Target className="h-6 w-6" />
            )}
            <div>
              <h3 className="text-lg font-semibold">Activity: {activity.title}</h3>
              <p className={`text-sm ${isCompleted ? 'text-green-100 dark:text-green-200' : 'text-purple-100 dark:text-purple-200'}`}>{activity.description}</p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Activity Instructions */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-[var(--text-primary)] mb-3 flex items-center">
            <Code className="h-5 w-5 mr-2 text-purple-600" />
            Instructions
          </h4>
          <ul className="space-y-2">
            {activity.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-[var(--text-primary)]">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>

          <div className={`flex items-center justify-between pt-4 border-t ${
            isCompleted ? 'border-green-200 dark:border-green-800' : 'border-purple-200 dark:border-purple-800'
          }`}>
          <div className="text-sm text-[var(--text-secondary)] flex items-center">
              <ExternalLink className={`h-4 w-4 mr-2 ${isCompleted ? 'text-green-500 dark:text-green-400' : 'text-purple-500 dark:text-purple-400'}`} />
            <span className="font-medium">{isCompleted ? 'Activity completed' : 'Opens in full-screen editor'}</span>
          </div>
          <Button
            onClick={enterActivity}
            className={`font-semibold px-6 py-2 ${
              isCompleted
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Enter Activity
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
