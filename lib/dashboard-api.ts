// Use relative URLs - Next.js proxy will forward to backend
// This ensures cookies work properly and avoids CORS issues
const API_BASE_URL = '';

// Dashboard statistics interface
export interface DashboardStats {
    totalPoints: number;
    pointsThisWeek: number;
    streak: number;
    completedCourses: number;
    totalCourses: number;
    currentCourse: string | null;
    recentLessons: {
        title: string;
        progress: number;
        lastAccessed: string;
        courseTitle: string;
    }[];
    timeSpent: string;
    lessonsCompleted: number;
    averageScore: number;
    projectsCompleted: number;
    badges: string[];
}

// Helper function to make API requests with credentials
async function request(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {}),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: 'include', // Include cookies for session management
            ...options,
            headers,
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
 * Get dashboard statistics for the current user
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    // Get user ID from localStorage
    let userId: string | undefined;
    try {
        const userData = localStorage.getItem('auralearn_user');
        if (userData) {
            const user = JSON.parse(userData);
            userId = user.id?.toString();
        }
    } catch (e) {
        console.warn('Could not get user ID for dashboard stats');
    }

    const params = new URLSearchParams();
    if (userId) {
        params.append('user_id', userId);
    }

    return request(`/api/dashboard/stats?${params.toString()}`, {
        method: 'GET',
    });
}

