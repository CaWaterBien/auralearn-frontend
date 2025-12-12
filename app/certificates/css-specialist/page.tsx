'use client';

import { useState } from 'react';
import Header from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Play, Lock, BookOpen, Palette, Target, Award, Clock, Users } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  locked: boolean;
}

const modules: Module[] = [
  {
    id: 'css-fundamentals',
    title: 'CSS Fundamentals',
    description: 'Learn CSS basics, selectors, and properties',
    duration: '2.5 hours',
    lessons: 10,
    completed: false,
    locked: false
  },
  {
    id: 'box-model',
    title: 'Box Model',
    description: 'Understanding margin, border, padding, and content',
    duration: '2 hours',
    lessons: 8,
    completed: false,
    locked: false
  },
  {
    id: 'layout-techniques',
    title: 'Layout Techniques',
    description: 'Floats, positioning, and display properties',
    duration: '3 hours',
    lessons: 12,
    completed: false,
    locked: false
  },
  {
    id: 'flexbox',
    title: 'Flexbox Layout',
    description: 'Modern CSS flexbox for flexible layouts',
    duration: '3.5 hours',
    lessons: 15,
    completed: false,
    locked: false
  },
  {
    id: 'css-grid',
    title: 'CSS Grid',
    description: 'Two-dimensional layout system with CSS Grid',
    duration: '4 hours',
    lessons: 18,
    completed: false,
    locked: false
  },
  {
    id: 'typography',
    title: 'Typography',
    description: 'Font properties, web fonts, and text styling',
    duration: '2.5 hours',
    lessons: 10,
    completed: false,
    locked: false
  },
  {
    id: 'colors-and-backgrounds',
    title: 'Colors and Backgrounds',
    description: 'Color theory, gradients, and background properties',
    duration: '3 hours',
    lessons: 12,
    completed: false,
    locked: false
  },
  {
    id: 'transforms-and-animations',
    title: 'Transforms and Animations',
    description: 'CSS transforms, transitions, and keyframe animations',
    duration: '4 hours',
    lessons: 16,
    completed: false,
    locked: false
  },
  {
    id: 'responsive-design',
    title: 'Responsive Design',
    description: 'Media queries and mobile-first design principles',
    duration: '3.5 hours',
    lessons: 14,
    completed: false,
    locked: false
  },
  {
    id: 'css-preprocessors',
    title: 'CSS Preprocessors',
    description: 'Introduction to SASS/SCSS and advanced CSS features',
    duration: '3 hours',
    lessons: 12,
    completed: false,
    locked: false
  },
  {
    id: 'css-frameworks',
    title: 'CSS Frameworks',
    description: 'Working with Bootstrap, Tailwind, and other frameworks',
    duration: '2.5 hours',
    lessons: 10,
    completed: false,
    locked: false
  },
  {
    id: 'browser-compatibility',
    title: 'Browser Compatibility',
    description: 'Cross-browser testing and CSS fallbacks',
    duration: '2 hours',
    lessons: 8,
    completed: false,
    locked: false
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'CSS optimization techniques and best practices',
    duration: '2.5 hours',
    lessons: 9,
    completed: false,
    locked: false
  },
  {
    id: 'accessibility',
    title: 'CSS Accessibility',
    description: 'Making CSS accessible and inclusive for all users',
    duration: '2 hours',
    lessons: 7,
    completed: false,
    locked: false
  },
  {
    id: 'final-project',
    title: 'Final Project',
    description: 'Build a responsive website with advanced CSS techniques',
    duration: '8 hours',
    lessons: 1,
    completed: false,
    locked: false
  }
];

export default function CSSSpecialistPage() {
  const [currentModule, setCurrentModule] = useState<string>('css-fundamentals');
  const [overallProgress, setOverallProgress] = useState(0);

  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">CSS Specialist</h1>
                <p className="text-sm text-gray-500">Certificate Course</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {completedModules} of {totalModules} modules completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              CSS Specialist Certification
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Master advanced CSS techniques and become a styling expert. This comprehensive course covers modern CSS features including Flexbox, Grid, animations, responsive design, and best practices for creating beautiful, maintainable stylesheets.
            </p>
            
            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">30 Hours</p>
                <p className="text-sm text-gray-500">Total Duration</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">15 Modules</p>
                <p className="text-sm text-gray-500">Course Modules</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">Intermediate</p>
                <p className="text-sm text-gray-500">Skill Level</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">Free</p>
                <p className="text-sm text-gray-500">Course Access</p>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                <span className="text-sm font-medium text-gray-900">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 mb-4" />
              <p className="text-sm text-gray-600">
                {completedModules} of {totalModules} modules completed
              </p>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                CSS Specialist Certificate
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Earn your professional certificate upon completion
              </p>
              <Button className="w-full" disabled={overallProgress < 100}>
                {overallProgress === 100 ? 'Download Certificate' : 'Complete Course'}
              </Button>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Tabs value={currentModule} onValueChange={setCurrentModule} className="w-full">
          <TabsList className="grid w-full grid-cols-15 mb-6">
            {modules.map((module, index) => (
              <TabsTrigger
                key={module.id}
                value={module.id}
                className="flex flex-col items-center space-y-1 p-3"
                disabled={module.locked}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium">
                  {module.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : module.locked ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-center">{module.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {modules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{module.duration}</p>
                    <p className="text-sm text-gray-500">{module.lessons} lessons</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button 
                    className="flex items-center space-x-2"
                    disabled={false}
                  >
                    {module.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Module</span>
                      </>
                    )}
                  </Button>
                  
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
