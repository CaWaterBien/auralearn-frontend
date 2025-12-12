"use client";

import { useEffect, useState } from 'react';

interface SecureIframeProps {
  srcDoc: string;
  className?: string;
  title?: string;
  onLoad?: () => void;
}

// HTML sanitization and enhancement function
const sanitizeHTML = (html: string): string => {
  // Allow basic HTML structure and common elements
  // This is a simplified sanitizer - in production you might want to use DOMPurify
  
  // Remove potentially dangerous elements and attributes
  let sanitized = html
    // Remove script tags that might contain malicious code (but preserve inline scripts for demos)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (match) => {
      // Only allow scripts that look like educational content
      if (match.includes('getElementById') || match.includes('addEventListener') || match.includes('querySelector')) {
        return match;
      }
      return '<!-- Script removed for security -->';
    })
    // Remove potentially dangerous attributes
    .replace(/\s(on\w+)=["'][^"']*["']/gi, (match) => {
      // Allow common safe event handlers for demos
      if (match.includes('onclick') || match.includes('onload') || match.includes('onchange')) {
        return match;
      }
      return '';
    })
    // Remove iframe and object tags to prevent nesting
    .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '<!-- Nested frame removed -->')
    // Remove meta refresh redirects
    .replace(/<meta[^>]*http-equiv=["']refresh["'][^>]*>/gi, '<!-- Meta refresh removed -->');

  // Add base element to prevent navigation outside iframe and enable proper anchor scrolling
  if (sanitized.includes('<head>')) {
    sanitized = sanitized.replace('<head>', `<head>
    <base href="about:blank" target="_self">
    <script>
      // Prevent parent navigation and handle anchor scrolling within iframe
      document.addEventListener('DOMContentLoaded', function() {
        // Handle all anchor link clicks
        document.addEventListener('click', function(e) {
          const target = e.target.closest('a[href^="#"]');
          if (target) {
            e.preventDefault();
            const hash = target.getAttribute('href').substring(1);
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Update the hash without affecting parent
              if (history.replaceState) {
                history.replaceState(null, null, '#' + hash);
              }
            }
          }
        });
        
        // Handle hash changes within the iframe
        window.addEventListener('hashchange', function(e) {
          e.preventDefault();
          const hash = window.location.hash.substring(1);
          if (hash) {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    </script>`);
  }

  return sanitized;
};

export default function SecureIframe({ srcDoc, className = '', title = 'Preview', onLoad }: SecureIframeProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Sanitize the content before rendering
    const sanitized = sanitizeHTML(srcDoc);
    setSanitizedContent(sanitized);
  }, [srcDoc]);

  // Don't render on server to avoid hydration issues
  if (!isClient) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-50 text-gray-500`}>
        <div className="text-center">
          <div className="animate-pulse">Loading preview...</div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={sanitizedContent}
      className={`${className} border-none`}
      title={title}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={onLoad}
      style={{
        colorScheme: 'light',
      }}
      // Add additional security attributes
      allow="accelerometer 'none'; camera 'none'; geolocation 'none'; microphone 'none'; payment 'none'"
    />
  );
}
