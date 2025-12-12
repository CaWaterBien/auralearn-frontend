'use client';

import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  BookOpen, 
  Palette, 
  Globe,
  Volume2,
  Moon,
  Sun,
  Smartphone,
  Database,
  Download,
  Trash2,
  CheckCircle,
  Eye,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { 
  updateUserSettings, 
  getStorageUsage, 
  exportUserData, 
  clearUserData,
  type UserPreferences 
} from '@/lib/user-api';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

export default function SettingsPage() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  const [storageData, setStorageData] = useState({
    usedMB: 0,
    maxMB: 100,
    percentage: 0,
  });
  
  const [settings, setSettings] = useState<Partial<UserPreferences>>({
    // General
    theme: 'light',
    language: 'en',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    achievementAlerts: true,
    reminderAlerts: true,
    
    // Privacy
    profileVisibility: 'public',
    showProgress: true,
    showBadges: true,
    allowMessages: true,
    
    // Learning
    dailyGoal: 30,
    difficultyLevel: 'intermediate',
    autoSave: true,
    skipIntros: false,
    showHints: true,
    
    // Accessibility
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
    soundEffects: true
  });

  // Load user settings on mount
  useEffect(() => {
    if (user?.preferences) {
      setSettings(user.preferences);
    }
  }, [user]);

  // Load storage usage when on data section
  useEffect(() => {
    if (activeSection === 'data' && isAuthenticated) {
      loadStorageUsage();
    }
  }, [activeSection, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[var(--brand-primary)] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    redirect('/signin');
  }

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadStorageUsage = async () => {
    setIsLoadingStorage(true);
    try {
      const data = await getStorageUsage();
      setStorageData({
        usedMB: data.usedMB,
        maxMB: data.maxMB,
        percentage: data.percentage,
      });
    } catch (error) {
      console.error('Failed to load storage usage:', error);
      showNotification('Failed to load storage usage', 'error');
    } finally {
      setIsLoadingStorage(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await updateUserSettings(settings);
      
      // Update user in context
      if (user) {
        await updateUser({
          ...user,
          preferences: response.preferences
        });
      }
      
      showNotification('Settings saved successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      showNotification(error.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await exportUserData();
      
      // Create blob and download
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showNotification('Data exported successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to export data:', error);
      showNotification(error.message || 'Failed to export data', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      const response = await clearUserData(true);
      
      // Update user progress in context
      if (user) {
        await updateUser({
          ...user,
          progress: response.progress
        });
      }
      
      setShowClearModal(false);
      showNotification('All data cleared successfully!', 'success');
      
      // Reload storage usage
      if (activeSection === 'data') {
        await loadStorageUsage();
      }
    } catch (error: any) {
      console.error('Failed to clear data:', error);
      showNotification(error.message || 'Failed to clear data', 'error');
    } finally {
      setIsClearing(false);
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="h-5 w-5" /> },
    { id: 'learning', label: 'Learning', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Eye className="h-5 w-5" /> },
    { id: 'data', label: 'Data & Storage', icon: <Database className="h-5 w-5" /> }
  ];

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          console.log('Toggle clicked:', e.target.checked);
          onChange(e.target.checked);
        }}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 transition-colors duration-200 ease-in-out ${
        checked ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border)]'
      } ${disabled ? 'opacity-50' : ''}`}>
        <div className={`absolute top-0.5 left-0.5 bg-[var(--surface)] rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
          checked ? 'transform translate-x-5' : ''
        }`}></div>
      </div>
    </label>
  );

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-[var(--text-tertiary)]" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Theme</p>
                      <p className="text-sm text-[var(--text-secondary)]">Choose your preferred color scheme</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        console.log('Theme changed to: light');
                        handleSettingChange('theme', 'light');
                      }}
                      className={`p-2 rounded-lg border-2 transition-all cursor-pointer ${
                        settings.theme === 'light' 
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)]' 
                          : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <Sun className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        console.log('Theme changed to: dark');
                        handleSettingChange('theme', 'dark');
                      }}
                      className={`p-2 rounded-lg border-2 transition-all cursor-pointer ${
                        settings.theme === 'dark' 
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)]' 
                          : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <Moon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-[var(--text-tertiary)]" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Language</p>
                      <p className="text-sm text-[var(--text-secondary)]">Select your preferred language</p>
                    </div>
                  </div>
                  <select
                    value={settings.language || 'en'}
                    onChange={(e) => {
                      console.log('Language changed to:', e.target.value);
                      handleSettingChange('language', e.target.value);
                    }}
                    className="border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] cursor-pointer bg-[var(--surface)]"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Learning Progress</p>
                    <p className="text-sm text-[var(--text-secondary)]">Get notified about your achievements and milestones</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.emailNotifications ?? true}
                    onChange={(checked) => {
                      console.log('Email notifications changed to:', checked);
                      handleSettingChange('emailNotifications', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Weekly Digest</p>
                    <p className="text-sm text-[var(--text-secondary)]">Summary of your weekly learning activity</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.weeklyDigest ?? true}
                    onChange={(checked) => {
                      console.log('Weekly digest changed to:', checked);
                      handleSettingChange('weeklyDigest', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Achievement Alerts</p>
                    <p className="text-sm text-[var(--text-secondary)]">Notifications for new badges and certificates</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.achievementAlerts ?? true}
                    onChange={(checked) => {
                      console.log('Achievement alerts changed to:', checked);
                      handleSettingChange('achievementAlerts', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Learning Reminders</p>
                    <p className="text-sm text-[var(--text-secondary)]">Daily reminders to maintain your streak</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.reminderAlerts ?? true}
                    onChange={(checked) => {
                      console.log('Reminder alerts changed to:', checked);
                      handleSettingChange('reminderAlerts', checked);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Mobile Notifications</p>
                      <p className="text-sm text-[var(--text-secondary)]">Receive notifications on your mobile device</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings.pushNotifications ?? true}
                    onChange={(checked) => {
                      console.log('Push notifications changed to:', checked);
                      handleSettingChange('pushNotifications', checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Profile Visibility</p>
                    <p className="text-sm text-[var(--text-secondary)]">Control who can see your profile</p>
                  </div>
                  <select
                    value={settings.profileVisibility || 'public'}
                    onChange={(e) => {
                      console.log('Profile visibility changed to:', e.target.value);
                      handleSettingChange('profileVisibility', e.target.value);
                    }}
                    className="border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] cursor-pointer bg-[var(--surface)]"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Show Learning Progress</p>
                    <p className="text-sm text-[var(--text-secondary)]">Display your progress on your public profile</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.showProgress ?? true}
                    onChange={(checked) => {
                      console.log('Show progress changed to:', checked);
                      handleSettingChange('showProgress', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Show Badges</p>
                    <p className="text-sm text-[var(--text-secondary)]">Display your earned badges publicly</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.showBadges ?? true}
                    onChange={(checked) => {
                      console.log('Show badges changed to:', checked);
                      handleSettingChange('showBadges', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Allow Messages</p>
                    <p className="text-sm text-[var(--text-secondary)]">Let other users send you messages</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.allowMessages ?? true}
                    onChange={(checked) => {
                      console.log('Allow messages changed to:', checked);
                      handleSettingChange('allowMessages', checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'learning':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Daily Learning Goal</p>
                    <p className="text-sm text-[var(--text-secondary)]">Minutes per day you want to spend learning</p>
                  </div>
                  <select
                    value={settings.dailyGoal || 30}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log('Daily goal changed to:', value);
                      handleSettingChange('dailyGoal', value);
                    }}
                    className="border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] cursor-pointer bg-[var(--surface)]"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Difficulty Level</p>
                    <p className="text-sm text-[var(--text-secondary)]">Adjust content difficulty for your skill level</p>
                  </div>
                  <select
                    value={settings.difficultyLevel || 'intermediate'}
                    onChange={(e) => {
                      console.log('Difficulty level changed to:', e.target.value);
                      handleSettingChange('difficultyLevel', e.target.value);
                    }}
                    className="border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] cursor-pointer bg-[var(--surface)]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Auto-Save Progress</p>
                    <p className="text-sm text-[var(--text-secondary)]">Automatically save your progress as you learn</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.autoSave ?? true}
                    onChange={(checked) => {
                      console.log('Auto-save changed to:', checked);
                      handleSettingChange('autoSave', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Skip Introductions</p>
                    <p className="text-sm text-[var(--text-secondary)]">Skip intro videos for lessons you've seen before</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.skipIntros ?? false}
                    onChange={(checked) => {
                      console.log('Skip intros changed to:', checked);
                      handleSettingChange('skipIntros', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Show Hints</p>
                    <p className="text-sm text-[var(--text-secondary)]">Display helpful hints during exercises</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.showHints ?? true}
                    onChange={(checked) => {
                      console.log('Show hints changed to:', checked);
                      handleSettingChange('showHints', checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Accessibility</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Font Size</p>
                    <p className="text-sm text-[var(--text-secondary)]">Adjust text size for better readability</p>
                  </div>
                  <select
                    value={settings.fontSize || 'medium'}
                    onChange={(e) => {
                      console.log('Font size changed to:', e.target.value);
                      handleSettingChange('fontSize', e.target.value);
                    }}
                    className="border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] cursor-pointer bg-[var(--surface)]"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">High Contrast</p>
                    <p className="text-sm text-[var(--text-secondary)]">Increase contrast for better visibility</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.highContrast ?? false}
                    onChange={(checked) => {
                      console.log('High contrast changed to:', checked);
                      handleSettingChange('highContrast', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Reduced Motion</p>
                    <p className="text-sm text-[var(--text-secondary)]">Minimize animations and transitions</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.reducedMotion ?? false}
                    onChange={(checked) => {
                      console.log('Reduced motion changed to:', checked);
                      handleSettingChange('reducedMotion', checked);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Sound Effects</p>
                      <p className="text-sm text-[var(--text-secondary)]">Play sounds for interactions and achievements</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings.soundEffects ?? true}
                    onChange={(checked) => {
                      console.log('Sound effects changed to:', checked);
                      handleSettingChange('soundEffects', checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900">Export Your Data</p>
                      <p className="text-sm text-blue-700">Download a copy of all your learning data</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <span>Export</span>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3 flex-1">
                    <Database className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900">Storage Usage</p>
                      <p className="text-sm text-yellow-700">
                        {isLoadingStorage ? (
                          'Loading...'
                        ) : (
                          `You've used ${storageData.usedMB} MB of ${storageData.maxMB} MB available`
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-900">{storageData.percentage}%</p>
                    <div className="w-20 h-2 bg-yellow-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-yellow-500 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(storageData.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-900">Clear All Data</p>
                      <p className="text-sm text-red-700">Permanently delete all your progress and data</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowClearModal(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="h-5 w-5 hover:opacity-70" />
            </button>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--surface)] rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-[var(--accent-error)]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Confirm Data Deletion</h3>
            </div>
            <p className="text-[var(--text-secondary)] mb-6">
              Are you sure you want to permanently delete all your progress and data? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowClearModal(false)}
                disabled={isClearing}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                disabled={isClearing}
                className="flex-1 px-4 py-2 bg-[var(--accent-error)] text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <span>Delete All Data</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-[var(--brand-primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--brand-primary-hover)] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4 sticky top-8">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/20'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] capitalize">
                  {activeSection} Settings
                </h2>
                <p className="text-[var(--text-secondary)] mt-1">
                  Customize your {activeSection} preferences and options
                </p>
              </div>

              {renderSettingsContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
