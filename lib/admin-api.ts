// Always use relative URLs - Next.js will proxy to the backend
// This works in both development (localhost) and production (Vercel)
// The Next.js rewrites handle the proxying automatically
export const ADMIN_API_BASE = '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	// Use relative URL - Next.js proxy will forward to backend
	const res = await fetch(path, {
		credentials: "include",
		...init,
		headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
	});
	if (!res.ok) throw new Error((await res.json().catch(() => ({} as any)))?.message || `Request failed: ${res.status}`);
	return res.json() as Promise<T>;
}

export async function adminLogin(email: string, password: string): Promise<{ admin: { id: number; name: string; email: string } }> {
	return request(`/api/admin/login`, {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});
}

export async function adminMe(): Promise<{ admin: { id: number; name: string; email: string } } | null> {
	try {
		return await request(`/api/admin/me`);
	} catch {
		return null;
	}
}

export async function adminLogout(): Promise<void> {
	await request(`/api/admin/logout`, { method: 'POST' });
}

export async function adminOverview(): Promise<{ stats: { users: number; admins: number; queuedJobs: number; supabase?: { ok: boolean; error?: string } } }> {
	return request(`/api/admin/overview`);
}

export async function adminUsers(limit = 20): Promise<{ users: { id: number; name: string; email: string; created_at: string }[] }> {
	return request(`/api/admin/users?limit=${limit}`);
}


export type AuditLog = {
	id: number;
	user_type: string;
	user_id: number | null;
	event_type: string;
	description: string;
	event_data: any;
	ip_address: string;
	device_type: string;
	browser: string;
	platform: string;
	location: string | null;
	created_at: string;
};

export async function adminLogs(limit = 200, type: "audit" | "application" = "audit"): Promise<{ lines?: string[]; logs?: AuditLog[]; type: string }> {
	return request(`/api/admin/logs?limit=${limit}&type=${type}`);
}

export type SystemSetting = {
	id: number;
	key: string;
	value: string;
	typed_value: any;
	type: string;
	label: string;
	description: string | null;
	is_editable: boolean;
	is_sensitive: boolean;
};

export type SystemSettings = Record<string, SystemSetting[]>;

export async function adminSettings(): Promise<{ settings: SystemSettings }> {
	return request(`/api/admin/settings`);
}

export async function adminUpdateSettings(settings: { id: number; value: string }[]): Promise<{ message: string; changes: number }> {
	return request(`/api/admin/settings`, {
		method: 'PUT',
		body: JSON.stringify({ settings }),
	});
}

// User Management API Functions
export interface AdminUser {
	id: number;
	name: string;
	full_name: string;
	email: string;
	password_hash?: string; // Added password hash field for admin viewing
	join_date: string;
	is_active: number;
	created_at: string;
	updated_at?: string;
	progress?: any;
	preferences?: any;
}

export interface AdminUserCreateData {
	name: string;
	full_name: string;
	email: string;
	password: string;
	is_active?: boolean;
	join_date?: string;
}

export interface AdminUserUpdateData {
	name?: string;
	full_name?: string;
	email?: string;
	password?: string;
	is_active?: boolean;
	join_date?: string;
	progress?: any;
	preferences?: any;
}

export async function adminGetUsers(limit = 50, search?: string): Promise<{ users: AdminUser[] }> {
	const params = new URLSearchParams();
	params.append('limit', limit.toString());
	if (search) params.append('search', search);
	
	return request(`/api/admin/user-management/?${params.toString()}`);
}

export async function adminGetUser(id: number): Promise<{ user: AdminUser }> {
	return request(`/api/admin/user-management/${id}`);
}

export async function adminCreateUser(userData: AdminUserCreateData): Promise<{ message: string; user: AdminUser }> {
	return request(`/api/admin/user-management/`, {
		method: 'POST',
		body: JSON.stringify(userData),
	});
}

export async function adminUpdateUser(id: number, userData: AdminUserUpdateData): Promise<{ message: string; user: AdminUser }> {
	return request(`/api/admin/user-management/${id}`, {
		method: 'PUT',
		body: JSON.stringify(userData),
	});
}

export async function adminDeleteUser(id: number): Promise<{ message: string; deleted_user: { id: number; name: string; email: string } }> {
	return request(`/api/admin/user-management/${id}`, {
		method: 'DELETE',
	});
}

export async function adminToggleUserStatus(id: number): Promise<{ message: string; user: AdminUser }> {
	return request(`/api/admin/user-management/${id}/toggle-status`, {
		method: 'PATCH',
	});
}

export async function adminGetUserStats(): Promise<{ stats: { total: number; active: number; inactive: number; recent: number } }> {
	return request(`/api/admin/user-management/stats`);
}

// Course Management API Functions
export interface AdminCourse {
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
	is_published?: boolean;
	order_index?: number;
	lessons_count?: number;
	created_at: string;
	updated_at?: string;
}

export interface AdminLesson {
	id: number;
	course_id: number;
	title: string;
	slug: string;
	description?: string;
	content?: string;
	order_index?: number;
	duration_minutes?: number;
	is_locked?: boolean;
	is_published?: boolean;
	lesson_type?: string;
	objectives?: string[];
	prerequisites?: string[];
	topics?: AdminTopic[];
	codeExamples?: AdminCodeExample[];
	activities?: AdminActivity[];
	topics_count?: number;
	exercises_count?: number;
	activities_count?: number;
	created_at: string;
	updated_at?: string;
}

export interface AdminTopic {
	id: number;
	lesson_id: number;
	title: string;
	content: string;
	content_type?: string;
	order_index?: number;
	metadata?: any;
	created_at: string;
	updated_at?: string;
}

export interface AdminCodeExample {
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
	test_cases?: any[];
	order_index?: number;
	created_at: string;
	updated_at?: string;
}

export interface AdminActivity {
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
	order_index?: number;
	is_required?: boolean;
	is_published?: boolean;
	metadata?: any;
	created_at: string;
	updated_at?: string;
}

export interface AdminCourseCreateData {
	title: string;
	description?: string;
	category?: string;
	difficulty_level?: string;
	tags?: string[] | string;
	thumbnail?: string;
	is_free?: boolean;
	is_published?: boolean;
	order_index?: number;
}

export interface AdminCourseUpdateData extends Partial<AdminCourseCreateData> {}

// Course API
export async function adminGetCourses(search?: string, published?: boolean): Promise<{ courses: AdminCourse[] }> {
	const params = new URLSearchParams();
	if (search) params.append('search', search);
	if (published !== undefined) params.append('published', String(published));
	
	return request(`/api/admin/courses?${params.toString()}`);
}

export async function adminGetCourse(id: string | number): Promise<{ course: AdminCourse }> {
	return request(`/api/admin/courses/${id}`);
}

export async function adminCreateCourse(courseData: AdminCourseCreateData): Promise<{ message: string; course: AdminCourse }> {
	// Convert tags string to array if needed
	if (courseData.tags && typeof courseData.tags === 'string') {
		courseData.tags = courseData.tags.split(',').map(tag => tag.trim());
	}
	
	return request(`/api/admin/courses`, {
		method: 'POST',
		body: JSON.stringify(courseData),
	});
}

export async function adminUpdateCourse(id: string | number, courseData: AdminCourseUpdateData): Promise<{ message: string; course: AdminCourse }> {
	// Convert tags string to array if needed
	if (courseData.tags && typeof courseData.tags === 'string') {
		courseData.tags = courseData.tags.split(',').map(tag => tag.trim());
	}
	
	return request(`/api/admin/courses/${id}`, {
		method: 'PUT',
		body: JSON.stringify(courseData),
	});
}

export async function adminDeleteCourse(id: string | number): Promise<{ message: string }> {
	return request(`/api/admin/courses/${id}`, {
		method: 'DELETE',
	});
}

export async function adminToggleCoursePublished(id: string | number): Promise<{ message: string; course: AdminCourse }> {
	return request(`/api/admin/courses/${id}/toggle-published`, {
		method: 'PATCH',
	});
}

// Lesson API
export async function adminGetLessons(courseId: string | number): Promise<{ lessons: AdminLesson[] }> {
	return request(`/api/admin/courses/${courseId}/lessons`);
}

export async function adminGetLesson(courseId: string | number, lessonId: string | number): Promise<{ lesson: AdminLesson }> {
	return request(`/api/admin/courses/${courseId}/lessons/${lessonId}`);
}

export async function adminCreateLesson(courseId: string | number, lessonData: any): Promise<{ message: string; lesson: AdminLesson }> {
	return request(`/api/admin/courses/${courseId}/lessons`, {
		method: 'POST',
		body: JSON.stringify(lessonData),
	});
}

export async function adminUpdateLesson(courseId: string | number, lessonId: string | number, lessonData: any): Promise<{ message: string; lesson: AdminLesson }> {
	return request(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
		method: 'PUT',
		body: JSON.stringify(lessonData),
	});
}

export async function adminDeleteLesson(courseId: string | number, lessonId: string | number): Promise<{ message: string }> {
	return request(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
		method: 'DELETE',
	});
}

export async function adminReorderLessons(courseId: string | number, lessons: { id: number; order_index: number }[]): Promise<{ message: string }> {
	return request(`/api/admin/courses/${courseId}/lessons/reorder`, {
		method: 'POST',
		body: JSON.stringify({ lessons }),
	});
}

// Topic API
export async function adminGetTopics(lessonId: string | number): Promise<{ topics: AdminTopic[] }> {
	return request(`/api/admin/lessons/${lessonId}/topics`);
}

export async function adminCreateTopic(lessonId: string | number, topicData: any): Promise<{ message: string; topic: AdminTopic }> {
	return request(`/api/admin/lessons/${lessonId}/topics`, {
		method: 'POST',
		body: JSON.stringify(topicData),
	});
}

export async function adminUpdateTopic(lessonId: string | number, topicId: string | number, topicData: any): Promise<{ message: string; topic: AdminTopic }> {
	return request(`/api/admin/lessons/${lessonId}/topics/${topicId}`, {
		method: 'PUT',
		body: JSON.stringify(topicData),
	});
}

export async function adminDeleteTopic(lessonId: string | number, topicId: string | number): Promise<{ message: string }> {
	return request(`/api/admin/lessons/${lessonId}/topics/${topicId}`, {
		method: 'DELETE',
	});
}

// Activity API
export async function adminGetActivities(lessonId: string | number): Promise<{ activities: AdminActivity[] }> {
	return request(`/api/admin/lessons/${lessonId}/activities`);
}

export async function adminCreateActivity(lessonId: string | number, activityData: any): Promise<{ message: string; activity: AdminActivity }> {
	return request(`/api/admin/lessons/${lessonId}/activities`, {
		method: 'POST',
		body: JSON.stringify(activityData),
	});
}

export async function adminUpdateActivity(lessonId: string | number, activityId: string | number, activityData: any): Promise<{ message: string; activity: AdminActivity }> {
	return request(`/api/admin/lessons/${lessonId}/activities/${activityId}`, {
		method: 'PUT',
		body: JSON.stringify(activityData),
	});
}

export async function adminDeleteActivity(lessonId: string | number, activityId: string | number): Promise<{ message: string }> {
	return request(`/api/admin/lessons/${lessonId}/activities/${activityId}`, {
		method: 'DELETE',
	});
}

export async function adminGetActivityStats(lessonId: string | number): Promise<{ stats: any }> {
	return request(`/api/admin/lessons/${lessonId}/activities/stats`);
}

// Code Example API
export async function adminGetCodeExamples(lessonId?: string | number, topicId?: string | number): Promise<{ code_examples: AdminCodeExample[] }> {
	const params = new URLSearchParams();
	if (lessonId) params.append('lesson_id', String(lessonId));
	if (topicId) params.append('topic_id', String(topicId));
	
	return request(`/api/admin/code-examples?${params.toString()}`);
}

export async function adminCreateCodeExample(codeExampleData: any): Promise<{ message: string; code_example: AdminCodeExample }> {
	return request(`/api/admin/code-examples`, {
		method: 'POST',
		body: JSON.stringify(codeExampleData),
	});
}

export async function adminUpdateCodeExample(id: string | number, codeExampleData: any): Promise<{ message: string; code_example: AdminCodeExample }> {
	return request(`/api/admin/code-examples/${id}`, {
		method: 'PUT',
		body: JSON.stringify(codeExampleData),
	});
}

export async function adminDeleteCodeExample(id: string | number): Promise<{ message: string }> {
	return request(`/api/admin/code-examples/${id}`, {
		method: 'DELETE',
	});
}

export async function adminDuplicateCodeExample(id: string | number): Promise<{ message: string; code_example: AdminCodeExample }> {
	return request(`/api/admin/code-examples/${id}/duplicate`, {
		method: 'POST',
	});
}

// Public Course API (for users)
export async function getCourses(category?: string, search?: string): Promise<{ courses: AdminCourse[] }> {
	const params = new URLSearchParams();
	params.append('published', 'true');
	if (category) params.append('category', category);
	if (search) params.append('search', search);
	
	return request(`/api/courses?${params.toString()}`);
}

export async function getCourseBySlug(slug: string): Promise<{ course: AdminCourse }> {
	return request(`/api/courses/slug/${slug}`);
}

export async function getLessonContent(courseId: string | number, lessonId: string | number): Promise<{ lesson: AdminLesson; progress: any }> {
	return request(`/api/courses/${courseId}/lessons/${lessonId}`);
}

export async function markLessonComplete(courseId: string | number, lessonId: string | number): Promise<{ message: string; progress: any }> {
	return request(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
		method: 'POST',
	});
}

export async function validateCodeExample(id: string | number, userCode: string): Promise<{ is_correct: boolean; feedback: string; hints?: string }> {
	return request(`/api/courses/code-examples/${id}/validate`, {
		method: 'POST',
		body: JSON.stringify({ user_code: userCode }),
	});
} 