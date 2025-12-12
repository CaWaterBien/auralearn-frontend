'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { 
  User, 
  Settings, 
  BarChart3, 
  Trophy, 
  HelpCircle, 
  LogOut, 
  Edit3,
  BookOpen,
  Zap,
  Award,
  ChevronDown
} from 'lucide-react';

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate optimal dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 500; // Approximate height of dropdown
      
      // Check if there's enough space below the button
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // If not enough space below, but enough space above, position it above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: <Edit3 className="h-4 w-4" />,
      label: 'Edit Profile',
      href: '/profile/edit',
      description: 'Manage your account settings'
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: 'Settings',
      href: '/settings',
      description: 'Customize your experience'
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      label: 'FAQ',
      href: '/faq',
      description: 'Get help and answers'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200 group"
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white/20">
              {getInitials(user.fullName)}
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        {/* Name and chevron */}
        <div className="hidden lg:flex items-center space-x-2">
          <span className="font-medium text-sm">{user.fullName.split(' ')[0]}</span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute ${
          dropdownPosition === 'bottom' 
            ? 'top-full mt-2' 
            : 'bottom-full mb-2'
        } right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-200 ${
          isOpen ? 'opacity-100 translate-y-0 z-[100]' : 'opacity-0 -translate-y-2 pointer-events-none z-[100]'
        }`}
        style={{
          maxHeight: dropdownPosition === 'bottom' 
            ? 'calc(100vh - 100px)' 
            : 'calc(100vh - 100px)',
          overflowY: 'auto'
        }}
      >
        {/* User Info Header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {getInitials(user.fullName)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{user.fullName}</h3>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">{user.progress.streak} day streak</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-gray-600">Rank #{user.progress.rank}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section - Simplified */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Recent Progress</span>
            <span className="text-xs text-purple-600 font-semibold">{user.progress.totalPoints} points</span>
          </div>
          
          {/* Current Course - Compact */}
          {user.progress.currentCourse && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-3 w-3 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 truncate">{user.progress.currentCourse}</span>
              </div>
              <span className="text-xs text-gray-500">{Math.round((user.progress.completedCourses / user.progress.totalCourses) * 100)}%</span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                {item.icon}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <div className="border-t border-gray-100 pt-2">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <div className="ml-3 flex-1 text-left">
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs text-gray-500">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 