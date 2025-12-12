'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import TutorialLayout from '@/components/tutorial-layout'
import CodeExecutor from '@/components/code-executor'
import ActivityContainer from '@/components/activity-container'
import TopicRenderer from '@/components/topic-renderer'
import { Code2, Palette, Zap } from 'lucide-react'
import { getCourseBySlug, formatActivityForUI, markLessonComplete, type Course, type Lesson, type UIActivity } from '@/lib/course-api'
import { Spin, Alert } from 'antd'
import { useLessonTracker } from '@/hooks/use-lesson-tracker'

export default function CoursePage() {
  const params = useParams()
  const courseSlug = params?.slug as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [activities, setActivities] = useState<UIActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!courseSlug) return

    const loadCourseData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch course data by slug
        const response = await getCourseBySlug(courseSlug)
        setCourse(response.course)
        setLessons(response.course.lessons || [])
        
        // Set the first lesson as current
        if (response.course.lessons && response.course.lessons.length > 0) {
          const firstLesson = response.course.lessons[0]
          setCurrentLesson(firstLesson)
          
          // Convert backend activities to UI format
          if (firstLesson.activities && firstLesson.activities.length > 0) {
            const uiActivities = firstLesson.activities.map(formatActivityForUI)
            setActivities(uiActivities)
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
  }, [courseSlug])

  // Track lesson progress automatically
  const { timeSpent, progressPercentage, formatTime, markTopicComplete } = useLessonTracker({
    courseId: course?.id || 0,
    lessonId: currentLesson?.id || 0,
    totalTopics: (currentLesson?.topics?.length || 0) + activities.length,
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

  const handleActivityComplete = (activityId: string) => {
    console.log(`✅ Activity ${activityId} completed!`)
    
    // Track this activity as completed
    setCompletedActivities(prev => new Set([...prev, activityId]));
    
    // Calculate overall lesson progress
    const totalItems = (currentLesson?.topics?.length || 0) + activities.length;
    const completedItems = completedActivities.size + 1; // +1 for the just-completed activity
    
    if (totalItems > 0) {
      const percentage = Math.round((completedItems / totalItems) * 100);
      console.log(`📈 Progress: ${completedItems}/${totalItems} = ${percentage}%`);
      
      // This will also trigger markLessonComplete if at 100%
      if (percentage >= 100) {
        markTopicComplete(totalItems - 1);
      }
    }
  }

  // Get current lesson index
  const getCurrentLessonIndex = () => {
    return lessons.findIndex(lesson => lesson.id === currentLesson?.id)
  }

  // Get the appropriate icon based on course category/title
  const getCourseIcon = () => {
    if (course?.title.toLowerCase().includes('css')) {
      return <Palette className="w-8 h-8 text-[var(--text-secondary)]" />
    } else if (course?.title.toLowerCase().includes('javascript')) {
      return <Zap className="w-8 h-8 text-[var(--text-secondary)]" />
    }
    return <Code2 className="w-8 h-8 text-[var(--text-secondary)]" />
  }

  const getCourseColor = () => {
    if (course?.title.toLowerCase().includes('css')) {
      return 'from-blue-500 to-indigo-600'
    } else if (course?.title.toLowerCase().includes('javascript')) {
      return 'from-yellow-500 to-orange-600'
    }
    return 'from-orange-500 to-red-600'
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

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert
            message="Course Not Found"
            description={error || "This course doesn't exist or is not published yet."}
            type="error"
            showIcon
          />
        </div>
      </div>
    )
  }

  // Get topic titles for sidebar navigation
  const topicTitles = lessons.map(lesson => lesson.title)
  const currentTopicTitle = currentLesson?.title || course.title
  const currentIndex = getCurrentLessonIndex()

  // Get current lesson content
  const lessonContent = currentLesson?.content || `<h2>Welcome to ${course.title}!</h2><p>${course.description}</p>`

  // Only show course title/description on first lesson, otherwise show lesson title
  const displayTitle = currentIndex === 0 ? course.title : currentLesson?.title || course.title
  const displayDescription = currentIndex === 0 ? (course.description || `Learn ${course.title} fundamentals`) : (currentLesson?.description || '')

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <TutorialLayout
        title={displayTitle}
        description={displayDescription}
        currentTopic={currentTopicTitle}
        topics={topicTitles.length > 0 ? topicTitles : [course.title]}
        showCourseInfo={currentIndex === 0}
      >
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Main Content Area */}
            <div className="space-y-8">

              {/* Topics Section - Display topics with their content and code examples */}
              {currentLesson?.topics && currentLesson.topics.length > 0 && (
                <TopicRenderer topics={currentLesson.topics} />
              )}

              {/* Dynamic Activities Section */}
              {activities.map((activity) => (
                <ActivityContainer
                  key={activity.id}
                  activity={activity}
                  onComplete={handleActivityComplete}
                />
              ))}

              {/* Course Overview if no lessons */}
              {lessons.length === 0 && (
                <div className="bg-[var(--surface)] rounded-2xl p-8 text-center border border-[var(--border)]">
                  {getCourseIcon()}
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2 mt-4">Course Coming Soon</h3>
                  <p className="text-[var(--text-secondary)] mb-6">
                    {course.title} lessons are being prepared. Check back soon for content!
                  </p>
                  
                  {/* Course Features */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {course.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 bg-gradient-to-r ${getCourseColor()} text-white rounded-full text-sm font-medium`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </TutorialLayout>
    </div>
  )
}
