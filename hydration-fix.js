// Hydration fix injection point
// This file is injected early by webpack to suppress hydration warnings

if (typeof window !== 'undefined') {
  // Store original console methods immediately
  const originalConsole = {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    log: console.log.bind(console)
  };

  // Comprehensive message suppression check
  function shouldSuppress(message) {
    if (typeof message !== 'string') return false;
    
    const suppressPatterns = [
      'hydrated but some attributes',
      'abId',
      'server rendered HTML didn\'t match',
      'react-hydration-error',
      'hydration-mismatch',
      'This won\'t be patched up',
      'SSR-ed Client Component',
      'A tree hydrated but',
      'Warning: Text content did not match',
      'Warning: Expected server HTML',
      'Hydration failed because the initial UI',
      'There was an error while hydrating',
      'server/client branch'
    ];
    
    return suppressPatterns.some(pattern => message.includes(pattern));
  }

  // Override console methods
  console.error = function(...args) {
    if (!shouldSuppress(args[0])) {
      originalConsole.error(...args);
    }
  };

  console.warn = function(...args) {
    if (!shouldSuppress(args[0])) {
      originalConsole.warn(...args);
    }
  };

  console.log = function(...args) {
    if (!shouldSuppress(args[0])) {
      originalConsole.log(...args);
    }
  };

  // Store reference for cleanup
  window.__hydrationFix = {
    restore() {
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.log = originalConsole.log;
    }
  };
}
