'use client';

import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown,
  BookOpen,
  User,
  Settings,
  Shield,
  Zap,
  MessageCircle,
  Mail,
  Phone,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  Play,
  FileText,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

// Enhanced FAQ Data with more details
const faqData = {
  'Getting Started': {
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    questions: [
      {
        id: 1,
        question: 'How do I create an account on AuraLearn?',
        answer: 'Creating an account is simple! Click the "Sign In" button in the top right corner, then select "Sign up here" below the login form. Fill in your full name, email, and create a secure password. You can also use our demo accounts for testing: john@example.com, jane@example.com, or demo@auralearn.com (password can be anything).',
        tags: ['account', 'registration', 'getting started'],
        helpful: 0,
        views: 1234
      },
      {
        id: 2,
        question: 'What courses are available on AuraLearn?',
        answer: 'AuraLearn offers comprehensive courses in HTML, CSS, JavaScript, and web development. We provide interactive tutorials, hands-on projects, and real-world examples. Each course is designed to take you from beginner to advanced level with practical skills you can apply immediately.',
        tags: ['courses', 'content', 'curriculum'],
        helpful: 0,
        views: 987
      },
      {
        id: 3,
        question: 'Is AuraLearn completely free?',
        answer: 'AuraLearn offers both free and premium content. Basic HTML and CSS courses are completely free, including exercises and basic certificates. Premium features include advanced JavaScript courses, personalized learning paths, priority support, and enhanced certificates.',
        tags: ['pricing', 'free', 'premium'],
        helpful: 0,
        views: 856
      },
      {
        id: 4,
        question: 'How do I start my first lesson?',
        answer: 'After signing in, visit your Dashboard to see your recommended courses. Click on "HTML Fundamentals" or any course that interests you. Each course starts with an introduction and progressively builds your knowledge through interactive lessons and exercises.',
        tags: ['lessons', 'getting started', 'tutorial'],
        helpful: 0,
        views: 745
      }
    ]
  },
  'Learning & Progress': {
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    questions: [
      {
        id: 5,
        question: 'How does the learning streak work?',
        answer: 'Your learning streak tracks consecutive days of learning activity. Complete at least one lesson or exercise per day to maintain your streak. Streaks help build consistent learning habits and unlock special badges as you reach milestones like 7, 30, or 100 days.',
        tags: ['streak', 'progress', 'habits'],
        helpful: 0,
        views: 654
      },
      {
        id: 6,
        question: 'What are badges and how do I earn them?',
        answer: 'Badges are achievements that recognize your learning milestones. You can earn badges by completing courses (HTML Master), maintaining streaks (30-Day Streak), completing projects (Project Builder), and demonstrating expertise (Quick Learner). Check your profile to see all available badges.',
        tags: ['badges', 'achievements', 'rewards'],
        helpful: 0,
        views: 543
      },
      {
        id: 7,
        question: 'How is my rank calculated?',
        answer: 'Your rank is based on multiple factors including total points earned, courses completed, streak length, and community participation. Points are awarded for completing lessons, exercises, projects, and helping other learners. The ranking system encourages consistent learning and engagement.',
        tags: ['ranking', 'leaderboard', 'points'],
        helpful: 0,
        views: 432
      },
      {
        id: 8,
        question: 'Can I track my learning progress?',
        answer: 'Yes! Your Dashboard provides a comprehensive overview of your progress including completed courses, current streak, total points, and recent lessons. You can also view detailed analytics showing your learning patterns and achievements over time.',
        tags: ['progress', 'dashboard', 'tracking'],
        helpful: 0,
        views: 321
      }
    ]
  },
  'Account & Settings': {
    icon: User,
    color: 'from-purple-500 to-pink-500',
    questions: [
      {
        id: 9,
        question: 'How do I change my profile information?',
        answer: 'Go to your profile dropdown (click your avatar) and select "Edit Profile". Here you can update your name, email, avatar, and preferences. You can also change your password and manage notification settings.',
        tags: ['profile', 'settings', 'account'],
        helpful: 0,
        views: 789
      },
      {
        id: 10,
        question: 'How do I reset my password?',
        answer: 'On the sign-in page, click "Forgot password?" below the password field. Enter your email address and we\'ll send you a secure link to reset your password. For demo accounts, you can use any password to sign in.',
        tags: ['password', 'security', 'reset'],
        helpful: 0,
        views: 567
      },
      {
        id: 11,
        question: 'Can I change my email notifications?',
        answer: 'Yes, you can customize all email notifications in your Settings page. Navigate to Settings > Notifications to control learning progress updates, weekly digests, achievement alerts, and learning reminders according to your preferences.',
        tags: ['notifications', 'email', 'preferences'],
        helpful: 0,
        views: 445
      },
      {
        id: 12,
        question: 'How do I delete my account?',
        answer: 'To delete your account, go to Profile > Edit Profile and scroll to the "Danger Zone" section. Click "Delete Account" and confirm your decision. Please note that this action cannot be undone and all your progress will be lost.',
        tags: ['delete', 'account', 'data'],
        helpful: 0,
        views: 234
      }
    ]
  },
  'Technical Support': {
    icon: Settings,
    color: 'from-green-500 to-teal-500',
    questions: [
      {
        id: 13,
        question: 'The website is loading slowly. What should I do?',
        answer: 'Slow loading can be caused by internet connection issues or browser problems. Try refreshing the page, clearing your browser cache, or switching to a different browser. If problems persist, check your internet connection or contact our support team.',
        tags: ['performance', 'loading', 'troubleshooting'],
        helpful: 0,
        views: 876
      },
      {
        id: 14,
        question: 'I can\'t see my progress after completing a lesson.',
        answer: 'Progress should update automatically. If you don\'t see updates, try refreshing the page or logging out and back in. Make sure you have a stable internet connection during lessons. If issues persist, contact support with details about the specific lesson.',
        tags: ['progress', 'bug', 'technical'],
        helpful: 0,
        views: 654
      },
      {
        id: 15,
        question: 'The code editor is not working properly.',
        answer: 'Code editor issues can be browser-related. Try using a modern browser like Chrome, Firefox, or Safari. Disable ad blockers or browser extensions that might interfere. Clear your browser cache and ensure JavaScript is enabled.',
        tags: ['editor', 'code', 'browser'],
        helpful: 0,
        views: 543
      },
      {
        id: 16,
        question: 'Can I use AuraLearn on mobile devices?',
        answer: 'Yes! AuraLearn is fully responsive and works on tablets and smartphones. While coding exercises are optimized for desktop use, you can read lessons, watch videos, and track your progress on any device.',
        tags: ['mobile', 'responsive', 'devices'],
        helpful: 0,
        views: 432
      }
    ]
  },
  'Certificates & Achievements': {
    icon: Award,
    color: 'from-indigo-500 to-purple-500',
    questions: [
      {
        id: 17,
        question: 'How do I earn certificates?',
        answer: 'Certificates are earned by completing entire courses with a passing grade. You must complete all lessons, exercises, and projects within a course. Once earned, certificates can be downloaded as PDF files or shared on professional networks like LinkedIn.',
        tags: ['certificates', 'completion', 'download'],
        helpful: 0,
        views: 765
      },
      {
        id: 18,
        question: 'Are AuraLearn certificates recognized by employers?',
        answer: 'AuraLearn certificates demonstrate your commitment to learning and practical skills acquired. While not accredited by traditional institutions, they showcase your knowledge in web development technologies and can be valuable additions to your portfolio and resume.',
        tags: ['certificates', 'employment', 'recognition'],
        helpful: 0,
        views: 654
      },
      {
        id: 19,
        question: 'Can I retake courses to improve my certificate grade?',
        answer: 'Yes, you can retake any course to improve your understanding and certificate grade. Your highest score will be recorded. This allows you to reinforce your learning and achieve better results.',
        tags: ['retake', 'grades', 'improvement'],
        helpful: 0,
        views: 321
      },
      {
        id: 20,
        question: 'How do I share my certificates?',
        answer: 'Once you earn a certificate, you can download it as a PDF from your profile. You can then share it on LinkedIn, add it to your resume, or include it in your portfolio. Each certificate has a unique verification code for authenticity.',
        tags: ['sharing', 'certificates', 'social'],
        helpful: 0,
        views: 456
      }
    ]
  }
} as const;

export default function FAQPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [helpfulItems, setHelpfulItems] = useState<Record<number, 'yes' | 'no' | null>>({});

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading FAQ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    redirect('/signin');
  }

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleHelpful = (id: number, helpful: 'yes' | 'no') => {
    setHelpfulItems(prev => ({
      ...prev,
      [id]: prev[id] === helpful ? null : helpful
    }));
  };

  // Advanced filtering with search
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return Object.entries(faqData);
    }

    const query = searchQuery.toLowerCase();
    return Object.entries(faqData)
      .map(([category, data]) => {
        const filteredQuestions = data.questions.filter(q =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query) ||
          q.tags.some(tag => tag.toLowerCase().includes(query))
        );
        return [category, { ...data, questions: filteredQuestions }] as const;
      })
      .filter(([, data]) => data.questions.length > 0);
  }, [searchQuery]);

  const totalQuestions = Object.values(faqData).reduce((sum, cat) => sum + cat.questions.length, 0);
  const totalViews = Object.values(faqData).reduce(
    (sum, cat) => sum + cat.questions.reduce((s, q) => s + q.views, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMzZWEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQtMi42ODYtNi02LTZzLTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2IDYtMi42ODYgNi02ek0wIDAgaDYwdjYwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Animated Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl mb-6 animate-bounce">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              Find instant answers to common questions about AuraLearn
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{totalQuestions} Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-pink-500" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Instant Answers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{totalViews.toLocaleString()} Views</span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] h-6 w-6 z-10" />
              <input
                type="text"
                placeholder="Search for answers, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:outline-none focus:ring-4 focus:ring-purple-500/20 text-lg shadow-2xl border-2 border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  <span className="text-sm font-medium">Clear</span>
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-[var(--surface)] rounded-full shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Found {filteredContent.reduce((sum, [, data]) => sum + data.questions.length, 0)} results
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
              <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(faqData).map(([category, data]) => {
                const IconComponent = data.icon;
                const isActive = activeCategory === category;
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(isActive ? null : category)}
                    className={`group relative overflow-hidden bg-[var(--surface)] rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                      isActive ? 'ring-4 ring-purple-500/50 shadow-2xl' : 'shadow-lg'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    
                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${data.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-purple-600 transition-colors">
                        {category}
                      </h3>
                      
                      <p className="text-[var(--text-secondary)] text-sm mb-4">
                        {data.questions.length} helpful articles
                      </p>
                      
                      <div className="flex items-center text-purple-600 font-medium text-sm">
                        <span>Explore topics</span>
                        <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {filteredContent.map(([category, data]) => {
              const shouldShow = !activeCategory || activeCategory === category || searchQuery;
              if (!shouldShow) return null;

              const IconComponent = data.icon;

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${data.color} rounded-xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">{category}</h2>
                      <p className="text-sm text-[var(--text-tertiary)]">{data.questions.length} questions</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {data.questions.map((item) => {
                      const isExpanded = expandedItems.includes(item.id);
                      const helpfulState = helpfulItems[item.id];

                      return (
                        <div
                          key={item.id}
                          className={`bg-[var(--surface)] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                            isExpanded ? 'ring-2 ring-purple-500/50' : 'hover:shadow-xl'
                          }`}
                        >
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="w-full p-6 text-left group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-4">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-purple-600 transition-colors mb-2">
                                  {item.question}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {item.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-all ${
                                  isExpanded ? 'rotate-180 bg-purple-100' : ''
                                }`}>
                                  <ChevronDown className="h-5 w-5 text-purple-600" />
                                </div>
                              </div>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-6 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="border-t border-[var(--border)] pt-4">
                                <p className="text-[var(--text-primary)] leading-relaxed mb-4">
                                  {item.answer}
                                </p>

                                {/* Helpfulness Section */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                  <div className="flex items-center space-x-2">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Was this helpful?</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleHelpful(item.id, 'yes')}
                                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        helpfulState === 'yes'
                                          ? 'bg-green-500 text-white shadow-lg scale-105'
                                          : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-green-50 hover:text-green-600'
                                      }`}
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                      <span>Yes</span>
                                    </button>
                                    <button
                                      onClick={() => handleHelpful(item.id, 'no')}
                                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        helpfulState === 'no'
                                          ? 'bg-red-500 text-white shadow-lg scale-105'
                                          : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600'
                                      }`}
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                      <span>No</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* No Results */}
            {searchQuery && filteredContent.length === 0 && (
              <div className="bg-[var(--surface)] rounded-2xl shadow-xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--surface-hover)] rounded-full mb-6">
                  <Search className="h-10 w-10 text-[var(--text-disabled)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">No results found</h3>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                  We couldn't find any FAQs matching "{searchQuery}". Try different keywords or contact our support team.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Clear Search
                  </button>
                  <a
                    href="mailto:support@auralearn.com"
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Support</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 text-purple-500 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600">Continue Learning</p>
                      <p className="text-xs text-gray-500">Back to courses</p>
                    </div>
                  </Link>

                  <Link
                    href="/profile/edit"
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">Edit Profile</p>
                      <p className="text-xs text-gray-500">Manage account</p>
                    </div>
                  </Link>

                  <Link
                    href="/leaderboards"
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600">Leaderboards</p>
                      <p className="text-xs text-gray-500">View rankings</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Still need help?
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Our support team is here to assist you
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:support@auralearn.com"
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                  >
                    <Mail className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold">Email Support</p>
                      <p className="text-xs text-white/80">support@auralearn.com</p>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold">Live Chat</p>
                      <p className="text-xs text-white/80">Available 24/7</p>
                    </div>
                  </a>

                  <a
                    href="tel:+1234567890"
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                  >
                    <Phone className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold">Call Support</p>
                      <p className="text-xs text-white/80">+1 (234) 567-890</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Popular Articles */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                  Most Viewed
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const allQuestions: Array<{id: number, question: string, answer: string, tags: string[], helpful: number, views: number}> = [];
                    Object.values(faqData).forEach(cat => {
                      cat.questions.forEach(q => {
                        allQuestions.push({...q, tags: q.tags.slice()});
                      });
                    });
                    return allQuestions
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => toggleExpanded(q.id)}
                          className="w-full text-left p-3 rounded-xl hover:bg-purple-50 transition-all group"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 line-clamp-2">
                                {q.question}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{q.views.toLocaleString()} views</p>
                            </div>
                          </div>
                        </button>
                      ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
