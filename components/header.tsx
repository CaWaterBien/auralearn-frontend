'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, Moon, Sun, User, ChevronDown, Code, BookOpen, Award, Settings, Play, Database, Globe, Zap, Users as UsersIcon, BarChart3, Edit3, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import UserProfileDropdown from './user-profile-dropdown'
import { getCourses, type Course } from '@/lib/course-api'
import AuraLearnLogo from '@/app/assets/AuraLearn.png'
import HTML5Logo from '@/app/assets/HTML5.png'

// Types
interface NavItem {
  readonly title: string
  readonly description: string
  readonly href: string
  readonly icon: React.ReactNode
  readonly badge?: string
}

interface NavSection {
  readonly title: string
  readonly items: readonly NavItem[]
}

// Static navigation data (non-lessons)
const STATIC_NAVIGATION_DATA: { [key: string]: NavSection[] } = {
  exercises: [],
  certificates: [],
  services: []
}

// Helper function to convert courses to navigation format
const convertCoursesToNavItems = (courses: Course[]): NavItem[] => {
  return courses.map(course => {
    // Create a URL-friendly path from the course slug
    const href = course.slug === 'html5-tutorial' ? '/html' : `/course/${course.slug}`;
    
    // Use HTML5 logo for HTML5 courses, book icon for others
    const getIcon = () => {
      if (course.slug === 'html5-tutorial' || course.title.toLowerCase().includes('html')) {
        return (
          <Image 
            src={HTML5Logo} 
            alt="HTML5" 
            width={16} 
            height={16}
            className="w-4 h-4 object-contain"
          />
        );
      }
      return <BookOpen className="h-4 w-4" />;
    };
    
    return {
      title: course.title,
      description: course.description || `Learn ${course.title} fundamentals`,
      href: href,
      icon: getIcon(),
      badge: course.is_free ? "Free" : "Pro"
    };
  });
};

// Components
const Logo = () => (
  <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
    <div className="hover:scale-110 transition-transform duration-200">
      <Image 
        src={AuraLearnLogo} 
        alt="AuraLearn Logo" 
        width={56} 
        height={56}
        className="w-14 h-14 object-contain"
      />
    </div>
    <span className="text-xl font-bold tracking-wide text-white">AuraLearn</span>
  </Link>
)

const SearchBar = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => (
  <div className="hidden lg:flex relative flex-1 max-w-md mx-4" suppressHydrationWarning>
    <Input
      type="text"
      placeholder="Search HTML5..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-[var(--surface)]/95 text-[var(--text-primary)] border-none rounded-full h-9 pr-10 pl-4 shadow-sm focus:shadow-md focus:bg-[var(--surface)] transition-all duration-200 placeholder:text-[var(--text-secondary)]"
    />
    <Button 
      size="sm" 
      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-full p-0"
    >
      <Search className="h-3 w-3 text-white" />
    </Button>
  </div>
)

const ActionButtons = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="hidden lg:flex text-white hover:bg-[var(--surface)]/10 p-2 rounded-lg transition-all duration-200"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      
      {isAuthenticated ? (
        <UserProfileDropdown />
      ) : (
        <Link href="/signin">
          <Button className="bg-gradient-to-r from-[#00AA6C] to-[#00C774] hover:from-[#008A5A] hover:to-[#00A862] text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
}

const Badge = ({ type }: { type: string }) => {
  const badgeStyles = {
    Free: 'bg-green-100 text-green-800',
    Pro: 'bg-blue-100 text-blue-800',
    Premium: 'bg-purple-100 text-purple-800',
    Enterprise: 'bg-[var(--surface-active)] text-[var(--text-primary)]'
  } as const

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[type as keyof typeof badgeStyles] || badgeStyles.Enterprise}`}>
      {type}
    </span>
  )
}

const DropdownContent = ({ data, type }: { data: readonly NavSection[]; type: string }) => {
  // Special handling for lessons dropdown to avoid redundancy
  if (type === 'lessons') {
    const allLessons = data.flatMap(section => section.items);
    return (
      <>
        <div className="px-4 pb-2 border-b border-[var(--divider)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Available Courses</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Choose a course to start learning</p>
        </div>
        <div className="max-h-96 overflow-y-auto px-4 py-3">
          <div className="space-y-2">
            {allLessons.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                href={item.href}
                className="flex items-center p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--surface-active)] rounded-lg flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                      {item.title}
                    </p>
                    {item.badge && <Badge type={item.badge} />}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Regular dropdown content for other sections
  return (
    <>
      <div className="px-4 pb-2 border-b border-[var(--divider)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] capitalize">{type}</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {data.map((section, sectionIndex) => (
          <div key={sectionIndex} className="px-4 py-3">
            <h4 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-3">{section.title}</h4>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className="flex items-center p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--surface-active)] rounded-lg flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                        {item.title}
                      </p>
                      {item.badge && <Badge type={item.badge} />}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const DropdownButton = ({ 
  children, 
  type, 
  data, 
  isActive, 
  onToggle, 
  onMouseEnter 
}: { 
  children: React.ReactNode
  type: string
  data: readonly NavSection[]
  isActive: boolean
  onToggle: () => void
  onMouseEnter: () => void
}) => (
  <div className="relative">
    <button
      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium hover:bg-[var(--surface)]/10 rounded-lg transition-all duration-200"
      onMouseEnter={onMouseEnter}
      onClick={onToggle}
    >
      {children}
      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
    </button>
    <div 
      className={`absolute top-full left-0 mt-2 w-96 bg-[var(--surface)] rounded-xl shadow-2xl border border-[var(--border)] py-4 z-50 transition-all duration-200 ${
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <DropdownContent data={data} type={type} />
    </div>
  </div>
)

const Navigation = ({ 
  activeDropdown, 
  setActiveDropdown,
  dropdownRef,
  dynamicLessonsData
}: { 
  activeDropdown: string | null
  setActiveDropdown: (dropdown: string | null) => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
  dynamicLessonsData: readonly NavSection[]
}) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <nav className="hidden lg:flex items-center space-x-3" ref={dropdownRef}>
      <DropdownButton 
        type="lessons" 
        data={dynamicLessonsData}
        isActive={activeDropdown === "lessons"}
        onToggle={() => setActiveDropdown(activeDropdown === "lessons" ? null : "lessons")}
        onMouseEnter={() => setActiveDropdown("lessons")}
      >
        <BookOpen className="h-4 w-4 mr-1" />
        Lessons
      </DropdownButton>
      
      {/* Dashboard - Only show when authenticated */}
      {isAuthenticated && (
        <Link
          href="/dashboard"
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap"
          style={{ color: 'white' }}
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
      )}
      
      {/* Achievements - Only show when authenticated */}
      {isAuthenticated && (
        <Link
          href="/achievements"
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap"
          style={{ color: 'white' }}
        >
          <Award className="h-4 w-4 mr-1" />
          Achievements
        </Link>
      )}
      
      {/* Temporarily hidden - Exercises dropdown */}
      {/* <DropdownButton 
        type="exercises" 
        data={STATIC_NAVIGATION_DATA.exercises}
        isActive={activeDropdown === "exercises"}
        onToggle={() => setActiveDropdown(activeDropdown === "exercises" ? null : "exercises")}
        onMouseEnter={() => setActiveDropdown("exercises")}
      >
        <Play className="h-4 w-4 mr-1" />
        Exercises
      </DropdownButton> */}
      
      {/* Temporarily hidden - Certificates dropdown */}
      {/* <DropdownButton 
        type="certificates" 
        data={STATIC_NAVIGATION_DATA.certificates}
        isActive={activeDropdown === "certificates"}
        onToggle={() => setActiveDropdown(activeDropdown === "certificates" ? null : "certificates")}
        onMouseEnter={() => setActiveDropdown("certificates")}
      >
        <Award className="h-4 w-4 mr-1" />
        Certificates
      </DropdownButton> */}
      
      {/* Temporarily hidden - Services dropdown */}
      {/* <DropdownButton 
        type="services" 
        data={STATIC_NAVIGATION_DATA.services}
        isActive={activeDropdown === "services"}
        onToggle={() => setActiveDropdown(activeDropdown === "services" ? null : "services")}
        onMouseEnter={() => setActiveDropdown("services")}
      >
        <Settings className="h-4 w-4 mr-1" />
        Services
      </DropdownButton> */}
    </nav>
  );
}

const MobileMenu = ({ 
  isOpen, 
  searchQuery, 
  setSearchQuery,
  dynamicLessonsData
}: { 
  isOpen: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  dynamicLessonsData: readonly NavSection[]
}) => {
  const { isAuthenticated, user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    isOpen && (
      <div className="lg:hidden bg-gradient-to-b from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search tutorials, exercises, certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[var(--surface)]/95 text-[var(--text-primary)] border-none rounded-full h-10 pr-10 pl-4 shadow-md placeholder:text-[var(--text-secondary)]"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-full p-0"
              >
                <Search className="h-3 w-3 text-white" />
              </Button>
            </div>
            
            {/* User Profile or Sign In */}
            {isAuthenticated && user ? (
              <div className="border-b border-white/20 pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white/20">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{user.fullName}</h3>
                    <p className="text-sm text-white/70 truncate">{user.email}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-white/80">{user.progress.streak} day streak</span>
                      <span className="text-xs text-white/80">Rank #{user.progress.rank}</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center px-3 py-2 bg-[var(--surface)]/10 rounded-lg hover:bg-[var(--surface)]/20 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                  <Link
                    href="/achievements"
                    className="flex items-center justify-center px-3 py-2 bg-[var(--surface)]/10 rounded-lg hover:bg-[var(--surface)]/20 transition-colors"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    <span className="text-sm">Achievements</span>
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="flex items-center justify-center px-3 py-2 bg-[var(--surface)]/10 rounded-lg hover:bg-[var(--surface)]/20 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    <span className="text-sm">Profile</span>
                  </Link>
                </div>
                
                <Button
                  onClick={signOut}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 font-semibold shadow-lg rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : null}
            
            {/* Mobile Navigation */}
            <div className="border-t border-white/20 pt-4 space-y-2">
              {/* Dynamic Lessons Section */}
              <div className="space-y-2">
                <div className="text-white py-2 px-4 font-medium text-sm uppercase tracking-wide opacity-75">
                  Lessons
                </div>
                {dynamicLessonsData[0]?.items.slice(0, 5).map((item) => (
                  <Link 
                    key={item.title}
                    href={item.href} 
                    className="block text-white py-2 px-6 rounded-lg hover:bg-[var(--surface)]/10 transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* Static Navigation Sections */}
              {Object.entries(STATIC_NAVIGATION_DATA).map(([key, sections]) => (
                sections.length > 0 && sections[0] && sections[0].items.length > 0 && (
                  <div key={key} className="space-y-2">
                    <div className="text-white py-2 px-4 font-medium text-sm uppercase tracking-wide opacity-75">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                    {sections[0].items.slice(0, 2).map((item) => (
                      <Link 
                        key={item.title}
                        href={item.href} 
                        className="block text-white py-2 px-6 rounded-lg hover:bg-[var(--surface)]/10 transition-colors"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )
              ))}
            </div>
            
            {/* Mobile Actions */}
            <div className="border-t border-white/20 pt-4 space-y-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full text-white bg-white/10 hover:bg-white/20 py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              
              {!isAuthenticated && (
                <Link href="/signin">
                  <Button className="bg-gradient-to-r from-[#00AA6C] to-[#00C774] hover:from-[#008A5A] hover:to-[#00A862] text-white w-full py-3 font-semibold shadow-lg rounded-lg">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

// Main Header Component
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [lessonsNavData, setLessonsNavData] = useState<readonly NavSection[]>([{
    title: "Lessons",
    items: [{ 
      title: "HTML5", 
      description: "Learn HTML5 fundamentals", 
      href: "/html", 
      icon: (
        <Image 
          src={HTML5Logo} 
          alt="HTML5" 
          width={16} 
          height={16}
          className="w-4 h-4 object-contain"
        />
      )
    }]
  }])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load courses from backend API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses()
        setCourses(response.courses)
        
        // Convert courses to navigation data
        const navItems = convertCoursesToNavItems(response.courses)
        setLessonsNavData([{
          title: "Lessons", 
          items: navItems
        }])
      } catch (error) {
        console.error('Failed to load courses for navigation:', error)
        // Keep fallback data if API fails
      }
    }

    loadCourses()
  }, [])

  // Effects
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <header className={`sticky top-0 z-40 bg-[var(--background)] transition-shadow duration-200 ${isScrolled ? 'shadow-md' : 'border-b border-[var(--border)]'}`} suppressHydrationWarning>
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg" suppressHydrationWarning>
        <div className="w-full px-4 lg:px-6" suppressHydrationWarning>
          <div className="flex items-center justify-between h-16 w-full" suppressHydrationWarning>
            {/* Left Section: Logo + Navigation */}
            <div className="flex items-center space-x-8" suppressHydrationWarning>
              <Logo />
              <Navigation 
                activeDropdown={activeDropdown} 
                setActiveDropdown={setActiveDropdown}
                dropdownRef={dropdownRef}
                dynamicLessonsData={lessonsNavData}
              />
            </div>

            {/* Center Section: Search Bar */}
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Right Section: Actions */}
            <ActionButtons />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white ml-auto"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dynamicLessonsData={lessonsNavData}
      />
    </header>
  )
}


