'use client';

import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Camera, 
  Save,
  ArrowLeft,
  Bell,
  Globe,
  Palette,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProfileEditPage() {
  const { user, isAuthenticated, loading, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    theme: user?.preferences?.theme || 'light',
    notifications: user?.preferences?.pushNotifications || true,
    language: user?.preferences?.language || 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSaveProfile = () => {
    // Update user profile
    updateUser({
      ...user,
      fullName: formData.fullName,
      email: formData.email,
      avatar: formData.avatar,
      preferences: {
        ...user?.preferences,
        theme: formData.theme as 'light' | 'dark',
        notifications: formData.notifications,
        language: formData.language
      } as any
    });

    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // In a real app, you would verify current password and update
    setSuccessMessage('Password updated successfully!');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b6967e2b?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 shadow-lg">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.fullName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-purple-200">
                      {getInitials(formData.fullName)}
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-2 hover:bg-purple-600 transition-colors shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-4">{formData.fullName}</h2>
                <p className="text-[var(--text-secondary)]">{formData.email}</p>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{user.progress.totalPoints}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{user.progress.streak}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{user.progress.rank}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] h-5 w-5" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-tertiary)] text-[var(--text-primary)] bg-[var(--surface)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-tertiary)] text-[var(--text-primary)] bg-[var(--surface)]"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Choose Avatar</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {avatarOptions.map((avatarUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setFormData(prev => ({ ...prev, avatar: avatarUrl }))}
                          className={`w-16 h-16 rounded-full overflow-hidden border-4 transition-all ${
                            formData.avatar === avatarUrl 
                              ? 'border-purple-500 ring-2 ring-purple-200' 
                              : 'border-[var(--border)] hover:border-purple-300'
                          }`}
                        >
                          <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] h-5 w-5" />
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] h-5 w-5" />
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-[var(--text-tertiary)]" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Email Notifications</p>
                      <p className="text-sm text-[var(--text-secondary)]">Receive updates about your progress</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800">Delete Account</p>
                    <p className="text-sm text-red-600">This action cannot be undone. All your progress will be lost.</p>
                  </div>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 