'use client';

import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Zap, 
  Target, 
  TrendingUp,
  Users,
  Star,
  ArrowUp,
  ArrowDown,
  Award,
  ArrowLeft,
  Filter
} from 'lucide-react';
import Link from 'next/link';

// Mock leaderboard data
const leaderboardData = [
  {
    id: 1,
    rank: 1,
    name: 'Alexandra Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6967e2b?w=150&h=150&fit=crop&crop=face',
    points: 15840,
    coursesCompleted: 24,
    streak: 47,
    badges: 18,
    weeklyIncrease: 450,
    level: 'Expert',
    title: 'HTML/CSS Master'
  },
  {
    id: 2,
    rank: 2,
    name: 'David Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    points: 14650,
    coursesCompleted: 22,
    streak: 35,
    badges: 16,
    weeklyIncrease: 320,
    level: 'Expert',
    title: 'Frontend Developer'
  },
  {
    id: 3,
    rank: 3,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    points: 13920,
    coursesCompleted: 20,
    streak: 28,
    badges: 15,
    weeklyIncrease: 280,
    level: 'Advanced',
    title: 'Web Designer'
  },
  {
    id: 4,
    rank: 4,
    name: 'Michael Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    points: 12750,
    coursesCompleted: 18,
    streak: 22,
    badges: 13,
    weeklyIncrease: 195,
    level: 'Advanced',
    title: 'JavaScript Enthusiast'
  },
  {
    id: 5,
    rank: 5,
    name: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    points: 11840,
    coursesCompleted: 16,
    streak: 19,
    badges: 12,
    weeklyIncrease: 156,
    level: 'Intermediate',
    title: 'CSS Specialist'
  },
  {
    id: 6,
    rank: 6,
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    points: 10920,
    coursesCompleted: 15,
    streak: 16,
    badges: 11,
    weeklyIncrease: 134,
    level: 'Intermediate',
    title: 'HTML Developer'
  },
  {
    id: 7,
    rank: 7,
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    points: 9750,
    coursesCompleted: 13,
    streak: 14,
    badges: 9,
    weeklyIncrease: 89,
    level: 'Intermediate',
    title: 'Responsive Designer'
  },
  {
    id: 8,
    rank: 8,
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6967e2b?w=150&h=150&fit=crop&crop=face',
    points: 4200,
    coursesCompleted: 12,
    streak: 25,
    badges: 5,
    weeklyIncrease: 180,
    level: 'Intermediate',
    title: 'JavaScript Ninja'
  }
];

export default function LeaderboardsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overall');
  const [timeFilter, setTimeFilter] = useState('alltime');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    redirect('/signin');
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Trophy className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Advanced':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'Intermediate':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  // Find current user in leaderboard
  const currentUserRank = leaderboardData.find(u => u.name === user.fullName) || {
    rank: user.progress.rank,
    points: user.progress.totalPoints,
    coursesCompleted: user.progress.completedCourses,
    streak: user.progress.streak,
    badges: user.progress.badges.length,
    weeklyIncrease: 45,
    level: 'Beginner',
    title: 'Learning Journey'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href="/dashboard"
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <Trophy className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">🏆 Leaderboards</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              See how you rank among our learning community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Your Rank Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your Current Ranking</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">#{currentUserRank.rank}</div>
                <div className="text-purple-100 text-sm">Global Rank</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{currentUserRank.points.toLocaleString()}</div>
                <div className="text-purple-100 text-sm">Total Points</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{currentUserRank.streak}</div>
                <div className="text-purple-100 text-sm">Day Streak</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{currentUserRank.badges}</div>
                <div className="text-purple-100 text-sm">Badges Earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overall')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'overall'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overall
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'weekly'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveTab('rising')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'rising'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rising Stars
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="alltime">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top 3 Podium */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 border-b">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">🏆 Top Performers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaderboardData.slice(0, 3).map((user, index) => (
                <div key={user.id} className={`text-center ${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
                  <div className={`relative mx-auto mb-4 ${index === 0 ? 'w-24 h-24' : 'w-20 h-20'}`}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                    }`}>
                      {getRankIcon(user.rank)}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{user.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{user.title}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                    {user.level}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-gray-900">{user.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Rankings */}
          <div className="p-6">
            <div className="space-y-4">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all hover:shadow-md ${
                    entry.name === user.fullName ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 truncate">{entry.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(entry.level)}`}>
                        {entry.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.title}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{entry.points.toLocaleString()}</div>
                      <div className="text-gray-500">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{entry.coursesCompleted}</div>
                      <div className="text-gray-500">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{entry.streak}</div>
                      <div className="text-gray-500">Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{entry.badges}</div>
                      <div className="text-gray-500">Badges</div>
                    </div>
                  </div>

                  {/* Weekly Change */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center space-x-1 text-sm">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">+{entry.weeklyIncrease}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Learners</h3>
                <p className="text-2xl font-bold text-blue-600">12,847</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Community members learning this week</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Courses Completed</h3>
                <p className="text-2xl font-bold text-green-600">234,521</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Total courses completed by all users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Badges Earned</h3>
                <p className="text-2xl font-bold text-purple-600">45,692</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Total badges earned by the community</p>
          </div>
        </div>
      </div>
    </div>
  );
} 