import { useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface UseApiCacheOptions {
  defaultTTL?: number; // Default time to live in milliseconds
  prefix?: string; // Cache key prefix
}

/**
 * Custom hook for caching API responses in localStorage with TTL support
 */
export function useApiCache<T = any>(options: UseApiCacheOptions = {}) {
  const { defaultTTL = 5 * 60 * 1000, prefix = 'api_cache' } = options; // Default 5 minutes
  const memoryCache = useRef<Map<string, CacheEntry<T>>>(new Map());

  /**
   * Generate cache key
   */
  const getCacheKey = useCallback((key: string) => {
    return `${prefix}:${key}`;
  }, [prefix]);

  /**
   * Get data from cache (memory first, then localStorage)
   */
  const get = useCallback((key: string): T | null => {
    const cacheKey = getCacheKey(key);
    
    // Check memory cache first
    const memoryEntry = memoryCache.current.get(cacheKey);
    if (memoryEntry && Date.now() < memoryEntry.timestamp + memoryEntry.ttl) {
      return memoryEntry.data;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        
        // Check if still valid
        if (Date.now() < entry.timestamp + entry.ttl) {
          // Store in memory cache for faster access
          memoryCache.current.set(cacheKey, entry);
          return entry.data;
        } else {
          // Expired, remove it
          localStorage.removeItem(cacheKey);
          memoryCache.current.delete(cacheKey);
        }
      }
    } catch (error) {
      console.warn('Failed to read from cache:', error);
    }

    return null;
  }, [getCacheKey]);

  /**
   * Set data in cache
   */
  const set = useCallback((key: string, data: T, ttl: number = defaultTTL) => {
    const cacheKey = getCacheKey(key);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    // Store in memory cache
    memoryCache.current.set(cacheKey, entry);

    // Store in localStorage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to write to cache:', error);
      // If localStorage is full, clear old cache entries
      clearExpired();
    }
  }, [getCacheKey, defaultTTL]);

  /**
   * Clear specific cache entry
   */
  const clear = useCallback((key: string) => {
    const cacheKey = getCacheKey(key);
    memoryCache.current.delete(cacheKey);
    localStorage.removeItem(cacheKey);
  }, [getCacheKey]);

  /**
   * Clear all cache entries with the current prefix
   */
  const clearAll = useCallback(() => {
    // Clear memory cache
    memoryCache.current.clear();

    // Clear localStorage entries
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix + ':')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, [prefix]);

  /**
   * Clear expired cache entries
   */
  const clearExpired = useCallback(() => {
    const now = Date.now();
    const keysToRemove: string[] = [];

    // Clear from memory cache
    memoryCache.current.forEach((entry, key) => {
      if (now >= entry.timestamp + entry.ttl) {
        memoryCache.current.delete(key);
      }
    });

    // Clear from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix + ':')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<any> = JSON.parse(stored);
            if (now >= entry.timestamp + entry.ttl) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // Invalid entry, remove it
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, [prefix]);

  /**
   * Cached API call wrapper
   */
  const cachedFetch = useCallback(async <R = T>(
    key: string,
    fetcher: () => Promise<R>,
    ttl: number = defaultTTL
  ): Promise<R> => {
    // Check cache first
    const cached = get(key);
    if (cached !== null) {
      return cached as R;
    }

    // Fetch from API
    try {
      const data = await fetcher();
      set(key, data as any, ttl);
      return data;
    } catch (error) {
      // On error, check if we have stale cache data
      const cacheKey = getCacheKey(key);
      try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          const entry: CacheEntry<R> = JSON.parse(stored);
          // Return stale data if available
          console.warn('Returning stale cache data due to fetch error');
          return entry.data;
        }
      } catch {}
      
      throw error;
    }
  }, [get, set, getCacheKey, defaultTTL]);

  /**
   * Invalidate cache entries matching a pattern
   */
  const invalidatePattern = useCallback((pattern: string | RegExp) => {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToRemove: string[] = [];

    // Clear from memory cache
    memoryCache.current.forEach((_, key) => {
      if (regex.test(key)) {
        memoryCache.current.delete(key);
      }
    });

    // Clear from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix + ':') && regex.test(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, [prefix]);

  return {
    get,
    set,
    clear,
    clearAll,
    clearExpired,
    cachedFetch,
    invalidatePattern
  };
}

/**
 * Non-hook cache implementation for use outside React components
 */
class ApiCache<T = any> {
  private prefix: string;
  private defaultTTL: number;
  private memoryCache: Map<string, CacheEntry<T>> = new Map();

  constructor(prefix: string, defaultTTL: number = 5 * 60 * 1000) {
    this.prefix = prefix;
    this.defaultTTL = defaultTTL;
  }

  private getCacheKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  get(key: string): T | null {
    const cacheKey = this.getCacheKey(key);
    
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(cacheKey);
    if (memoryEntry && Date.now() < memoryEntry.timestamp + memoryEntry.ttl) {
      return memoryEntry.data;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        
        // Check if still valid
        if (Date.now() < entry.timestamp + entry.ttl) {
          // Store in memory cache for faster access
          this.memoryCache.set(cacheKey, entry);
          return entry.data;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    return null;
  }

  set(key: string, data: T, ttl?: number): void {
    const cacheKey = this.getCacheKey(key);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL
    };

    // Store in memory
    this.memoryCache.set(cacheKey, entry);

    // Store in localStorage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('Cache write error:', error);
      // If localStorage is full, clear expired entries and try again
      if (error instanceof DOMException && error.code === 22) {
        this.clearExpired();
        try {
          localStorage.setItem(cacheKey, JSON.stringify(entry));
        } catch {}
      }
    }
  }

  clear(key: string): void {
    const cacheKey = this.getCacheKey(key);
    this.memoryCache.delete(cacheKey);
    localStorage.removeItem(cacheKey);
  }

  clearAll(): void {
    // Clear memory cache
    this.memoryCache.clear();

    // Clear localStorage entries with this prefix
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix + ':')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  clearExpired(): void {
    // Clear expired entries from memory
    const now = Date.now();
    this.memoryCache.forEach((entry, key) => {
      if (now >= entry.timestamp + entry.ttl) {
        this.memoryCache.delete(key);
      }
    });

    // Clear expired entries from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix + ':')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<T> = JSON.parse(stored);
            if (now >= entry.timestamp + entry.ttl) {
              keysToRemove.push(key);
            }
          }
        } catch {}
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  async cachedFetch<R = T>(
    key: string,
    fetcher: () => Promise<R>,
    ttl?: number
  ): Promise<R> {
    // Check cache first
    const cached = this.get(key) as R;
    if (cached !== null) {
      return cached;
    }

    try {
      // Fetch fresh data
      const data = await fetcher();
      
      // Cache the result
      this.set(key, data as any, ttl);
      
      return data;
    } catch (error) {
      // On error, check if we have stale cache data
      const cacheKey = this.getCacheKey(key);
      try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          const entry: CacheEntry<R> = JSON.parse(stored);
          // Return stale data if available
          console.warn('Returning stale cache data due to fetch error');
          return entry.data;
        }
      } catch {}
      
      throw error;
    }
  }

  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToRemove: string[] = [];

    // Clear from memory cache
    this.memoryCache.forEach((_, key) => {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    });

    // Clear from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix + ':') && regex.test(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

/**
 * Create global cache instances for API responses
 * These are plain objects, not hooks, so they can be used anywhere
 */
export const apiCache = {
  activity: new ApiCache('api_activity', 5 * 60 * 1000), // 5 minutes
  progress: new ApiCache('api_progress', 5 * 60 * 1000), // 5 minutes
  course: new ApiCache('api_course', 10 * 60 * 1000), // 10 minutes
  achievements: new ApiCache('api_achievements', 5 * 60 * 1000) // 5 minutes
};
