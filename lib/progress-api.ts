/**
 * Progress Tracking API
 * Handles all user progress tracking: lesson views, completions, time spent, etc.
 */

// Helper function to make API requests with credentials
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(init?.headers || {})
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Get user ID from localStorage
function getUserId(): string | null {
  try {
    const userData = localStorage.getItem('auralearn_user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id?.toString();
    }
  } catch (e) {
    console.warn('Could not get user ID for progress tracking');
  }
  return null;
}

/**
 * Track when a user starts viewing a lesson
 */
export async function trackLessonStart(courseId: string | number, lessonId: string | number): Promise<void> {
  const userId = getUserId();
  if (!userId || !courseId || !lessonId || courseId === 0 || lessonId === 0) {
    console.log('⏭️ Skipping lesson tracking (invalid data or no user)');
    return;
  }

  try {
    const response = await fetch('/api/user/progress/lesson-start', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        started_at: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      console.log('✅ Lesson start tracked:', { courseId, lessonId });
    } else {
      console.log(`⚠️ Lesson tracking failed (${response.status}), continuing anyway`);
    }
  } catch (error) {
    // Silently fail - tracking is nice to have, not critical
    console.log('ℹ️ Lesson tracking unavailable, continuing without tracking');
  }
}

/**
 * Update lesson progress percentage
 */
export async function trackLessonProgress(
  courseId: string | number,
  lessonId: string | number,
  percentage: number
): Promise<void> {
  const userId = getUserId();
  if (!userId || !courseId || !lessonId || courseId === 0 || lessonId === 0) return;

  try {
    const response = await fetch('/api/user/progress/update', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        completion_percentage: percentage
      })
    });
    
    if (response.ok) {
      console.log('✅ Progress updated:', { percentage });
    }
  } catch (error) {
    // Silent fail
  }
}

/**
 * Mark a lesson as 100% complete
 */
export async function markLessonComplete(
  courseId: string | number,
  lessonId: string | number
): Promise<{ message: string; progress: any }> {
  return request(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
    method: 'POST'
  });
}

/**
 * Track time spent on a lesson
 */
export async function trackTimeSpent(
  courseId: string | number,
  lessonId: string | number,
  minutes: number
): Promise<void> {
  const userId = getUserId();
  if (!userId || !courseId || !lessonId || courseId === 0 || lessonId === 0 || minutes === 0) return;

  try {
    const response = await fetch('/api/user/progress/time', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        time_spent_minutes: minutes
      })
    });
    
    if (response.ok) {
      console.log(`✅ Time tracked: ${minutes}min`);
    }
  } catch (error) {
    // Silent fail
  }
}

/**
 * Get user progress for a specific lesson
 */
export async function getLessonProgress(
  courseId: string | number,
  lessonId: string | number
): Promise<{
  completion_percentage: number;
  is_completed: boolean;
  time_spent_minutes: number;
} | null> {
  const userId = getUserId();
  if (!userId) return null;

  try {
    return await request(`/api/user/progress?course_id=${courseId}&lesson_id=${lessonId}&user_id=${userId}`);
  } catch (error) {
    console.error('Failed to get lesson progress:', error);
    return null;
  }
}

/**
 * Track topic/activity completion within a lesson
 */
export async function trackTopicComplete(
  courseId: string | number,
  lessonId: string | number,
  topicId: string | number
): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    await request('/api/user/progress/topic', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        topic_id: topicId
      })
    });
    console.log('✅ Topic completion tracked:', { courseId, lessonId, topicId });
  } catch (error) {
    console.error('Failed to track topic completion:', error);
  }
}

