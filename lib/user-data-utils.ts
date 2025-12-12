// Utility functions for managing user-specific data isolation

/**
 * Get user-specific localStorage key for a given base key
 */
export function getUserSpecificKey(baseKey: string, userId?: string | number): string {
  if (!userId) {
    // Try to get user ID from localStorage
    try {
      const userData = localStorage.getItem('auralearn_user');
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id?.toString();
      }
    } catch (e) {
      console.warn('Could not get user ID for localStorage key');
    }
  }
  
  return userId ? `${baseKey}_${userId}` : baseKey;
}

/**
 * Get user-specific data from localStorage
 */
export function getUserSpecificData<T>(baseKey: string, userId?: string | number): T | null {
  const key = getUserSpecificKey(baseKey, userId);
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn(`Could not parse localStorage data for key: ${key}`);
    return null;
  }
}

/**
 * Set user-specific data in localStorage
 */
export function setUserSpecificData<T>(baseKey: string, data: T, userId?: string | number): void {
  const key = getUserSpecificKey(baseKey, userId);
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not save localStorage data for key: ${key}`);
  }
}

/**
 * Remove user-specific data from localStorage
 */
export function removeUserSpecificData(baseKey: string, userId?: string | number): void {
  const key = getUserSpecificKey(baseKey, userId);
  localStorage.removeItem(key);
}

/**
 * Clean up all user-specific data for a given user
 */
export function cleanupUserData(userId: string | number): void {
  const userIdStr = userId.toString();
  const keysToClean = [
    'userProgress',
    'learningSessions', 
    'learningAnalytics',
    'aurabot_session_global',
    'aurabot_session_activity'
  ];
  
  // Clean up specific user data
  keysToClean.forEach(baseKey => {
    const userSpecificKey = `${baseKey}_${userIdStr}`;
    localStorage.removeItem(userSpecificKey);
  });
  
  // Clean up AuraBot session data (more complex pattern)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith(`aurabot_session_user_${userIdStr}_`) ||
      key.includes(`user_${userIdStr}_activity_`)
    )) {
      localStorage.removeItem(key);
      i--; // Adjust index since we removed an item
    }
  }
}

/**
 * Clean up all non-user-specific data (legacy data that might be shared)
 */
export function cleanupLegacySharedData(): void {
  const legacyKeys = [
    'userProgress',
    'learningSessions',
    'learningAnalytics',
    'aurabot_session_global'
  ];
  
  // Clean up AuraBot activity sessions that don't have user isolation
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      legacyKeys.includes(key) ||
      (key.startsWith('aurabot_session_activity_') && !key.includes('user_'))
    )) {
      localStorage.removeItem(key);
      i--; // Adjust index since we removed an item
    }
  }
}

/**
 * Migrate legacy shared data to user-specific data
 */
export function migrateLegacyDataToUser(userId: string | number): void {
  const userIdStr = userId.toString();
  const legacyKeys = ['userProgress', 'learningSessions', 'learningAnalytics'];
  
  legacyKeys.forEach(baseKey => {
    const legacyData = localStorage.getItem(baseKey);
    if (legacyData) {
      // Move to user-specific key
      const userSpecificKey = `${baseKey}_${userIdStr}`;
      if (!localStorage.getItem(userSpecificKey)) {
        localStorage.setItem(userSpecificKey, legacyData);
      }
      // Remove legacy key
      localStorage.removeItem(baseKey);
    }
  });
}

/**
 * Initialize user data isolation on login
 */
export function initializeUserDataIsolation(userId: string | number): void {
  // Clean up any legacy shared data
  cleanupLegacySharedData();
  
  // Migrate any existing data to this user
  migrateLegacyDataToUser(userId);
}

/**
 * Get current user ID from localStorage
 */
export function getCurrentUserId(): string | null {
  try {
    const userData = localStorage.getItem('auralearn_user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id?.toString() || null;
    }
  } catch (e) {
    console.warn('Could not get current user ID');
  }
  return null;
}
