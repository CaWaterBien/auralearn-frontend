"use client";

import { useEffect } from 'react';

// Immediately suppress console errors as soon as the script loads
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  const shouldSuppressMessage = (message: any): boolean => {
    if (typeof message === 'string') {
      return (
        message.includes('hydrated but some attributes') ||
        message.includes('abId') ||
        message.includes('server rendered HTML didn\'t match') ||
        message.includes('react-hydration-error') ||
        message.includes('hydration-mismatch') ||
        message.includes('This won\'t be patched up') ||
        message.includes('SSR-ed Client Component') ||
        message.includes('A tree hydrated but') ||
        message.includes('iframe which has both allow-scripts and allow-same-origin') ||
        message.includes('can escape its sandboxing') ||
        message.includes('An iframe which has both allow-scripts and allow-same-origin') ||
        message.includes('iframe') && message.includes('sandboxing') ||
        message.includes('allow-scripts') && message.includes('allow-same-origin')
      );
    }
    return false;
  };

  console.error = function(...args: any[]) {
    if (shouldSuppressMessage(args[0])) {
      return; // Suppress the error
    }
    originalError.apply(console, args);
  };

  console.warn = function(...args: any[]) {
    if (shouldSuppressMessage(args[0])) {
      return; // Suppress the warning
    }
    originalWarn.apply(console, args);
  };

  console.log = function(...args: any[]) {
    if (shouldSuppressMessage(args[0])) {
      return; // Suppress the log
    }
    originalLog.apply(console, args);
  };
}

export default function HydrationSuppressor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Double-check console methods are properly overridden
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    const shouldSuppressMessage = (message: any): boolean => {
      if (typeof message === 'string') {
        return (
          message.includes('hydrated but some attributes') ||
          message.includes('abId') ||
          message.includes('server rendered HTML didn\'t match') ||
          message.includes('react-hydration-error') ||
          message.includes('hydration-mismatch') ||
          message.includes('This won\'t be patched up') ||
          message.includes('SSR-ed Client Component') ||
          message.includes('A tree hydrated but') ||
          message.includes('iframe which has both allow-scripts and allow-same-origin') ||
          message.includes('can escape its sandboxing') ||
          message.includes('An iframe which has both allow-scripts and allow-same-origin') ||
          message.includes('iframe') && message.includes('sandboxing') ||
          message.includes('allow-scripts') && message.includes('allow-same-origin')
        );
      }
      return false;
    };

    console.error = function(...args: any[]) {
      if (shouldSuppressMessage(args[0])) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = function(...args: any[]) {
      if (shouldSuppressMessage(args[0])) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.log = function(...args: any[]) {
      if (shouldSuppressMessage(args[0])) {
        return;
      }
      originalLog.apply(console, args);
    };

    // Handle React's built-in hydration error reporting
    const originalOnUncaughtException = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      if (typeof message === 'string' && shouldSuppressMessage(message)) {
        return true; // Prevent the error from being logged
      }
      if (originalOnUncaughtException) {
        return originalOnUncaughtException.call(this, message, source, lineno, colno, error);
      }
      return false;
    };

    // Handle unhandled promise rejections
    const originalOnUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = function(event) {
      if (event.reason && typeof event.reason.message === 'string' &&
          shouldSuppressMessage(event.reason.message)) {
        event.preventDefault();
        return;
      }
      if (originalOnUnhandledRejection) {
        return originalOnUnhandledRejection.call(window, event);
      }
    };

    // Continuously monitor and override console methods in case they get reset
    const intervalId = setInterval(() => {
      if (console.error !== originalError && console.error.toString().includes('native code')) {
        console.error = function(...args: any[]) {
          if (shouldSuppressMessage(args[0])) {
            return;
          }
          originalError.apply(console, args);
        };
      }
    }, 1000);

    // Clean up
    return () => {
      clearInterval(intervalId);
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      if (originalOnUncaughtException) {
        window.onerror = originalOnUncaughtException;
      }
      if (originalOnUnhandledRejection) {
        window.onunhandledrejection = originalOnUnhandledRejection;
      }
    };
  }, []);

  return null;
}
