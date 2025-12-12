// Public Course API for user-facing interface
// This is separate from admin-api.ts to keep concerns separated

// Always use relative URLs - Next.js will proxy to the backend
const API_BASE = '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    // Use relative URL - Next.js proxy will forward to backend
    const res = await fetch(path, {
        credentials: "include",
        cache: 'no-store', // Force fresh data
        ...init,
        headers: { 
            'Content-Type': 'application/json', 
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...(init?.headers || {}) 
        },
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({} as any)))?.message || `Request failed: ${res.status}`);
    return res.json() as Promise<T>;
}

// Types for public course interface
export interface Course {
    id: number;
    title: string;
    slug: string;
    description?: string;
    category?: string;
    difficulty_level?: string;
    total_lessons?: number;
    duration_hours?: number;
    tags?: string[];
    thumbnail?: string;
    is_free?: boolean;
    created_at: string;
}

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    order_index?: number;
    duration_minutes?: number;
    is_locked?: boolean;
    lesson_type?: string;
    objectives?: string[];
    topics?: Topic[];
    codeExamples?: CodeExample[];
    activities?: Activity[];
    created_at: string;
}

export interface Topic {
    id: number;
    lesson_id: number;
    title: string;
    content: string;
    content_type?: string;
    order_index?: number;
    codeExamples?: CodeExample[];
    created_at: string;
}

export interface CodeExample {
    id: number;
    lesson_id?: number;
    topic_id?: number;
    title: string;
    description?: string;
    language: string;
    initial_code: string;
    solution_code?: string;
    hints?: string;
    is_interactive?: boolean;
    show_preview?: boolean;
    allow_reset?: boolean;
    order_index?: number;
    created_at: string;
}

export interface Activity {
    id: number;
    lesson_id: number;
    title: string;
    description?: string;
    activity_type: 'coding';
    instructions: string;
    questions?: any[];
    resources?: any[];
    time_limit?: number;
    max_attempts?: number;
    passing_score?: number;
    points?: number;
    is_required?: boolean;
    metadata?: any;
    created_at: string;
}

export interface UserProgress {
    id: number;
    user_id: number;
    course_id: number;
    lesson_id?: number;
    completion_percentage: number;
    is_completed: boolean;
    started_at?: string;
    completed_at?: string;
    completed_topics?: number[];
    completed_exercises?: number[];
    score?: number;
}

// Public API functions
export async function getCourses(category?: string, search?: string): Promise<{ courses: Course[] }> {
    const params = new URLSearchParams();
    // Always get published courses for public interface
    params.append('published', 'true');
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    return request(`/api/courses?${params.toString()}`);
}

export async function getCourseBySlug(slug: string): Promise<{ course: Course & { lessons: Lesson[] } }> {
    // Add cache busting parameter to ensure fresh data
    const timestamp = Date.now();
    return request(`/api/courses/slug/${slug}?t=${timestamp}`);
}

export async function getLessonContent(courseId: string | number, lessonId: string | number): Promise<{ lesson: Lesson; progress?: UserProgress }> {
    return request(`/api/courses/${courseId}/lessons/${lessonId}`);
}

export async function markLessonComplete(courseId: string | number, lessonId: string | number): Promise<{ message: string; progress: UserProgress }> {
    return request(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
    });
}

export async function validateCodeExample(id: string | number, userCode: string): Promise<{ is_correct: boolean; feedback: string; hints?: string }> {
    return request(`/api/code-examples/${id}/validate`, {
        method: 'POST',
        body: JSON.stringify({ user_code: userCode }),
    });
}

export async function getActivityById(activityId: string | number): Promise<{ activity: Activity }> {
    return request(`/api/activities/${activityId}`);
}

// Convert backend activity to frontend activity format
export function formatActivityForUI(activity: Activity): UIActivity {
    // Parse instructions - handle both string and array formats
    let instructions: string[] = [];
    if (typeof activity.instructions === 'string') {
        instructions = activity.instructions.split('\n').filter(Boolean);
    } else if (Array.isArray(activity.instructions)) {
        instructions = activity.instructions;
    }
    
    // Extract data from metadata (new format) or questions (legacy format)
    const metadata = activity.metadata || {};
    const questionData = Array.isArray(activity.questions) && activity.questions.length > 0 
        ? activity.questions[0] 
        : null;
    
    // Get initial code from metadata or question data
    let initialCode = '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <!-- Add your code here -->\n</body>\n</html>';
    let expectedCode = '';
    let expectedOutput = '';
    let hints: string[] = [];
    
    if (metadata.initial_code) {
        initialCode = metadata.initial_code;
    } else if (questionData?.initial_code) {
        initialCode = questionData.initial_code;
    }
    
    if (metadata.solution_example) {
        expectedCode = metadata.solution_example;
    } else if (metadata.solution_code) {
        expectedCode = metadata.solution_code;
    } else if (questionData?.solution_code) {
        expectedCode = questionData.solution_code;
    }
    
    if (metadata.expected_output) {
        expectedOutput = metadata.expected_output;
    } else {
        expectedOutput = activity.title; // fallback
    }
    
    if (metadata.hints && Array.isArray(metadata.hints)) {
        hints = metadata.hints;
    } else if (questionData?.hints && Array.isArray(questionData.hints)) {
        hints = questionData.hints;
    }
    
    return {
        id: activity.id.toString(),
        title: activity.title,
        description: activity.description || '',
        instructions: instructions,
        initialCode: initialCode,
        expectedCode: expectedCode,
        expectedOutput: expectedOutput,
        hints: hints
    };
}

// Submit activity code for validation and completion tracking
export async function submitActivity(activityId: string | number, userCode: string, timeSpentMinutes: number): Promise<{
    submission_id: number;
    attempt_number: number;
    is_completed: boolean;
    completion_status: 'pending' | 'passed' | 'failed' | 'needs_review';
    score: number;
    feedback: string;
    validation_summary: {
        overall: { passed: number; total: number; percentage: number };
        details: Record<string, { passed: boolean; message: string }>;
    };
    instruction_progress: {
        completed: number;
        total: number;
        percentage: number;
        details: Record<string, boolean>;
    };
    generated_output: string;
    hints?: string[];
    celebration?: {
        title: string;
        message: string;
        points_earned: number;
        badge_unlocked: string;
    };
    ai_recommendation?: string; // AI-powered recommendation for next activity based on mistakes
}> {
    // Get user ID for user-specific data isolation
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for submission');
    }

    const response = await request<any>(`/api/activities/${activityId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            user_code: userCode,
            time_spent_minutes: timeSpentMinutes,
            user_id: userId || 1 // Send user ID for backend isolation
        }),
    });
    
    // Check if backend returned an error even with 200 status
    if (response.success === false) {
        throw new Error(response.message || response.error || 'Submission failed');
    }
    
    return response;
}

// Get activity submission status for the current user
export async function getActivitySubmissionStatus(activityId: string | number): Promise<{
    activity_id: number;
    total_attempts: number;
    max_attempts?: number;
    attempts_remaining?: number;
    is_completed: boolean;
    best_score: number;
    latest_submission?: {
        id: number;
        attempt_number: number;
        score: number;
        completion_status: 'pending' | 'passed' | 'failed' | 'needs_review';
        submitted_at: string;
        feedback: string;
    };
}> {
    // Get user ID for user-specific data isolation
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for status check');
    }

    const params = new URLSearchParams();
    if (userId) {
        params.append('user_id', userId);
    } else {
        params.append('user_id', '1'); // Default user ID
    }

    return request(`/api/activities/${activityId}/status?${params.toString()}`, {
        method: 'GET',
    });
}

// Legacy function for backward compatibility - redirects to new submission system
export async function validateActivityCode(activityId: string | number, userCode: string): Promise<{ is_correct: boolean; feedback: string; hints?: string[]; expected_output?: string }> {
    try {
        // Calculate estimated time spent (simple heuristic based on code length)
        const timeSpentMinutes = Math.max(1, Math.min(30, Math.ceil(userCode.length / 100)));
        
        const submission = await submitActivity(activityId, userCode, timeSpentMinutes);
        
        return {
            is_correct: submission.is_completed,
            feedback: submission.feedback,
            hints: submission.hints,
            expected_output: submission.generated_output
        };
    } catch (error) {
        console.error('Activity submission failed:', error);
        throw error;
    }
}

// Interface for UI components (backward compatibility)
export interface UIActivity {
    id: string;
    title: string;
    description: string;
    instructions: string[];
    initialCode: string;
    expectedCode: string;
    expectedOutput: string;
    hints: string[];
}

// ============================================
// BATCH API FUNCTIONS FOR PERFORMANCE
// ============================================

/**
 * Get submission status for multiple activities at once
 * This dramatically reduces API calls and improves performance
 */
export async function batchGetActivityStatuses(activityIds: (string | number)[]): Promise<{
    [key: string]: {
        activity_id: number;
        total_attempts: number;
        max_attempts?: number;
        attempts_remaining?: number;
        is_completed: boolean;
        best_score: number;
        latest_submission?: any;
    }
}> {
    if (activityIds.length === 0) {
        return {};
    }

    // Get user ID for user-specific data isolation
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for batch status check');
    }

    // Create cache key based on activity IDs and user
    const cacheKey = `batch_status:${userId || 1}:${activityIds.sort().join(',')}`;
    
    // Check cache first
    try {
        const cached = localStorage.getItem(`api_activity:${cacheKey}`);
        if (cached) {
            const cacheEntry = JSON.parse(cached);
            const now = Date.now();
            // Check if cache is still valid (5 minutes)
            if (now < cacheEntry.timestamp + 5 * 60 * 1000) {
                console.log('📦 Using cached batch activity statuses');
                return cacheEntry.data;
            }
        }
    } catch (e) {
        console.warn('Cache read error:', e);
    }

    const response = await request<any>(`/api/activities/batch-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            activity_ids: activityIds,
            user_id: userId || 1
        })
    });

    const statuses = response.statuses || {};
    
    // Cache the response
    try {
        localStorage.setItem(`api_activity:${cacheKey}`, JSON.stringify({
            data: statuses,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Cache write error:', e);
    }

    return statuses;
}

/**
 * Get progress for multiple lessons at once
 * Reduces API calls when loading course/lesson data
 */
export async function batchGetLessonProgress(courseId: number, lessonIds: number[]): Promise<{
    [key: string]: {
        lesson_id: number;
        completion_percentage: number;
        is_completed: boolean;
        time_spent_minutes: number;
        started_at: string | null;
        completed_at: string | null;
    }
}> {
    if (lessonIds.length === 0) {
        return {};
    }

    // Get user ID
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for batch progress check');
    }

    // Create cache key based on course, lessons, and user
    const cacheKey = `batch_progress:${userId || 1}:${courseId}:${lessonIds.sort().join(',')}`;
    
    // Check cache first
    try {
        const cached = localStorage.getItem(`api_progress:${cacheKey}`);
        if (cached) {
            const cacheEntry = JSON.parse(cached);
            const now = Date.now();
            // Check if cache is still valid (5 minutes)
            if (now < cacheEntry.timestamp + 5 * 60 * 1000) {
                console.log('📦 Using cached batch lesson progress');
                return cacheEntry.data;
            }
        }
    } catch (e) {
        console.warn('Cache read error:', e);
    }

    const response = await request<any>(`/api/user/progress/batch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId || 1,
            course_id: courseId,
            lesson_ids: lessonIds
        })
    });

    const progress = response.progress || {};
    
    // Cache the response
    try {
        localStorage.setItem(`api_progress:${cacheKey}`, JSON.stringify({
            data: progress,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Cache write error:', e);
    }

    return progress;
}

/**
 * Helper function to check all activities in a lesson efficiently
 */
export async function checkLessonActivitiesCompletionBatch(activities: Activity[]): Promise<number> {
    if (activities.length === 0) {
        return 0;
    }

    const activityIds = activities.map(a => a.id);
    const statuses = await batchGetActivityStatuses(activityIds);
    
    let completedCount = 0;
    for (const activityId of activityIds) {
        const status = statuses[activityId];
        if (status && status.is_completed) {
            completedCount++;
        }
    }
    
    return completedCount;
}