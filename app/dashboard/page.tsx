'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { getDashboardStats, type DashboardStats } from '@/lib/dashboard-api';
import { 
  Trophy, 
  Zap, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar, 
  Target,
  Clock,
  Star,
  BarChart3,
  Users,
  CheckCircle,
  PlayCircle,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboardData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoadingData(true);
      }
      
      const data = await getDashboardStats();
      setDashboardData(data);
      setLastUpdated(new Date());
      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load dashboard data on mount
  useEffect(() => {
    if (!loading && isAuthenticated) {
      loadDashboardData();
    }
  }, [loading, isAuthenticated, loadDashboardData]);

  // Auto-refresh every 30 seconds when page is active
  useEffect(() => {
    if (!isAuthenticated) return;

    const autoRefreshInterval = setInterval(() => {
      if (!document.hidden) {
        console.log('🔄 Auto-refreshing dashboard...');
        loadDashboardData(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoRefreshInterval);
  }, [isAuthenticated, loadDashboardData]);

  // Manual refresh handler
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    loadDashboardData(true);
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !dashboardData) {
    if (!isAuthenticated || !user) {
      redirect('/signin');
    }
    return null;
  }

  const progressPercentage = Math.round((dashboardData.completedCourses / dashboardData.totalCourses) * 100);
  const weeklyGoal = 5;
  const weeklyProgress = Math.min(dashboardData.streak, weeklyGoal);

  const stats = [
    {
      label: 'Total Points',
      value: dashboardData.totalPoints.toLocaleString(),
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      change: `+${dashboardData.pointsThisWeek} this week`,
      color: 'yellow'
    },
    {
      label: 'Current Streak',
      value: `${dashboardData.streak} days`,
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      change: 'Keep it up!',
      color: 'orange'
    },
    {
      label: 'Courses Completed',
      value: `${dashboardData.completedCourses}/${dashboardData.totalCourses}`,
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      change: `${progressPercentage}% complete`,
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Welcome back, {user.fullName.split(' ')[0]}! 👋
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Here's your learning progress overview
                {lastUpdated && (
                  <span className="ml-2 text-xs text-[var(--text-tertiary)]">
                    • Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-3 rounded-lg font-semibold hover:bg-[var(--surface-hover)] transition-all duration-200 flex items-center disabled:opacity-50"
                title="Refresh Dashboard"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/html"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center"
              >
                Continue Learning
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section with Enhanced Design */}
        <div className="relative mb-10">
          {/* Background decoration */}
          <div className="" />
          
          {/* Stats Grid - Optimized for 3 cards */}
          <div className="relative px-10 py-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-[var(--surface)] rounded-2xl shadow-sm hover:shadow-lg border border-[var(--border)] p-6 sm:p-8 transition-all duration-300 hover:border-purple-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon with enhanced background */}
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${
                  stat.color === 'yellow' ? 'from-yellow-100 to-yellow-200' :
                  stat.color === 'orange' ? 'from-orange-100 to-orange-200' :
                  'from-blue-100 to-blue-200'
                } group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                
                {/* Content with improved typography */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--text-tertiary)] font-medium">
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Learning Progress</h2>
                <BarChart3 className="h-5 w-5 text-[var(--text-tertiary)]" />
              </div>
              
              {/* Overall Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Overall Course Progress</span>
                  <span className="text-sm font-semibold text-purple-600">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-[var(--surface-hover)] rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Weekly Goal */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Weekly Learning Goal</span>
                  <span className="text-sm font-semibold text-blue-600">{weeklyProgress}/{weeklyGoal} days</span>
                </div>
                <div className="w-full bg-[var(--surface-hover)] rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(weeklyProgress / weeklyGoal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Course */}
              {dashboardData.currentCourse && (
                <div className="bg-[var(--brand-primary-light)] rounded-lg p-4 border border-[var(--brand-primary)]/20">
                  <div className="flex items-center space-x-3">
                    <PlayCircle className="h-8 w-8 text-[var(--brand-primary)]" />
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{dashboardData.currentCourse}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Continue your current lesson</p>
                    </div>
                    <Link
                      href="/html"
                      className="ml-auto bg-[var(--brand-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--brand-primary-hover)] transition-colors"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recent Lessons</h2>
                <Clock className="h-5 w-5 text-[var(--text-tertiary)]" />
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentLessons.length > 0 ? (
                  dashboardData.recentLessons.map((lesson, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-[var(--surface-hover)] rounded-lg">
                      <div className="flex-shrink-0">
                        {lesson.progress === 100 ? (
                          <CheckCircle className="h-8 w-8 text-[var(--accent-success)]" />
                        ) : (
                          <PlayCircle className="h-8 w-8 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[var(--text-primary)] truncate">{lesson.title}</h3>
                        <p className="text-sm text-[var(--text-tertiary)]">Last accessed: {new Date(lesson.lastAccessed).toLocaleDateString()}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex-1 bg-[var(--border)] rounded-full h-2 max-w-xs">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                lesson.progress === 100 ? 'bg-[var(--accent-success)]' : 'bg-blue-500'
                              }`}
                              style={{ width: `${lesson.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-[var(--text-secondary)]">{lesson.progress}%</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href="/html"
                          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] text-sm font-medium"
                        >
                          {lesson.progress === 100 ? 'Review' : 'Continue'}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[var(--text-tertiary)]">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 text-[var(--text-disabled)]" />
                    <p>No recent lessons yet. Start learning now!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Time spent learning</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{dashboardData.timeSpent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Lessons completed</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{dashboardData.lessonsCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Average score</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{dashboardData.averageScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Activities completed</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{dashboardData.projectsCompleted}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Latest Badges</h3>
                <Link href="/achievements" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData.badges.slice(0, 4).map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)] text-sm">{badge}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">Earned recently</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Recommendations */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Keep Learning!</h3>
              <p className="text-sm text-white/90 mb-4">
                You're doing great! Try these recommended topics to expand your skills.
              </p>
              <div className="space-y-2">
              <p className="text-sm text-white/90 mb-4">
                LEARN HTML5 by AuraLearn!
              </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 