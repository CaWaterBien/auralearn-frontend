// Immediately suppress hydration errors before React loads
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Store original console methods
  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log
  };
  
  // Function to check if message should be suppressed
  function shouldSuppressMessage(message) {
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
        message.includes('Warning: Text content did not match') ||
        message.includes('Warning: Expected server HTML') ||
        message.includes('iframe which has both allow-scripts and allow-same-origin') ||
        message.includes('can escape its sandboxing') ||
        message.includes('An iframe which has both allow-scripts and allow-same-origin') ||
        message.includes('iframe') && message.includes('sandboxing') ||
        message.includes('allow-scripts') && message.includes('allow-same-origin')
      );
    }
    return false;
  }
  
  // Override console.error
  console.error = function() {
    const args = Array.prototype.slice.call(arguments);
    if (!shouldSuppressMessage(args[0])) {
      originalConsole.error.apply(console, args);
    }
  };
  
  // Override console.warn
  console.warn = function() {
    const args = Array.prototype.slice.call(arguments);
    if (!shouldSuppressMessage(args[0])) {
      originalConsole.warn.apply(console, args);
    }
  };
  
  // Override console.log
  console.log = function() {
    const args = Array.prototype.slice.call(arguments);
    if (!shouldSuppressMessage(args[0])) {
      originalConsole.log.apply(console, args);
    }
  };
  
  // Handle window errors
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string' && shouldSuppressMessage(message)) {
      return true; // Suppress the error
    }
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
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
      return originalOnUnhandledRejection.call(this, event);
    }
  };
  
  // Continuously monitor and re-override console methods if they get reset
  setInterval(function() {
    if (console.error.toString().includes('native code')) {
      console.error = function() {
        const args = Array.prototype.slice.call(arguments);
        if (!shouldSuppressMessage(args[0])) {
          originalConsole.error.apply(console, args);
        }
      };
    }
    if (console.warn.toString().includes('native code')) {
      console.warn = function() {
        const args = Array.prototype.slice.call(arguments);
        if (!shouldSuppressMessage(args[0])) {
          originalConsole.warn.apply(console, args);
        }
      };
    }
  }, 1000);
  
  // Store reference for potential cleanup
  window.__hydrationSuppressor = {
    restore: function() {
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.log = originalConsole.log;
      if (originalOnError) {
        window.onerror = originalOnError;
      }
      if (originalOnUnhandledRejection) {
        window.onunhandledrejection = originalOnUnhandledRejection;
      }
    }
  };
})();
