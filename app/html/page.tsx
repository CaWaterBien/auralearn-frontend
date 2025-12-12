'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/header'
import TutorialLayout from '@/components/tutorial-layout'
import CodeExecutor from '@/components/code-executor'
import ActivityContainer from '@/components/activity-container'
import TopicRenderer from '@/components/topic-renderer'
import { Code2 } from 'lucide-react'
import { getCourseBySlug, formatActivityForUI, markLessonComplete, type Course, type Lesson, type Activity, type UIActivity } from '@/lib/course-api'
import { getLessonProgress } from '@/lib/progress-api'
import { Spin, Alert } from 'antd'
import { useLessonTracker } from '@/hooks/use-lesson-tracker'

interface LessonCompletionStatus {
  lessonId: number
  isCompleted: boolean
  percentage: number
}

export default function HTMLTutorial() {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [activities, setActivities] = useState<UIActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set())
  const [lessonCompletionData, setLessonCompletionData] = useState<Map<number, LessonCompletionStatus>>(new Map())

  // Fetch lesson completion status for all lessons
const fetchAllLessonCompletions = async (courseId: number, lessonsList: Lesson[]) => {
    const completionMap = new Map<number, LessonCompletionStatus>()
    
    // Separate lessons without activities (always complete)
    const lessonsWithActivities = lessonsList.filter(l => Array.isArray(l.activities) && l.activities.length > 0)
    const lessonsWithoutActivities = lessonsList.filter(l => !Array.isArray(l.activities) || l.activities.length === 0)
    
    // Mark lessons without activities as complete
    for (const lesson of lessonsWithoutActivities) {
      completionMap.set(lesson.id, {
        lessonId: lesson.id,
        isCompleted: true,
        percentage: 100
      })
    }

    if (lessonsWithActivities.length > 0) {
      try {
        // Use batch endpoint to get all lesson progress at once
        const { batchGetLessonProgress } = await import('@/lib/course-api')
        const lessonIds = lessonsWithActivities.map(l => l.id)
        const progressData = await batchGetLessonProgress(courseId, lessonIds)
        
        // Process progress data and check activity completions in parallel
        const activityChecks = lessonsWithActivities.map(async (lesson) => {
          const progress = progressData[lesson.id]
          let isCompleted = progress?.is_completed || false
          let percentage = progress?.completion_percentage || 0
          
          // Double-check by checking individual activity completions if needed
          if (!isCompleted && lesson.activities) {
            const completedCount = await checkLessonActivitiesCompletion(lesson.activities)
            const totalActivities = lesson.activities.length
            percentage = Math.round((completedCount / totalActivities) * 100)
            isCompleted = completedCount === totalActivities
          }
          
          return {
            lessonId: lesson.id,
            isCompleted: isCompleted || percentage >= 100,
            percentage: Math.max(percentage, isCompleted ? 100 : 0)
          }
        })
        
        // Wait for all activity checks to complete
        const results = await Promise.all(activityChecks)
        results.forEach(result => {
          completionMap.set(result.lessonId, result)
        })
        
      } catch (err) {
        console.error('Failed to fetch batch lesson progress:', err)
        // Fallback to individual checks
        for (const lesson of lessonsWithActivities) {
          try {
            const progress = await getLessonProgress(courseId, lesson.id)
            let isCompleted = progress?.is_completed || false
            let percentage = progress?.completion_percentage || 0
            
            if (!isCompleted && lesson.activities) {
              const completedCount = await checkLessonActivitiesCompletion(lesson.activities)
              const totalActivities = lesson.activities.length
              percentage = Math.round((completedCount / totalActivities) * 100)
              isCompleted = completedCount === totalActivities
            }
            
            completionMap.set(lesson.id, {
              lessonId: lesson.id,
              isCompleted: isCompleted || percentage >= 100,
              percentage: Math.max(percentage, isCompleted ? 100 : 0)
            })
          } catch (err) {
            console.warn(`Failed to fetch progress for lesson ${lesson.id}:`, err)
            completionMap.set(lesson.id, {
              lessonId: lesson.id,
              isCompleted: false,
              percentage: 0
            })
          }
        }
      }
    }
    
    setLessonCompletionData(completionMap)
    console.log('📊 Loaded lesson completion data:', completionMap)
  }
  
  // Helper function to check completion of all activities in a lesson
  const checkLessonActivitiesCompletion = async (activities: Activity[]): Promise<number> => {
    if (activities.length === 0) {
      return 0
    }
    
    try {
      const { checkLessonActivitiesCompletionBatch } = await import('@/lib/course-api')
      return await checkLessonActivitiesCompletionBatch(activities)
    } catch (err) {
      console.error('Failed to check activities completion in batch:', err)
      // Fallback to individual checks if batch fails
      let completedCount = 0
      for (const activity of activities) {
        try {
          const { getActivitySubmissionStatus } = await import('@/lib/course-api')
          const status = await getActivitySubmissionStatus(activity.id)
          if (status.is_completed) {
            completedCount++
          }
        } catch (err) {
          console.warn(`Failed to check activity ${activity.id} status`)
        }
      }
      return completedCount
    }
  }

  // Helper function to refresh activity completion data
  const refreshActivityCompletions = async () => {
    if (!currentLesson || !currentLesson.activities || currentLesson.activities.length === 0) {
      return
    }

    console.log('🔄 Refreshing activity completion statuses...')
    
    // Clear activity caches to force fresh data fetch
    try {
      const { apiCache } = await import('@/hooks/use-api-cache')
      apiCache.activity.clearAll()
      apiCache.progress.clearAll()
      console.log('🗑️ Cleared activity and progress caches')
    } catch (err) {
      console.warn('Could not clear cache:', err)
    }
    
    const completed = new Set<string>()
    const uiActivities = currentLesson.activities.map(formatActivityForUI)
    
    for (const activity of uiActivities) {
      try {
        const { getActivitySubmissionStatus } = await import('@/lib/course-api')
        const status = await getActivitySubmissionStatus(activity.id)
        if (status.is_completed) {
          completed.add(activity.id.toString())
          console.log(`✅ Activity ${activity.id} is completed`)
        }
      } catch (err) {
        console.warn(`Failed to check status for activity ${activity.id}`)
      }
    }
    
    setCompletedActivities(completed)
    console.log('📥 Refreshed completed activities:', Array.from(completed))
    
    // Update lesson completion data
    if (course?.id) {
      await fetchAllLessonCompletions(course.id, lessons)
    }
  }

  // Add visibility change listener to refresh data when user returns to page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👀 Page became visible, refreshing activity completions...')
        refreshActivityCompletions()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Also add focus listener as backup
    window.addEventListener('focus', refreshActivityCompletions)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', refreshActivityCompletions)
    }
  }, [currentLesson, course, lessons])

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch course data by slug
        const response = await getCourseBySlug('html5-tutorial')
        setCourse(response.course)
        setLessons(response.course.lessons || [])
        
        // Check if there's a URL hash to restore the lesson
        const hash = window.location.hash.slice(1) // Remove #
        let lessonToLoad = response.course.lessons[0] // Default to first lesson
        
        if (hash && response.course.lessons) {
          // Try to find lesson matching the hash
          const matchedLesson = response.course.lessons.find(
            lesson => lesson.title.toLowerCase().replace(/\s+/g, '-') === hash
          )
          if (matchedLesson) {
            lessonToLoad = matchedLesson
            console.log(`📍 Restored lesson from URL hash: ${matchedLesson.title}`)
          }
        }
        
        // Set the lesson to load as current
        if (response.course.lessons && response.course.lessons.length > 0) {
          setCurrentLesson(lessonToLoad)
          
          // Update URL hash to match current lesson (in case it was empty or first lesson)
          window.location.hash = lessonToLoad.title.toLowerCase().replace(/\s+/g, '-')
          
          // Fetch completion status for all lessons
          await fetchAllLessonCompletions(response.course.id, response.course.lessons)
          
          // Convert backend activities to UI format and check completion status
          if (lessonToLoad.activities && lessonToLoad.activities.length > 0) {
            const uiActivities = lessonToLoad.activities.map(formatActivityForUI)
            setActivities(uiActivities)
            
            // Check completion status for each activity from backend
            const completed = new Set<string>()
            for (const activity of uiActivities) {
              try {
                const { getActivitySubmissionStatus } = await import('@/lib/course-api')
                const status = await getActivitySubmissionStatus(activity.id)
                if (status.is_completed) {
                  completed.add(activity.id.toString())
                  console.log(`✅ Activity ${activity.id} is completed`)
                }
              } catch (err) {
                console.warn(`Failed to check status for activity ${activity.id}`)
              }
            }
            setCompletedActivities(completed)
            console.log('📥 Loaded completed activities from backend:', Array.from(completed))
            
            // Always update lesson completion data based on current status
            const completedCount = completed.size
            const totalActivities = uiActivities.length
            const percentage = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0
            const allActivitiesCompleted = uiActivities.every(activity => completed.has(activity.id.toString()))
            
            if (lessonToLoad.id) {
              setLessonCompletionData(prev => {
                const newMap = new Map(prev)
                newMap.set(lessonToLoad.id, {
                  lessonId: lessonToLoad.id,
                  isCompleted: allActivitiesCompleted || percentage >= 100,
                  percentage: percentage
                })
                return newMap
              })
              
              console.log(`📊 Initial lesson ${lessonToLoad.title} completion:`, {
                completedActivities: completedCount,
                totalActivities,
                percentage,
                isCompleted: allActivitiesCompleted
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course data:', err)
        setError(`Failed to load course content: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    loadCourseData()
  }, [])

  const trackableCount = currentLesson?.activities?.length && currentLesson.activities.length > 0
    ? currentLesson.activities.length
    : Math.max(currentLesson?.topics?.length || 0, 1);

  // Track lesson progress automatically
  const { timeSpent, progressPercentage, formatTime, markTopicComplete } = useLessonTracker({
    courseId: course?.id || 0,
    lessonId: currentLesson?.id || 0,
    totalTopics: trackableCount,
    onProgressUpdate: (percentage) => {
      console.log('📊 Lesson progress updated:', percentage);
      
      // If lesson is 100% complete, mark it as complete in backend
      if (percentage >= 100 && course?.id && currentLesson?.id) {
        markLessonComplete(course.id, currentLesson.id)
          .then(() => {
            console.log('✅ Lesson marked as complete in backend!');
          })
          .catch((err) => {
            console.error('Failed to mark lesson complete:', err);
          });
      }
    }
  });

  const handleActivityComplete = async (activityId: string) => {
    console.log(`✅ Activity ${activityId} completed!`)
    
    // Track this activity as completed  
    const newCompletedActivities = new Set([...completedActivities, activityId])
    setCompletedActivities(newCompletedActivities);
    
    // Calculate overall lesson progress
    const totalActivities = currentLesson?.activities?.length || 0;
    const completedItems = newCompletedActivities.size;
    const safeTotal = totalActivities > 0 ? totalActivities : 1;
    const percentage = Math.round((completedItems / safeTotal) * 100);
    console.log(`📈 Progress: ${completedItems}/${safeTotal} activities = ${percentage}%`);
    
    if (totalActivities === 0 && currentLesson?.id) {
      setLessonCompletionData(prev => {
        const newMap = new Map(prev);
        newMap.set(currentLesson.id, {
          lessonId: currentLesson.id,
          isCompleted: true,
          percentage: 100
        });
        return newMap;
      });
    }
    
    if (totalActivities > 0) {
      if (percentage >= 100) {
        // This will also trigger markLessonComplete if at 100%
        markTopicComplete(totalActivities - 1);
        
        if (currentLesson?.id) {
          setLessonCompletionData(prev => {
            const newMap = new Map(prev);
            newMap.set(currentLesson.id, {
              lessonId: currentLesson.id,
              isCompleted: true,
              percentage: 100
            });
            return newMap;
          });
        }
      } else if (currentLesson?.id) {
        setLessonCompletionData(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(currentLesson.id);
          newMap.set(currentLesson.id, {
            lessonId: currentLesson.id,
            isCompleted: existing?.isCompleted ?? false,
            percentage
          });
          return newMap;
        });
      }
    }
    
    // Fetch updated lesson progress from backend
    if (course?.id && currentLesson?.id) {
      try {
        const progress = await getLessonProgress(course.id, currentLesson.id)
        const isBackendCompleted = progress?.is_completed || false
        const backendPercentage = progress?.completion_percentage ?? 0
        
        // Use the higher of local calculation or backend value
        const finalIsCompleted = percentage >= 100 || isBackendCompleted
        const finalPercentage = Math.max(percentage, backendPercentage)
        
        console.log('📊 Updated lesson progress:', {
          local: { percentage, isCompleted: percentage >= 100 },
          backend: { percentage: backendPercentage, isCompleted: isBackendCompleted },
          final: { percentage: finalPercentage, isCompleted: finalIsCompleted }
        })
        
        // Update completion data map
        setLessonCompletionData(prev => {
          const newMap = new Map(prev)
          newMap.set(currentLesson.id, {
            lessonId: currentLesson.id,
            isCompleted: finalIsCompleted,
            percentage: finalPercentage
          })
          return newMap
        })
        
        // Always refresh all lesson statuses to ensure consistency
        await fetchAllLessonCompletions(course.id, lessons)
      } catch (err) {
        console.warn('Failed to fetch updated lesson progress:', err)
        
        // Still update based on local calculation even if backend fails
        if (percentage >= 100) {
          setLessonCompletionData(prev => {
            const newMap = new Map(prev)
            newMap.set(currentLesson.id, {
              lessonId: currentLesson.id,
              isCompleted: true,
              percentage: 100
            })
            return newMap
          })
        }
      }
    }
  }

  // Get current lesson index
  const getCurrentLessonIndex = () => {
    return lessons.findIndex(lesson => lesson.id === currentLesson?.id)
  }

  // Handle lesson selection from sidebar
  const handleLessonSelect = async (lessonIndex: number) => {
    if (!course || lessonIndex < 0 || lessonIndex >= lessons.length) return
    
    const targetLesson = lessons[lessonIndex]
    if (!targetLesson) return
    
    // Check if the lesson is locked
    const canNavigate = await checkCanNavigateToLesson(lessonIndex)
    if (!canNavigate) {
      return // The check function will show an alert
    }
    
    // First, ensure we have the latest completion data for all lessons
    await fetchAllLessonCompletions(course.id, lessons)
    
    // Set the new current lesson
    setCurrentLesson(targetLesson)
    
  // Load activities for the selected lesson
  if (targetLesson.activities && targetLesson.activities.length > 0) {
    const uiActivities = targetLesson.activities.map(formatActivityForUI)
    setActivities(uiActivities)
    
    // Check completion status for activities
    const completed = new Set<string>()
    for (const activity of uiActivities) {
      try {
        const { getActivitySubmissionStatus } = await import('@/lib/course-api')
        const status = await getActivitySubmissionStatus(activity.id)
        if (status.is_completed) {
          completed.add(activity.id.toString())
        }
      } catch (err) {
        console.warn(`Failed to check status for activity ${activity.id}`)
      }
    }
    setCompletedActivities(completed)
    
  // Always update lesson completion data based on activity status
  const completedCount = completed.size
  const totalActivities = uiActivities.length
  const percentage = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0
  const allActivitiesCompleted = uiActivities.every(activity => completed.has(activity.id.toString()))
  
  setLessonCompletionData(prev => {
    const newMap = new Map(prev)
    newMap.set(targetLesson.id, {
      lessonId: targetLesson.id,
      isCompleted: allActivitiesCompleted || percentage >= 100,
      percentage: percentage
    })
    return newMap
  })
  
  console.log(`📊 Lesson ${targetLesson.title} completion:`, {
    completedActivities: completedCount,
    totalActivities,
    percentage,
    isCompleted: allActivitiesCompleted
  })
  } else {
    setActivities([])
    
    // For lessons without activities, mark as complete
    setLessonCompletionData(prev => {
      const newMap = new Map(prev)
      newMap.set(targetLesson.id, {
        lessonId: targetLesson.id,
        isCompleted: true,
        percentage: 100
      })
      return newMap
    })
  }
  
  console.log('📍 Navigated to lesson:', targetLesson.title)
  
  // Update URL hash
  window.location.hash = targetLesson.title.toLowerCase().replace(/\s+/g, '-')
  }

  // Helper function to check if user can navigate to a lesson
  const checkCanNavigateToLesson = async (targetIndex: number): Promise<boolean> => {
    if (!course || targetIndex === 0) return true // First lesson is always accessible
    
    // Check if all previous lessons are completed
    for (let i = 0; i < targetIndex; i++) {
      const lesson = lessons[i]
      if (!lesson) continue

      const hasActivities = Array.isArray(lesson.activities) && lesson.activities.length > 0
      if (!hasActivities) continue
      
      const completion = lessonCompletionData.get(lesson.id)
      const isFinished = completion?.isCompleted || (completion?.percentage ?? 0) >= 100
      
      if (!isFinished) {
        // Try to fetch fresh data
        try {
          const progress = await getLessonProgress(course.id, lesson.id)
          const progressFinished = progress?.is_completed || (progress?.completion_percentage ?? 0) >= 100
          
          // Update the local state with fresh data
          setLessonCompletionData(prev => {
            const newMap = new Map(prev)
            newMap.set(lesson.id, {
              lessonId: lesson.id,
              isCompleted: progressFinished,
              percentage: progress?.completion_percentage ?? 0
            })
            return newMap
          })
          
          if (!progressFinished) {
            alert(`⚠️ Please complete "${lesson.title}" before proceeding to later lessons!`)
            return false
          }
        } catch (err) {
          alert(`⚠️ Please complete "${lesson.title}" before proceeding!`)
          return false
        }
      }
    }
    
    return true
  }

  // Navigation handlers
  const handleNext = async () => {
    if (!currentLesson || !course) return
    
    // Check if current lesson is completed
    const currentCompletion = lessonCompletionData.get(currentLesson.id)
    const hasActivities = Array.isArray(currentLesson.activities) && currentLesson.activities.length > 0
    const localActivitiesCompleted = hasActivities
      ? currentLesson.activities?.every(activity => completedActivities.has(activity.id.toString())) ?? false
      : true
    const backendCompleted = currentCompletion?.isCompleted || (currentCompletion?.percentage ?? 0) >= 100
    
    if (!localActivitiesCompleted && !backendCompleted) {
      if (hasActivities) {
        alert('⚠️ Please complete all activities in this lesson before proceeding to the next one!')
        return
      }
    }
    
    if (!backendCompleted) {
      // Fetch fresh data from backend to be sure
      try {
        const progress = await getLessonProgress(course.id, currentLesson.id)
        if (!progress || (!progress.is_completed && (progress.completion_percentage ?? 0) < 100)) {
          alert('⚠️ Please complete all activities in this lesson before proceeding to the next one!')
          return
        }
      } catch (err) {
        alert('⚠️ Please complete all activities in this lesson before proceeding!')
        return
      }
    }
    
    // Update completion data before navigating
    await fetchAllLessonCompletions(course.id, lessons)
    
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson?.id)
    if (currentIndex < lessons.length - 1) {
      await handleLessonSelect(currentIndex + 1)
    }
  }

  const handlePrevious = async () => {
    if (!currentLesson || !course) return
    
    // First ensure all completion data is up to date
    await fetchAllLessonCompletions(course.id, lessons)
    
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson?.id)
    if (currentIndex > 0) {
      await handleLessonSelect(currentIndex - 1)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-[var(--text-secondary)]">Loading course content...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state with fallback
  if (error || !course) {
    // Fallback state for offline content
    const [fallbackCurrentIndex, setFallbackCurrentIndex] = useState(0)
    
    // Fallback to static content if API fails
    const fallbackCourse = {
      title: 'HTML5 Tutorial',
      description: 'HTML is the standard markup language for Web pages.',
    }
    
    const fallbackLessons = ['HTML Introduction', 'HTML Editors', 'HTML Basic']
    const fallbackCurrentTopic = fallbackLessons[fallbackCurrentIndex]
    
    // Fallback navigation handlers
    const handleFallbackNext = () => {
      if (fallbackCurrentIndex < fallbackLessons.length - 1) {
        setFallbackCurrentIndex(fallbackCurrentIndex + 1)
      }
    }

    const handleFallbackPrevious = () => {
      if (fallbackCurrentIndex > 0) {
        setFallbackCurrentIndex(fallbackCurrentIndex - 1)
      }
    }
    
    // Dynamic content based on current lesson
    const getLessonContent = (index: number) => {
      const contents = [
        // HTML Introduction
        `<!DOCTYPE html>
<html>
<head>
<title>HTML Introduction</title>
</head>
<body>

<h1>What is HTML?</h1>
<p>HTML stands for <strong>Hyper Text Markup Language</strong></p>
<p>HTML is the standard markup language for creating Web pages</p>
<p>HTML describes the structure of a Web page</p>

</body>
</html>`,
        // HTML Editors
        `<!DOCTYPE html>
<html>
<head>
<title>HTML Editors</title>
</head>
<body>

<h1>HTML Editors</h1>
<p>You can edit HTML files using:</p>
<ul>
  <li><strong>Visual Studio Code</strong> - Popular and free</li>
  <li><strong>Sublime Text</strong> - Fast and lightweight</li>
  <li><strong>Notepad++</strong> - Simple and effective</li>
</ul>

</body>
</html>`,
        // HTML Basic
        `<!DOCTYPE html>
<html>
<head>
<title>HTML Basic Structure</title>
</head>
<body>

<h1>HTML Basic Structure</h1>
<p>Every HTML document has these basic elements:</p>
<ul>
  <li><code>&lt;!DOCTYPE html&gt;</code> - Document type declaration</li>
  <li><code>&lt;html&gt;</code> - Root element</li>
  <li><code>&lt;head&gt;</code> - Contains metadata</li>
  <li><code>&lt;body&gt;</code> - Contains visible content</li>
</ul>

</body>
</html>`
      ]
      return contents[index] || contents[0]
    }

    const fallbackExample = getLessonContent(fallbackCurrentIndex)

    // Dynamic activities based on current lesson
    const getLessonActivity = (index: number) => {
      const activities = [
        // HTML Introduction Activity
        {
          id: 'html-introduction-activity',
          title: 'HTML Introduction Practice',
          description: 'Create your first HTML page with basic structure and content',
          instructions: [
            'Start with the HTML5 DOCTYPE declaration',
            'Create the basic HTML structure with html, head, and body tags',
            'Add a title "My First HTML Page" in the head section',
            'Add an h1 heading that says "Welcome to HTML!"',
            'Add a paragraph explaining what HTML is'
          ],
          initialCode: `<!DOCTYPE html>
<html>
<head>
    <!-- Add your title here -->
</head>
<body>
    <!-- Add your heading and paragraph here -->
</body>
</html>`,
          expectedCode: `<!DOCTYPE html>
<html>
<head>
    <title>My First HTML Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>HTML is the markup language for creating web pages</p>
</body>
</html>`,
          expectedOutput: 'Welcome to HTML!',
          hints: [
            'Remember to add a <title> tag inside the <head> section',
            'Use <h1> tags for the main heading',
            'Use <p> tags for paragraphs about HTML',
            'Make sure all tags are properly closed'
          ]
        },
        // HTML Editors Activity
        {
          id: 'html-editors-activity',
          title: 'HTML Editors Practice',
          description: 'Create a page listing different HTML editors',
          instructions: [
            'Create an HTML page with proper structure',
            'Add a title "HTML Editors" in the head',
            'Add an h1 heading "Best HTML Editors"',
            'Create an unordered list with at least 3 HTML editors',
            'Use <strong> tags to highlight editor names'
          ],
          initialCode: `<!DOCTYPE html>
<html>
<head>
    <title>HTML Editors</title>
</head>
<body>
    <!-- Add your heading and list here -->
</body>
</html>`,
          expectedCode: `<!DOCTYPE html>
<html>
<head>
    <title>HTML Editors</title>
</head>
<body>
    <h1>Best HTML Editors</h1>
    <ul>
        <li><strong>Visual Studio Code</strong></li>
        <li><strong>Sublime Text</strong></li>
        <li><strong>Atom</strong></li>
    </ul>
</body>
</html>`,
          expectedOutput: 'Best HTML Editors',
          hints: [
            'Use <ul> for unordered lists',
            'Use <li> for list items',
            'Use <strong> to make text bold',
            'Include at least 3 popular editors'
          ]
        },
        // HTML Basic Activity
        {
          id: 'html-basic-activity',
          title: 'HTML Basic Structure',
          description: 'Practice creating proper HTML document structure',
          instructions: [
            'Create a complete HTML document',
            'Add DOCTYPE declaration',
            'Include meta charset and viewport tags',
            'Add a title "HTML Structure"',
            'Create a main heading and explain each HTML element'
          ],
          initialCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Add meta tags and title -->
</head>
<body>
    <!-- Add content explaining HTML structure -->
</body>
</html>`,
          expectedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Structure</title>
</head>
<body>
    <h1>HTML Document Structure</h1>
    <p>Every HTML document contains these essential elements</p>
</body>
</html>`,
          expectedOutput: 'HTML Document Structure',
          hints: [
            'Add charset meta tag for proper encoding',
            'Include viewport meta tag for responsive design',
            'Use descriptive title in the head section',
            'Structure your content with proper headings and paragraphs'
          ]
        }
      ]
      return activities[index] || activities[0]
    }

    const fallbackActivity = getLessonActivity(fallbackCurrentIndex)

    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Alert
            message="Using Offline Content"
            description={`API connection failed: ${error}. Showing static content for demonstration.`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        </div>
        <TutorialLayout
          title={fallbackCourse.title}
          description={fallbackCourse.description}
          currentTopic={fallbackCurrentTopic}
          topics={fallbackLessons}
          onNext={handleFallbackNext}
          onPrevious={handleFallbackPrevious}
          onLessonSelect={(index) => setFallbackCurrentIndex(index)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="space-y-12">
                <div className="bg-[var(--surface)] rounded-2xl p-8 text-[var(--text-primary)] border border-[var(--border)]">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-2xl flex items-center justify-center border border-[var(--border)]">
                      <Code2 className="w-8 h-8 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{fallbackLessons[fallbackCurrentIndex]}</h1>
                    <p className="text-[var(--text-secondary)] text-lg">
                      {fallbackCurrentIndex === 0 && "Learn what HTML is and why it's important for web development"}
                      {fallbackCurrentIndex === 1 && "Discover the best tools and editors for writing HTML code"}
                      {fallbackCurrentIndex === 2 && "Understand the basic structure that every HTML document needs"}
                    </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 mb-8">
                  <CodeExecutor
                    initialCode={fallbackExample}
                    language="html"
                  />
                </div>
                
                <div className="mt-8">
                  <ActivityContainer
                    activity={fallbackActivity}
                    onComplete={handleActivityComplete}
                  />
                </div>
              </div>
            </div>
          </div>
        </TutorialLayout>
      </div>
    )
  }

  // Get topic titles for sidebar navigation
  const topicTitles = lessons.map(lesson => lesson.title)
  const currentTopicTitle = currentLesson?.title || 'HTML Introduction'
  const currentIndex = getCurrentLessonIndex()

  // Prepare lesson completion data for TutorialLayout
  const lessonIds = lessons.map(lesson => lesson.id)
  const lessonCompletionStatuses = lessons.map(lesson => {
    const completion = lessonCompletionData.get(lesson.id)
    const hasActivities = Array.isArray(lesson.activities) && lesson.activities.length > 0
    const isCompleted = hasActivities
      ? (completion?.isCompleted || (completion?.percentage ?? 0) >= 100)
      : true

    return {
      isCompleted,
      percentage: hasActivities ? (completion?.percentage || 0) : 100
    }
  })

  // Get current lesson content and code examples
  const lessonContent = currentLesson?.content || '<h2>Welcome to HTML!</h2><p>Loading lesson content...</p>'
  
  // Only show course title/description on first lesson, otherwise show lesson title
  const displayTitle = currentIndex === 0 ? course.title : (currentLesson?.title || course.title)
  const displayDescription = currentIndex === 0 ? (course.description || '') : (currentLesson?.description || '')
  
  // Check if current lesson is completed
  const currentLessonCompletion = currentLesson ? lessonCompletionData.get(currentLesson.id) : null
  const hasCurrentActivities = Array.isArray(currentLesson?.activities) && currentLesson.activities.length > 0
  const localActivitiesCompleted = hasCurrentActivities
    ? currentLesson.activities?.every(activity => completedActivities.has(activity.id.toString())) ?? false
    : true
  const backendCurrentCompleted = currentLessonCompletion ? (currentLessonCompletion.isCompleted || currentLessonCompletion.percentage >= 100) : false
  const isCurrentLessonCompleted = localActivitiesCompleted || backendCurrentCompleted
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <TutorialLayout
        title={displayTitle}
        description={displayDescription}
        currentTopic={currentTopicTitle}
        topics={topicTitles}
        lessonIds={lessonIds}
        lessonCompletionStatuses={lessonCompletionStatuses}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onLessonSelect={handleLessonSelect}
        showCourseInfo={currentIndex === 0}
        isCurrentLessonCompleted={isCurrentLessonCompleted}
      >
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Main Content Area */}
            <div className="space-y-12">

              {/* Topics Section - Display topics with their content and code examples */}
              {currentLesson?.topics && currentLesson.topics.length > 0 && (
                <div className="mt-16 mb-16">
                  <TopicRenderer topics={currentLesson.topics} />
                </div>
              )}

              {/* Dynamic Activities Section */}
              <div className="space-y-12">
                {activities.map((activity) => {
                  const activityCompleted = completedActivities.has(activity.id.toString())
                  return (
                    <div key={activity.id} className="mt-8">
                      <ActivityContainer
                        activity={activity}
                        isCompleted={activityCompleted}
                        onComplete={handleActivityComplete}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Fallback message if no content */}
              {!currentLesson?.content && (!currentLesson?.topics || currentLesson.topics.length === 0) && activities.length === 0 && (
                <div className="bg-[var(--surface)] rounded-2xl p-8 text-center border border-[var(--border)]">
                  <Code2 className="w-16 h-16 mx-auto text-[var(--text-disabled)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Content Available</h3>
                  <p className="text-[var(--text-secondary)]">
                    This lesson doesn't have content yet. Please add content through the admin panel.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </TutorialLayout>
    </div>
  )
}


