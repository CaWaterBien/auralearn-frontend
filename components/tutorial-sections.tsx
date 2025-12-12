'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { App as AntdApp } from 'antd'
import { CodeOutlined } from '@ant-design/icons'
import { Code2 } from 'lucide-react'
import { openHtmlPlayground } from '@/lib/open-playground'

export default function TutorialSections() {
  const { message, notification } = AntdApp.useApp()

  const handleTryIt = (language: string, code?: string) => {
    message.success(`Opening ${language} playground...`)
    notification.open({
      message: `${language} Playground`,
      description: `Try coding ${language} in our interactive playground!`,
      icon: <CodeOutlined style={{ color: '#9929EA' }} />,
      placement: 'topRight',
    })
    if (code) openHtmlPlayground(code, '/')
  }

  const courses = [
    {
      id: 'html',
      title: 'HTML5',
      subtitle: 'Structure the Web',
      description: 'Learn the building blocks of web development with HTML5. Master semantic markup, forms, and modern HTML5 features.',
      icon: <Code2 className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-[var(--accent-warning-light)] to-[var(--accent-error-light)]',
      borderColor: 'border-[var(--border)]',
      textColor: 'text-[var(--text-primary)]',
      href: '/html',
      difficulty: 'Beginner',
      duration: '4 weeks',
      lessons: 35,
      rating: 4.8,
      students: '120k+',
      codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to HTML</p>
</body>
</html>`,
      features: ['Semantic HTML', 'Forms & Input', 'HTML5 APIs', 'Accessibility']
    }
  ];

  return (
    <>
      <div className="space-y-16">
        {courses.map((course, index) => (
          <div key={course.id} className={`bg-gradient-to-br ${course.bgColor} rounded-3xl p-8 md:p-12 border-2 ${course.borderColor} shadow-xl`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Course Information */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} space-y-8`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {course.icon}
                  </div>
                  <div>
                    <h2 className="text-5xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight">
                      {course.title}
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] font-medium">{course.subtitle}</p>
                  </div>
                </div>

                <p className="text-lg text-[var(--text-primary)] leading-relaxed">{course.description}</p>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[var(--surface-hover)] rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{course.lessons}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Lessons</div>
                  </div>
                    <div className="bg-[var(--surface-hover)] rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{course.duration}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Duration</div>
                  </div>
                    <div className="bg-[var(--surface-hover)] rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-2xl font-bold text-[var(--text-primary)]">{course.rating}</span>
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">Rating</div>
                  </div>
                    <div className="bg-[var(--surface-hover)] rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{course.students}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Students</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">What you'll learn:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-[var(--text-primary)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={course.href} className="flex-1">
                    <Button className={`w-full bg-gradient-to-r ${course.color} text-white text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}>
                      Start Learning
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className={`flex-1 border-2 ${course.borderColor} ${course.textColor} hover:bg-[var(--surface)]/80 text-lg py-4 rounded-xl font-semibold`}
                    onClick={() => handleTryIt(course.title, course.codeExample)}
                  >
                    Try Demo
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>{course.difficulty} level</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Certificate included</span>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-[var(--surface)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]">
                  {/* Code Editor Header */}
                  <div className="bg-gradient-to-r from-[var(--surface-active)] to-[var(--surface)] p-4 flex items-center justify-between border-b border-[var(--border)]">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-[var(--text-primary)] text-sm font-medium">{course.title} Example</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-gradient-to-r ${course.color} rounded-full`}></div>
                      <span className="text-[var(--text-secondary)] text-xs">Live Editor</span>
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="bg-gradient-to-br from-[var(--code-bg)] to-[var(--surface-active)] p-6">
                    <pre className="text-sm overflow-x-auto">
                      <code className="text-[var(--text-primary)] font-mono leading-relaxed">
                        {course.codeExample}
                      </code>
                    </pre>
                  </div>

                  {/* Try It Button */}
                  <div className="p-6 bg-[var(--surface-hover)]">
                    <Button 
                      className={`w-full bg-gradient-to-r ${course.color} text-white text-lg py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                      onClick={() => handleTryIt(course.title, course.codeExample)}
                    >
                      Run This Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
