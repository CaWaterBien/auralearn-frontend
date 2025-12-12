// API Base URL for backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// Achievement interfaces based on database schema
export interface Achievement {
    id: number;
    user_id: number;
    activity_id: number;
    submission_id: number;
    certificate_id: string;
    certificate_type: 'completion' | 'excellence' | 'first_attempt' | 'perfect_score';
    badge_level: 'bronze' | 'silver' | 'gold' | 'platinum';
    achievement_data: {
        score: number;
        attempt_number: number;
        time_spent_minutes: number;
        completion_date: string;
        activity_title?: string;
        lesson_title?: string;
    };
    certificate_url?: string;
    is_verified: boolean;
    earned_at: string;
    created_at: string;
    updated_at: string;
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
    created_at: string;
    updated_at: string;
}


// Helper function to make API requests with authentication
async function request(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
        // Get auth token from localStorage
        const token = localStorage.getItem('auralearn_token');
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers as Record<string, string> || {}),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Get all achievements for the current user
 */
export async function getUserAchievements(): Promise<{ achievements: Achievement[] }> {
    // Get user ID from localStorage
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for achievements');
    }

    const params = new URLSearchParams();
    if (userId) {
        params.append('user_id', userId);
    }

    return request(`/api/achievements?${params.toString()}`, {
        method: 'GET',
    });
}


/**
 * Get user progress for all courses
 */
export async function getUserProgress(): Promise<{ progress: UserProgress[] }> {
    // Get user ID from localStorage
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for progress');
    }

    const params = new URLSearchParams();
    if (userId) {
        params.append('user_id', userId);
    }

    return request(`/api/user/progress?${params.toString()}`, {
        method: 'GET',
    });
}

/**
 * Get achievement statistics for the user
 */
export async function getAchievementStats(): Promise<{
    total_achievements: number;
    certificates_earned: number;
    total_points: number;
    badges: {
        bronze: number;
        silver: number;
        gold: number;
        platinum: number;
    };
    recent_achievements: Achievement[];
}> {
    // Get user ID from localStorage
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for achievement stats');
    }

    const params = new URLSearchParams();
    if (userId) {
        params.append('user_id', userId);
    }

    return request(`/api/achievements/stats?${params.toString()}`, {
        method: 'GET',
    });
}


/**
 * Helper function to format badge level to display name
 */
export function getBadgeDisplayName(badgeLevel: string): string {
    const badges: { [key: string]: string } = {
        bronze: 'Bronze',
        silver: 'Silver',
        gold: 'Gold',
        platinum: 'Platinum'
    };
    return badges[badgeLevel.toLowerCase()] || badgeLevel;
}

/**
 * Helper function to get badge color
 */
export function getBadgeColor(badgeLevel: string): string {
    const colors: { [key: string]: string } = {
        bronze: 'from-amber-600 to-amber-700',
        silver: 'from-gray-400 to-gray-500',
        gold: 'from-yellow-400 to-yellow-600',
        platinum: 'from-cyan-400 to-blue-500'
    };
    return colors[badgeLevel.toLowerCase()] || 'from-gray-400 to-gray-600';
}

/**
 * Helper function to get certificate type display name
 */
export function getCertificateTypeDisplayName(certificateType: string): string {
    const types: { [key: string]: string } = {
        completion: 'Completion',
        excellence: 'Excellence',
        first_attempt: 'First Attempt',
        perfect_score: 'Perfect Score'
    };
    return types[certificateType] || certificateType;
}

