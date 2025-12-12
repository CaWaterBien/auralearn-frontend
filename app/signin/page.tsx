'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignInForm from '@/components/auth/signin-form';
import SignUpForm from '@/components/auth/signup-form';
import Link from 'next/link';
import { ArrowLeft, Code, Globe, Palette, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SignInPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const slides = [
    {
      title: "Welcome to AuraLearn",
      description: "Master HTML5 fundamentals with interactive tutorials and real-world projects. Build amazing websites from scratch.",
      icon: <Code className="h-12 w-12 text-white/80" />,
      gradient: "from-purple-600 via-pink-500 to-orange-400"
    },
    {
      title: "Learn HTML5",
      description: "Create modern, semantic web pages with our comprehensive HTML5 course, from basics to advanced techniques.",
      icon: <Code className="h-12 w-12 text-white/80" />,
      gradient: "from-blue-600 via-purple-500 to-pink-400"
    },
    {
      title: "Build Real Projects",
      description: "Apply your skills with hands-on projects. Create portfolios, landing pages, and interactive web applications.",
      icon: <Globe className="h-12 w-12 text-white/80" />,
      gradient: "from-green-600 via-blue-500 to-purple-400"
    },
    {
      title: "Fast Track Learning",
      description: "Accelerate your HTML5 journey with AI-powered assistance and personalized learning paths.",
      icon: <Zap className="h-12 w-12 text-white/80" />,
      gradient: "from-orange-600 via-red-500 to-pink-400"
    }
  ];

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render signin form if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Animated Slides */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex items-center justify-center transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
            <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
            
            {/* Geometric Shapes */}
            <div className="absolute top-16 right-20 w-8 h-8 bg-white/20 rotate-45 rounded-sm"></div>
            <div className="absolute bottom-40 left-16 w-12 h-1 bg-white/30 rounded-full rotate-45"></div>
            <div className="absolute top-1/3 right-16 w-6 h-6 bg-white/25 rounded-full"></div>
            <div className="absolute bottom-16 right-1/3 w-10 h-1 bg-white/30 rounded-full rotate-12"></div>

            {/* Content */}
            <div className="relative z-10 max-w-md mx-auto px-8 text-center text-white">
              <div className="flex justify-center mb-6">
                {slide.icon}
              </div>
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Footer Attribution */}
        <div className="absolute bottom-4 right-4 text-white/60 text-xs z-20">
          designed by AuraLearn
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[var(--background)] relative">
        {/* Back to Home Link */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to AuraLearn</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md px-6 py-8">
          {isSignUp ? (
            <SignUpForm onToggleForm={toggleForm} />
          ) : (
            <SignInForm onToggleForm={toggleForm} />
          )}
        </div>

        {/* Mobile Background for smaller screens */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 opacity-5 pointer-events-none"></div>
      </div>
    </div>
  );
} 