'use client';

import { useState } from 'react';
import Header from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Play, Lock, BookOpen, Code, Target, Award, Clock, Users } from 'lucide-react';

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
    id: 'html-basics',
    title: 'HTML Basics',
    description: 'Learn the fundamentals of HTML structure and elements',
    duration: '2 hours',
    lessons: 8,
    completed: false,
    locked: false
  },
  {
    id: 'document-structure',
    title: 'Document Structure',
    description: 'Understanding HTML document structure and semantic elements',
    duration: '1.5 hours',
    lessons: 6,
    completed: false,
    locked: false
  },
  {
    id: 'text-elements',
    title: 'Text Elements',
    description: 'Working with headings, paragraphs, and text formatting',
    duration: '2.5 hours',
    lessons: 10,
    completed: false,
    locked: false
  },
  {
    id: 'links-and-navigation',
    title: 'Links and Navigation',
    description: 'Creating hyperlinks and navigation structures',
    duration: '2 hours',
    lessons: 7,
    completed: false,
    locked: false
  },
  {
    id: 'images-and-media',
    title: 'Images and Media',
    description: 'Adding images, videos, and audio to your web pages',
    duration: '3 hours',
    lessons: 12,
    completed: false,
    locked: false
  },
  {
    id: 'forms-and-inputs',
    title: 'Forms and Inputs',
    description: 'Building interactive forms with various input types',
    duration: '4 hours',
    lessons: 15,
    completed: false,
    locked: false
  },
  {
    id: 'tables',
    title: 'Tables',
    description: 'Creating and styling data tables',
    duration: '2 hours',
    lessons: 8,
    completed: false,
    locked: false
  },
  {
    id: 'semantic-html',
    title: 'Semantic HTML',
    description: 'Using semantic elements for better accessibility and SEO',
    duration: '3 hours',
    lessons: 10,
    completed: false,
    locked: false
  },
  {
    id: 'html5-features',
    title: 'HTML5 Features',
    description: 'Modern HTML5 elements and APIs',
    duration: '3.5 hours',
    lessons: 12,
    completed: false,
    locked: false
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    description: 'Making your HTML accessible to all users',
    duration: '2.5 hours',
    lessons: 9,
    completed: false,
    locked: false
  },
  {
    id: 'seo-basics',
    title: 'SEO Basics',
    description: 'HTML elements that help with search engine optimization',
    duration: '2 hours',
    lessons: 7,
    completed: false,
    locked: false
  },
  {
    id: 'final-project',
    title: 'Final Project',
    description: 'Build a complete website using all learned concepts',
    duration: '6 hours',
    lessons: 1,
    completed: false,
    locked: false
  }
];

export default function HTML5DeveloperPage() {
  const [currentModule, setCurrentModule] = useState<string>('html-basics');
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">HTML5 Developer</h1>
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
              HTML5 Developer Certification
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Master HTML fundamentals and build modern, accessible web pages. This comprehensive course covers everything from basic HTML structure to advanced HTML5 features, semantic markup, and best practices for web development.
            </p>
            
            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">24 Hours</p>
                <p className="text-sm text-gray-500">Total Duration</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">12 Modules</p>
                <p className="text-sm text-gray-500">Course Modules</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">Beginner</p>
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
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                HTML5 Developer Certificate
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
          <TabsList className="grid w-full grid-cols-12 mb-6">
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
