'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { 
  Award, 
  Trophy, 
  Star, 
  CheckCircle, 
  TrendingUp, 
  BookOpen,
  Zap,
  Target,
  Medal,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getUserAchievements,
  getAchievementStats,
  getCertificateTypeDisplayName,
  getBadgeDisplayName,
  getBadgeColor,
  type Achievement
} from '@/lib/achievements-api';

export default function AchievementsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    total_achievements: 0,
    certificates_earned: 0,
    total_points: 0,
    badges: {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    },
    recent_achievements: [] as Achievement[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      loadAchievements();
    }
  }, [loading, isAuthenticated]);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      
      // Load all achievement data in parallel
      const [achievementsData, statsData] = await Promise.all([
        getUserAchievements().catch(() => ({ achievements: [] })),
        getAchievementStats().catch(() => ({
          total_achievements: 0,
          certificates_earned: 0,
          total_points: 0,
          badges: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
          recent_achievements: []
        }))
      ]);

      setAchievements(achievementsData.achievements || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    redirect('/signin');
  }


  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Achievements</h1>
              <p className="text-purple-100">Track your learning journey and celebrate your success</p>
            </div>
            <div className="hidden md:block">
              <Trophy className="h-24 w-24 text-yellow-300 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Total Achievements</p>
                <p className="text-3xl font-bold text-purple-600">{stats.total_achievements}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Total Points</p>
                <p className="text-3xl font-bold text-[var(--accent-success)]">{stats.total_points}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Zap className="h-6 w-6 text-[var(--accent-success)]" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Total Badges</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.badges.bronze + stats.badges.silver + stats.badges.gold + stats.badges.platinum}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 mb-8 border border-[var(--border)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center">
            <Medal className="h-6 w-6 mr-2 text-purple-600" />
            Badge Collection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.badges).map(([level, count]) => (
              <div 
                key={level}
                className="bg-[var(--surface-hover)] rounded-lg p-4 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${getBadgeColor(level)} flex items-center justify-center shadow-lg`}>
                  <Medal className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{getBadgeDisplayName(level)}</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>



        {/* Recent Achievements - Primary Section */}
        <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 border border-[var(--border)]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto"></div>
              <p className="text-[var(--text-tertiary)] mt-4">Loading achievements...</p>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-[var(--text-disabled)] mx-auto mb-4" />
              <p className="text-[var(--text-tertiary)] text-lg mb-2">No achievements yet</p>
              <p className="text-[var(--text-disabled)] mb-6">Complete activities to earn your first achievement!</p>
              <Link 
                href="/html"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning HTML5
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-[var(--brand-primary-light)] rounded-xl p-6 border-2 border-[var(--brand-primary)]/30 hover:border-[var(--brand-primary)]/60 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getBadgeColor(achievement.badge_level)} flex items-center justify-center shadow-lg`}>
                      {achievement.certificate_type === 'perfect_score' && (
                        <Star className="h-8 w-8 text-white" />
                      )}
                      {achievement.certificate_type === 'first_attempt' && (
                        <Zap className="h-8 w-8 text-white" />
                      )}
                      {achievement.certificate_type === 'excellence' && (
                        <Trophy className="h-8 w-8 text-white" />
                      )}
                      {achievement.certificate_type === 'completion' && (
                        <CheckCircle className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getBadgeColor(achievement.badge_level)} text-white shadow`}>
                      {getBadgeDisplayName(achievement.badge_level)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    {getCertificateTypeDisplayName(achievement.certificate_type)}
                  </h3>
                  
                  {achievement.achievement_data.activity_title && (
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      {achievement.achievement_data.activity_title}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Score:</span>
                      <span className="font-semibold text-purple-600">
                        {achievement.achievement_data.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Attempt:</span>
                      <span className="font-semibold text-blue-600">
                        #{achievement.achievement_data.attempt_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Time:</span>
                      <span className="font-semibold text-[var(--accent-success)]">
                        {achievement.achievement_data.time_spent_minutes} min
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[var(--brand-primary)]/20 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {new Date(achievement.earned_at).toLocaleDateString()}
                      </span>
                      {achievement.is_verified && (
                        <span className="flex items-center text-xs text-[var(--accent-success)] font-medium">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Achievements Section */}
        {stats.recent_achievements.length > 0 && (
          <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 mt-8 border border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-purple-600" />
              Recent Achievements
            </h2>
            <div className="space-y-4">
              {stats.recent_achievements.slice(0, 5).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center justify-between p-4 bg-[var(--brand-primary-light)] rounded-lg border border-[var(--brand-primary)]/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getBadgeColor(achievement.badge_level)} flex items-center justify-center shadow`}>
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {getCertificateTypeDisplayName(achievement.certificate_type)}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {achievement.achievement_data.activity_title || 'Achievement earned'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getBadgeColor(achievement.badge_level)} text-white`}>
                      {getBadgeDisplayName(achievement.badge_level)}
                    </span>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

