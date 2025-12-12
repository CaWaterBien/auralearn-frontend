import { useEffect, useRef, useState } from 'react';
import { trackLessonStart, trackLessonProgress, trackTimeSpent } from '@/lib/progress-api';

interface UseLessonTrackerOptions {
  courseId: string | number;
  lessonId: string | number;
  totalTopics?: number;
  onProgressUpdate?: (percentage: number) => void;
}

/**
 * Custom hook to automatically track lesson viewing and time spent
 * 
 * Usage:
 * ```tsx
 * const { startTracking, stopTracking, timeSpent, progressPercentage } = useLessonTracker({
 *   courseId: course.id,
 *   lessonId: currentLesson.id,
 *   totalTopics: lesson.topics.length
 * });
 * ```
 */
export function useLessonTracker({
  courseId,
  lessonId,
  totalTopics = 0,
  onProgressUpdate
}: UseLessonTrackerOptions) {
  const [timeSpent, setTimeSpent] = useState(0); // in seconds
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<Date | null>(null);

  // Track lesson start when component mounts or lesson changes
  useEffect(() => {
    if (!courseId || !lessonId) return;

    console.log('📚 Starting lesson tracking:', { courseId, lessonId });
    
    // Record lesson start
    trackLessonStart(courseId, lessonId).catch(err => {
      console.error('Failed to track lesson start:', err);
    });

    startTracking();

    return () => {
      stopTracking();
    };
  }, [courseId, lessonId]);

  // Start tracking time
  const startTracking = () => {
    if (isTracking) return;

    startTimeRef.current = new Date();
    lastSyncRef.current = new Date();
    setIsTracking(true);

    // Update time every second
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        setTimeSpent(elapsed);

        // Sync with backend every 60 seconds
        const timeSinceLastSync = lastSyncRef.current 
          ? (new Date().getTime() - lastSyncRef.current.getTime()) / 1000
          : 0;

        if (timeSinceLastSync >= 60) {
          const minutes = Math.floor(elapsed / 60);
          if (minutes > 0) {
            trackTimeSpent(courseId, lessonId, minutes).catch(err => {
              console.error('Failed to sync time:', err);
            });
            lastSyncRef.current = new Date();
          }
        }
      }
    }, 1000);
  };

  // Stop tracking time
  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Send final time update
    if (startTimeRef.current) {
      const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
      const minutes = Math.floor(elapsed / 60);
      
      if (minutes > 0) {
        trackTimeSpent(courseId, lessonId, minutes).catch(err => {
          console.error('Failed to send final time:', err);
        });
      }
    }

    setIsTracking(false);
    startTimeRef.current = null;
    lastSyncRef.current = null;
  };

  // Update progress percentage
  const updateProgress = (percentage: number) => {
    setProgressPercentage(percentage);
    
    // Send to backend
    trackLessonProgress(courseId, lessonId, percentage).catch(err => {
      console.error('Failed to update progress:', err);
    });

    // Call optional callback
    if (onProgressUpdate) {
      onProgressUpdate(percentage);
    }
  };

  // Calculate progress based on completed topics
  const markTopicComplete = (topicIndex: number) => {
    if (totalTopics > 0) {
      const newPercentage = Math.min(100, ((topicIndex + 1) / totalTopics) * 100);
      updateProgress(newPercentage);
    }
  };

  // Pause tracking (e.g., when user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - pause tracking but don't stop completely
        console.log('⏸️ Pausing lesson tracking (tab hidden)');
      } else {
        // Page visible again - resume
        console.log('▶️ Resuming lesson tracking (tab visible)');
        if (!isTracking) {
          startTracking();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTracking]);

  // Format time for display
  const formatTime = () => {
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeSpent,
    progressPercentage,
    isTracking,
    formatTime,
    startTracking,
    stopTracking,
    updateProgress,
    markTopicComplete
  };
}

