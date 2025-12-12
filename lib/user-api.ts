// Always use relative URLs - Next.js will proxy to the backend
// This works in both development (localhost) and production (Vercel)
export const USER_API_BASE = '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	// Use relative URL - Next.js proxy will forward to backend
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

export interface UserRegistrationData {
	fullName: string;
	email: string;
	password: string;
}

export interface UserLoginData {
	email: string;
	password: string;
	remember?: boolean;
}

export interface UserPreferences {
	// General Settings
	theme: 'light' | 'dark';
	language: string;
	
	// Notifications Settings
	emailNotifications: boolean;
	pushNotifications: boolean;
	weeklyDigest: boolean;
	achievementAlerts: boolean;
	reminderAlerts: boolean;
	
	// Privacy Settings
	profileVisibility: 'public' | 'friends' | 'private';
	showProgress: boolean;
	showBadges: boolean;
	allowMessages: boolean;
	
	// Learning Settings
	dailyGoal: number;
	difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	autoSave: boolean;
	skipIntros: boolean;
	showHints: boolean;
	
	// Accessibility Settings
	fontSize: 'small' | 'medium' | 'large' | 'extra-large';
	reducedMotion: boolean;
	highContrast: boolean;
	soundEffects: boolean;
}

export interface User {
	id: string;
	fullName: string;
	email: string;
	avatar?: string;
	joinDate: string;
	progress: {
		completedCourses: number;
		totalCourses: number;
		currentCourse?: string;
		streak: number;
		totalPoints: number;
		rank: number;
		badges: string[];
		recentLessons: {
			title: string;
			progress: number;
			lastAccessed: string;
		}[];
	};
	preferences: UserPreferences;
}

export interface AuthResponse {
	message: string;
	user: User;
}

export interface ErrorResponse {
	message: string;
	errors?: Record<string, string[]>;
}

/**
 * Register a new user
 */
export async function userRegister(userData: UserRegistrationData): Promise<AuthResponse> {
	return request(`/api/user/register`, {
		method: 'POST',
		body: JSON.stringify(userData),
	});
}

/**
 * Login user
 */
export async function userLogin(loginData: UserLoginData): Promise<AuthResponse> {
	return request(`/api/user/login`, {
		method: 'POST',
		body: JSON.stringify(loginData),
	});
}

/**
 * Get current authenticated user
 */
export async function userMe(): Promise<{ user: User } | null> {
	try {
		return await request(`/api/user/me`);
	} catch {
		return null;
	}
}

/**
 * Logout user
 */
export async function userLogout(): Promise<{ message: string }> {
	return request(`/api/user/logout`, { 
		method: 'POST' 
	});
}

/**
 * Update user profile
 */
export async function userUpdateProfile(updates: Partial<User>): Promise<AuthResponse> {
	return request(`/api/user/profile`, {
		method: 'PUT',
		body: JSON.stringify(updates),
	});
}

/**
 * Get user settings
 */
export async function getUserSettings(): Promise<{ preferences: UserPreferences }> {
	return request(`/api/user/settings`);
}

/**
 * Update user settings
 */
export async function updateUserSettings(settings: Partial<UserPreferences>): Promise<{ message: string; preferences: UserPreferences }> {
	return request(`/api/user/settings`, {
		method: 'PUT',
		body: JSON.stringify(settings),
	});
}

/**
 * Reset settings to defaults
 */
export async function resetUserSettings(): Promise<{ message: string; preferences: UserPreferences }> {
	return request(`/api/user/settings/reset`, {
		method: 'POST',
	});
}

/**
 * Get storage usage
 */
export async function getStorageUsage(): Promise<{
	usedBytes: number;
	usedMB: number;
	maxMB: number;
	percentage: number;
	percentageFormatted: string;
}> {
	return request(`/api/user/settings/storage`);
}

/**
 * Export user data
 */
export async function exportUserData(): Promise<{
	message: string;
	data: any;
	filename: string;
}> {
	return request(`/api/user/settings/export`);
}

/**
 * Clear all user data
 */
export async function clearUserData(confirm: boolean): Promise<{ message: string; progress: any }> {
	return request(`/api/user/settings/clear-data`, {
		method: 'POST',
		body: JSON.stringify({ confirm }),
	});
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
	return request(`/api/user/forgot-password`, {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

/**
 * Reset password with token
 */
export async function resetPassword(data: {
	token: string;
	email: string;
	password: string;
	password_confirmation: string;
}): Promise<{ message: string }> {
	return request(`/api/user/reset-password`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
}
