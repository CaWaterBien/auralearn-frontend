"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a hydration error
    if (error.message.includes('hydration') || 
        error.message.includes('server rendered HTML') ||
        error.message.includes('abId')) {
      console.warn('Hydration error caught and handled:', error.message);
      // Don't render the error boundary UI for hydration errors
      return { hasError: false };
    }
    
    // For other errors, show the error boundary
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Only log non-hydration errors
    if (!error.message.includes('hydration') && 
        !error.message.includes('server rendered HTML') &&
        !error.message.includes('abId')) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Only show error UI for non-hydration errors
      if (!this.state.error.message.includes('hydration') && 
          !this.state.error.message.includes('server rendered HTML') &&
          !this.state.error.message.includes('abId')) {
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
              <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-4">
                An error occurred while loading this page. Please try refreshing.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        );
      }
    }

    return this.props.children;
  }
}

export default HydrationErrorBoundary;
